-- WARNING: This file is auto-generated. Do not edit directly.
-- Generated on Mon Oct 28 17:38:56 MST 2024




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."pizza_toppings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "pizza_id" "uuid" NOT NULL,
    "topping_id" "uuid" NOT NULL
);


ALTER TABLE "public"."pizza_toppings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pizzas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."pizzas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_members" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "role" "text" NOT NULL,
    "status" "text" DEFAULT 'invited'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "email" "text",
    CONSTRAINT "store_members_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'chef'::"text"]))),
    CONSTRAINT "store_members_status_check" CHECK (("status" = ANY (ARRAY['invited'::"text", 'active'::"text"])))
);


ALTER TABLE "public"."store_members" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."store_members_with_email" AS
 SELECT "sm"."id",
    "sm"."store_id",
    "sm"."user_id",
    "sm"."role",
    "sm"."status",
    "sm"."created_at",
    "sm"."email",
    COALESCE("sm"."email", ("au"."email")::"text") AS "user_email"
   FROM ("public"."store_members" "sm"
     LEFT JOIN "auth"."users" "au" ON (("au"."id" = "sm"."user_id")));


ALTER TABLE "public"."store_members_with_email" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stores" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "name" "text" NOT NULL
);


ALTER TABLE "public"."stores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."toppings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."toppings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."pizza_toppings"
    ADD CONSTRAINT "pizza_toppings_pizza_id_topping_id_key" UNIQUE ("pizza_id", "topping_id");



ALTER TABLE ONLY "public"."pizza_toppings"
    ADD CONSTRAINT "pizza_toppings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pizzas"
    ADD CONSTRAINT "pizzas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_members"
    ADD CONSTRAINT "store_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_members"
    ADD CONSTRAINT "store_members_store_id_user_id_key" UNIQUE ("store_id", "user_id");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."toppings"
    ADD CONSTRAINT "toppings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."toppings"
    ADD CONSTRAINT "toppings_store_id_name_key" UNIQUE ("store_id", "name");



ALTER TABLE ONLY "public"."store_members"
    ADD CONSTRAINT "unique_store_email" UNIQUE ("store_id", "email");



ALTER TABLE ONLY "public"."pizza_toppings"
    ADD CONSTRAINT "pizza_toppings_pizza_id_fkey" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pizza_toppings"
    ADD CONSTRAINT "pizza_toppings_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "public"."toppings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pizzas"
    ADD CONSTRAINT "pizzas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pizzas"
    ADD CONSTRAINT "pizzas_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_members"
    ADD CONSTRAINT "store_members_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_members"
    ADD CONSTRAINT "store_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."toppings"
    ADD CONSTRAINT "toppings_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."pizza_toppings" TO "anon";
GRANT ALL ON TABLE "public"."pizza_toppings" TO "authenticated";
GRANT ALL ON TABLE "public"."pizza_toppings" TO "service_role";



GRANT ALL ON TABLE "public"."pizzas" TO "anon";
GRANT ALL ON TABLE "public"."pizzas" TO "authenticated";
GRANT ALL ON TABLE "public"."pizzas" TO "service_role";



GRANT ALL ON TABLE "public"."store_members" TO "anon";
GRANT ALL ON TABLE "public"."store_members" TO "authenticated";
GRANT ALL ON TABLE "public"."store_members" TO "service_role";



GRANT ALL ON TABLE "public"."store_members_with_email" TO "anon";
GRANT ALL ON TABLE "public"."store_members_with_email" TO "authenticated";
GRANT ALL ON TABLE "public"."store_members_with_email" TO "service_role";



GRANT ALL ON TABLE "public"."stores" TO "anon";
GRANT ALL ON TABLE "public"."stores" TO "authenticated";
GRANT ALL ON TABLE "public"."stores" TO "service_role";



GRANT ALL ON TABLE "public"."toppings" TO "anon";
GRANT ALL ON TABLE "public"."toppings" TO "authenticated";
GRANT ALL ON TABLE "public"."toppings" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
