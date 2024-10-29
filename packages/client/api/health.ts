import { VercelRequest, VercelResponse } from "@vercel/node"

// CORS configuration
export const allowCors = (fn: (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse>) => async (
  req: VercelRequest,
  res: VercelResponse
) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://www.mozz.online'
    : 'http://localhost:5179')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Call the actual handler
  return await fn(req, res)
}

async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  })
}

export default allowCors(handler)  // Wrap the handler with CORS support
