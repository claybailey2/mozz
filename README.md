# Pizza Management System

A web application for managing pizza stores, toppings, and chef assignments.

## Project Structure

- `/packages/client`: React frontend application
- `/packages/shared`: Shared TypeScript types and utilities
- `/packages/supabase`: Database migrations and seed data
- `DESIGN.md`: Architecture decisions and design documentation

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `packages/client/.env.example` to `packages/client/.env` and fill in your Supabase credentials
4. Start development server:
   ```bash
   npm run dev
   ```

## Deployment

The frontend application is deployed to Vercel. The database is hosted on Supabase.

### Frontend Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   npm run deploy
   ```

### Database Changes
1. Add new migrations to `packages/supabase/migrations`
2. Apply migrations through Supabase dashboard or CLI

## Environment Variables

Required environment variables in `packages/client/.env`:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key