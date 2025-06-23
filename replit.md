# EverFlown Logistics - Freight Brokerage Platform

## Overview

EverFlown Logistics is a comprehensive freight brokerage operations platform built with React, Express.js, and PostgreSQL. The application provides complete management capabilities for freight operations including lead management, customer relationships, carrier networks, order processing, dispatch operations, and financial tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Primary Backend**: Go with Gin framework for all API endpoints
- **Proxy Layer**: Node.js Express server for workflow compatibility
- **Language**: Go for backend logic, TypeScript for proxy layer
- **API**: RESTful API design with JSON responses
- **Database**: Direct GORM integration with PostgreSQL

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema covering all business entities
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication and Authorization
- **Provider**: Replit Auth integration using OpenID Connect
- **Session Management**: PostgreSQL-backed session storage with connect-pg-simple
- **User Management**: Role-based access control with broker roles

### Business Logic Modules
1. **Lead Management**: Capture and qualify potential customers
2. **Customer Management**: Maintain customer relationships and contracts
3. **Carrier Network**: Manage carrier partnerships and qualifications
4. **Order Processing**: Handle freight orders from quote to delivery
5. **Dispatch Operations**: Assign loads to carriers and track progress
6. **Invoice Management**: Generate and track customer and carrier invoices
7. **Follow-up System**: Task management for ongoing customer communication

### UI Components
- **Dashboard**: Real-time statistics and key performance indicators
- **Data Tables**: Sortable, filterable lists for all business entities
- **Modal Forms**: Add/edit forms for data entry
- **Status Tracking**: Visual indicators for order and dispatch status

## Data Flow

1. **Lead Capture**: Prospects enter the system through the leads module
2. **Customer Conversion**: Qualified leads become active customers
3. **Order Creation**: Customers place freight orders with origin/destination details
4. **Carrier Assignment**: Orders are matched with available carriers
5. **Dispatch Management**: Loads are assigned and tracked through delivery
6. **Invoice Generation**: Billing is created for both customers and carriers
7. **Follow-up Tasks**: Ongoing relationship management and communication

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@radix-ui/***: Headless UI component primitives
- **@tanstack/react-query**: Server state management
- **express**: Web application framework
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- **Runtime**: Replit environment with Node.js 20
- **Database**: PostgreSQL 16 module
- **Hot Reload**: Vite development server with HMR
- **Process Management**: Single process handling both client and server

### Production Build
- **Client**: Vite builds React app to static files
- **Server**: esbuild bundles Express server with external dependencies
- **Deployment**: Replit autoscale deployment target
- **Port Configuration**: Server runs on port 5000, proxied to port 80

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPL_ID**: Replit environment identifier
- **ISSUER_URL**: OpenID Connect issuer for authentication

## Recent Changes
- June 22, 2025: Implemented username/password authentication system with default admin:admin credentials
- June 22, 2025: Added ACL role-based system (Admin/Broker/User) with permission enforcement
- June 22, 2025: Updated database schema with username, password, and role columns
- June 22, 2025: Created authentication pages with login/registration forms
- June 22, 2025: Integrated role-based UI components with permission checks
- June 22, 2025: Added interactive action forms to dashboard - New Order, Add Lead, Create Quote, Add Customer
- June 22, 2025: Fixed PostgreSQL session store errors and blank screen authentication issues
- June 23, 2025: Added functional edit and delete buttons to all table components (leads, customers, carriers, orders)
- June 23, 2025: Fixed /leads and /quotes routing issues and database schema problems
- June 23, 2025: Enhanced all table components with proper CRUD operations and edit modals
- June 23, 2025: Implemented comprehensive production-ready platform with complete API backend integration
- June 23, 2025: Added audit logging, enhanced error handling, and real-time UI updates across all components
- June 23, 2025: Created currency configuration system supporting 10+ international currencies
- June 23, 2025: Implemented invoice PDF download functionality with proper backend routes
- June 23, 2025: Enhanced dark mode coverage across all components and tables for consistent theming
- June 23, 2025: Added Settings page for currency and appearance configuration
- June 23, 2025: Completed comprehensive documentation (README.md, .env.example, DEPLOYMENT_CHECKLIST.md)
- June 23, 2025: **FINAL IMPLEMENTATION**: Complete lead → quote → order → dispatch → invoice workflow with Go backend
- June 23, 2025: **PRODUCTION READY**: Auto-invoice generation, rate confirmation PDFs, quote acceptance system
- June 23, 2025: **WORKFLOW COMPLETE**: Full freight brokerage operations platform with dual backend architecture
- June 23, 2025: **CRITICAL FIXES**: Implemented real PDF generation with gofpdf library, fixed delete cascade issues
- June 23, 2025: **BACKEND SWITCH**: Completed transition from Node.js to Go backend with proper PDF generation
- June 23, 2025: **PLATFORM READY**: Production-ready freight brokerage platform with complete CRUD operations and workflow automation
- June 23, 2025: **ARCHITECTURE TRANSITION**: Migrated from Node.js/Express to Go/Gin backend with hybrid proxy layer for Replit workflow compatibility

## Changelog
- June 16, 2025. Initial setup
- June 22, 2025. Authentication system and ACL implementation

## User Preferences

Preferred communication style: Simple, everyday language.