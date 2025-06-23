# EverFlown Logistics - Complete Source Code Download

## Project Overview
Complete freight brokerage operations platform with React frontend, Express.js backend, and PostgreSQL database.

## Download All Files
To get the complete codebase, you can download these key directories and files:

### Core Project Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `drizzle.config.ts` - Database configuration
- `postcss.config.js` - CSS processing
- `components.json` - UI components config

### Frontend (client/)
- `client/index.html` - Main HTML file
- `client/src/App.tsx` - Main React app
- `client/src/main.tsx` - React entry point
- `client/src/index.css` - Global styles

#### Components (client/src/components/)
- `Layout.tsx` - Main layout with navigation
- `Dashboard.tsx` - Analytics dashboard
- `LeadsQuotes.tsx` - Lead management
- `CustomerList.tsx` - Customer database
- `CarrierList.tsx` - Carrier management
- `OrderList.tsx` - Order management
- `DispatchList.tsx` - Dispatch operations
- `Tracing.tsx` - Shipment tracking
- `Invoices.tsx` - Invoice management
- `FollowUp.tsx` - Task management

#### Modals (client/src/components/modals/)
- `AddLeadModal.tsx` - Create leads
- `AddCustomerModal.tsx` - Create customers
- `AddCarrierModal.tsx` - Create carriers
- `AddOrderModal.tsx` - Create orders

#### Pages (client/src/pages/)
- `Landing.tsx` - Landing page
- `Home.tsx` - Home page
- `not-found.tsx` - 404 page

#### Hooks (client/src/hooks/)
- `useAuth.ts` - Authentication hook
- `use-toast.ts` - Toast notifications

#### Utils (client/src/lib/)
- `queryClient.ts` - API client
- `authUtils.ts` - Auth utilities
- `utils.ts` - Common utilities

#### UI Components (client/src/components/ui/)
Complete Shadcn/UI component library (50+ components)

### Backend (server/)
- `index.ts` - Express server entry
- `routes.ts` - API routes
- `storage.ts` - Database operations
- `db.ts` - Database connection
- `replitAuth.ts` - Authentication system
- `vite.ts` - Development server
- `googleAuth.ts` - Google OAuth (optional)

### Shared (shared/)
- `schema.ts` - Database schema and types

## Quick Setup Instructions

1. **Clone/Download** all files maintaining directory structure
2. **Install dependencies**: `npm install`
3. **Set environment variables**:
   ```
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_random_secret
   REPL_ID=your_repl_id
   ```
4. **Initialize database**: `npm run db:push`
5. **Start development**: `npm run dev`

## Features Included
- Complete authentication system
- Dashboard with real-time KPIs
- Lead management and conversion
- Customer database management
- Carrier network management
- Order processing workflow
- Dispatch operations tracking
- Invoice management system
- Follow-up task management
- Manual shipment tracing

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Passport.js with OpenID Connect
- **Build**: Vite for development and production

## Production Ready
This is a complete, production-ready freight brokerage platform ready for deployment to any hosting provider that supports Node.js and PostgreSQL.

All code is properly typed with TypeScript, includes error handling, and follows modern development practices.