# Overview

SocialHub is a full-stack social media management application built with React, Express, and TypeScript. It provides a unified dashboard for managing content across multiple social media platforms (Twitter, Instagram, LinkedIn), allowing users to create, schedule, and analyze posts from a single interface. The application features real-time analytics, engagement tracking, and a responsive design optimized for both desktop and mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with proper error handling middleware
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot reload with tsx for server development

## Authentication & Authorization
- **Provider**: Replit OIDC authentication system
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Middleware**: Custom authentication middleware for protected routes
- **User Management**: User profile creation and management through OIDC claims

## Database Design
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection**: Neon Database serverless PostgreSQL with connection pooling
- **Tables**: Users, social accounts, posts, analytics, activities, and sessions

## External Dependencies

### Authentication Services
- **Replit OIDC**: Primary authentication provider with passport integration
- **OpenID Connect**: Standard protocol implementation for secure authentication

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Connection Pooling**: Built-in connection management for optimal performance

### UI/UX Libraries
- **Radix UI**: Headless component primitives for accessibility and customization
- **Recharts**: Data visualization library for analytics charts and graphs
- **React Icons**: Icon library with platform-specific social media icons
- **Lucide React**: Modern icon set for general UI elements

### Development Tools
- **Drizzle ORM**: Type-safe database toolkit with schema validation
- **TanStack Query**: Server state management with caching and synchronization
- **Zod**: Runtime type validation for API requests and responses
- **Tailwind CSS**: Utility-first CSS framework with design system integration

### Build & Deployment
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire application
- **PostCSS**: CSS processing with autoprefixer support