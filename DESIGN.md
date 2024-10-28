# Pizza Management System Design Document

## Technology Choices

### Frontend
- **React**: Selected based on extensive production experience from current role, offering a robust ecosystem and proven component-based architecture
- **TypeScript**: Chosen for its static typing system which catches errors at compile time and provides excellent IDE support, enabling more maintainable code
- **TailwindCSS + shadcn/ui**: Provides a robust design system with pre-built accessible components while maintaining full styling flexibility

### Backend
- **Express.js with TypeScript**: Creates a full TypeScript stack, allowing shared types between frontend and backend while leveraging Node.js's extensive package ecosystem
- **Supabase**: Offers built-in authentication, real-time capabilities, and row-level security, significantly reducing authentication implementation time

# Sytem Architecture

## Backend Architecture

### Express Server Structure
- **Layered Architecture**: Implementing a clean separation of concerns with distinct layers:
  - Routes: Handle HTTP request routing
  - Controllers: Contain business logic and request handling
  - Services: Manage data operations and external integrations
  - Middleware: Handle cross-cutting concerns like authentication and error handling
  
- **Error Handling**: Centralized error handling middleware to ensure consistent error responses
- **Environment Configuration**: Using dotenv for secure configuration management
- **Type Safety**: Leveraging TypeScript for end-to-end type safety from request to response

## Workspace Configuration
- **NPM Workspaces**: Using scoped packages (`@pizza-management/*`) to organize our monorepo
- **Package Structure**:
  - `@pizza-management/shared`: Common types and utilities
  - `@pizza-management/server`: Express backend
  - `@pizza-management/client`: React frontend (to be added)
- **Workspace Dependencies**: Using `workspace:*` to ensure packages use local versions during development

## TypeScript Configuration
- **Shared Types**: Centralized type definitions in `@pizza-management/shared` ensure consistency between frontend and backend
- **Type Generation**: Automatic type definition generation for shared package consumption

## Build Configuration
- **Turborepo**: Using Turborepo for efficient build orchestration:
  - Manages dependencies between workspace packages
  - Caches build outputs for faster development
  - Handles parallel execution of tasks
  - Enforces build order (shared package builds before dependent packages)

## Package Dependencies
- **Version Management**: Using explicit versions for workspace dependencies to ensure compatibility
- **Build Pipeline**: Configured to ensure dependent packages are built in the correct order
- **Development Mode**: Set up with watch mode for real-time compilation during development

## Frontend Architecture

### React + Vite Setup
- **Vite**: Chosen for its superior development experience and build performance
- **TanStack Query**: Manages server state and caching with built-in hooks for data fetching
- **Zustand**: Provides lightweight client state management with minimal boilerplate
- **shadcn/ui**: Offers high-quality, customizable components built on Radix UI
- **TailwindCSS**: Enables rapid UI development with utility-first CSS

### Frontend Structure
- **Feature-based Organization**: Components and logic grouped by feature rather than type
- **Shared Components**: Reusable UI components and layouts
- **Route-based Code Splitting**: Automatic code splitting based on routes for optimal loading

## Supabase Integration

### Authentication Strategy
- **Row Level Security (RLS)**: Implementing granular data access control at the database level
- **User Roles**: Supporting two primary roles:
  - Store Owner: Can manage toppings and invite chefs
  - Chef: Can create and manage pizzas within assigned stores
- **Protected Routes**: Client-side route protection based on authentication state and user role

### Database Schema
- **Users**: Managed by Supabase Auth
- **Stores**: Stores with owner relationship
- **Store_Members**: Junction table for store-user relationships with roles
- **Toppings**: Store-specific toppings
- **Pizzas**: Chef-created pizzas with topping relationships

### Security Policies
- Store owners can only access their own stores
- Chefs can only access stores they're invited to
- Toppings are store-specific
- Pizzas are store-specific and chef-specific

### Email Service Configuration
- **SMTP Integration**: Using Gmail SMTP for development/testing
  - Gmail App Password authentication
  - SSL/TLS on port 465
  - 500 emails/day limit suitable for testing

