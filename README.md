# 🍕 Mozz™️ – Pizza Management System
[![Tests](https://github.com/claybailey2/mozz/actions/workflows/test.yml/badge.svg)](https://github.com/claybailey2/mozz/actions/workflows/test.yml?branch=main)
[![Deploy](https://vercel.com/button)](https://mozz-client-claybailey2s-projects.vercel.app)

A modern web application for managing pizza stores, toppings, and chef collaborations. Built with React, TypeScript, and Supabase.

[Live Demo - www.mozz.online](https://www.mozz.online)


## Features

### For Store Owners
- Create and manage multiple store locations
- Manage available toppings inventory
- Invite and manage chef access
- Real-time updates on menu changes

### For Chefs
- Create and customize pizzas
- Access to store-specific toppings
- Collaborate with other chefs
- Real-time view of menu updates

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Zustand for state management
- TailwindCSS + shadcn/ui for styling
- Vite for development and building

### Backend
- Supabase for:
  - Authentication
  - Database
  - Real-time updates
  - Row Level Security
- Express.js API (TypeScript)

## Project Structure

```bash
├── packages/
│   ├── client/           # React frontend
│   │   ├── src/
│   │   │   ├── features/  # Feature-based organization
│   │   │   ├── lib/       # Shared utilities
│   │   │   └── pages/     # Route components
│   │   └── public/        # Static assets
│   └── server/           # Backend services
│       └── supabase/     # Supabase configuration
```

## Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://www.github.com/claybailey2/mozz.git
   cd mozz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy example env files
   cp packages/client/.env.example packages/client/.env
   ```
   
   This will configure the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You may update these values in the `.env` file with your Supabase project credentials.

4. Start the development server:
   ```bash
   # Run both frontend and backend
   npm run dev
   ```
   
   Vite frontend typically runs at `http://localhost:5173`, while the Supabase backend will be available on `http://[docker-container]:54321` (e.g.`http://127.0.0.1:54321 `) by default.

### Running Tests Locally

1. Start the Supabase local instance:
```bash
npx supabase start
```

2. Run the test suite:
```bash
npm run test
```

3. View coverage report:
```bash
npm run test:coverage
```

## Building for Production

```bash
npm run build
```

## Deployment

The application is configured for deployment on Vercel:

1. Frontend: Automatically deploys from the `packages/client` directory
2. Supabase: Database and authentication are hosted on Supabase cloud

## Architecture Decisions

- **Monorepo Structure**: Using npm workspaces for better code organization and dependency management
- **Feature-based Organization**: Components and logic are grouped by feature rather than type
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Real-time Updates**: Leveraging Supabase's real-time capabilities for live updates
- **Responsive Design**: TailwindCSS for utility-first styling
- **Component Library**: Using shadcn/ui for consistent, accessible components
- **Quering**: TanStack Query for efficient data fetching and caching
- **State Management**: Zustand for a simple and effective state management solution

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.