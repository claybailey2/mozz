import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, User } from "@supabase/supabase-js";

// Error handling utility
const handleError = (error: any, res: VercelResponse) => {
  console.error("Detailed error:", error);

  // Check if it's a Supabase error
  if (error?.message) {
    return res.status(500).json({
      error: error.message,
      code: error?.code || "UNKNOWN_ERROR",
    });
  }

  return res.status(500).json({
    error: "An unexpected error occurred",
    code: "INTERNAL_SERVER_ERROR",
  });
};

const allowCors =
  (fn: (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse>) =>
  async (req: VercelRequest, res: VercelResponse) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.NODE_ENV === "production"
        ? "https://www.mozz.online"
        : "http://localhost:5173"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    try {
      await fn(req, res);
    } catch (error) {
      return handleError(error, res);
    }
  };

async function handler(req: VercelRequest, res: VercelResponse) {
  // Check for required environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing required environment variables");
    return res.status(500).json({
      error: "Server configuration error",
      code: "CONFIG_ERROR",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    // Validate request body
    const { email, storeId, inviterId, role = "chef" } = req.body;

    if (!email || !storeId || !inviterId) {
      return res.status(400).json({
        error: "Missing required fields",
        code: "INVALID_REQUEST",
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the inviter has permission
    const { data: membership, error: membershipError } = await supabase
      .from("store_members")
      .select("role")
      .eq("store_id", storeId)
      .eq("user_id", inviterId)
      .single();

    if (membershipError) {
      console.error("Membership check error:", membershipError);
      return res.status(403).json({
        error: "Not authorized to invite to this store",
        code: "UNAUTHORIZED",
      });
    }

    if (!membership) {
      return res.status(403).json({
        error: "Not a member of this store",
        code: "NOT_MEMBER",
      });
    }

    // Check if user exists in auth.users
    const { data } = await supabase.auth.admin.listUsers();
    const existingUser =
      data?.users.filter((user: User) => user.email === email.toLowerCase()) ||
      [];
    const isExistingUser = existingUser.length > 0;

    // Create store member record
    const { error: memberError } = await supabase.from("store_members").insert({
      store_id: storeId,
      email: email.toLowerCase(),
      role,
      status: "invited",
    });

    if (memberError) {
      if (memberError.code === "23505") {
        // Unique violation
        return res.status(409).json({
          error: "User already invited to this store",
          code: "ALREADY_INVITED",
        });
      }
      throw memberError;
    }

    // Send magic link
    const redirectPath = isExistingUser ? "join-store" : "signup";
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: `https://www.mozz.online/${redirectPath}?store_id=${storeId}`,
        data: {
          store_id: storeId,
          invitation_type: isExistingUser ? "store" : "signup",
        },
      },
    });

    if (otpError) throw otpError;

    return res.status(200).json({
      success: true,
      isExistingUser,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    return handleError(error, res);
  }
}

// Export with CORS handling
export default allowCors(handler);
