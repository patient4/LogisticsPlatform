# EverFlown Logistics - Complete Codebase

## Project Structure

```
everflown-logistics/
├── client/
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── ui/ (Shadcn/UI components)
│       │   ├── modals/
│       │   ├── Dashboard.tsx
│       │   ├── Layout.tsx
│       │   ├── LeadsQuotes.tsx
│       │   ├── CustomerList.tsx
│       │   ├── CarrierList.tsx
│       │   ├── OrderList.tsx
│       │   ├── DispatchList.tsx
│       │   ├── Tracing.tsx
│       │   ├── Invoices.tsx
│       │   └── FollowUp.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── use-toast.ts
│       ├── lib/
│       │   ├── queryClient.ts
│       │   ├── authUtils.ts
│       │   └── utils.ts
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Landing.tsx
│       │   └── not-found.tsx
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── server/
│   ├── db.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── replitAuth.ts
│   ├── googleAuth.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
├── components.json
└── replit.md
```

## Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd everflown-logistics

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc

# Initialize database
npm run db:push

# Start development server
npm run dev
```

## Key Features

### ✅ Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL storage
- User management with role-based access

### ✅ Dashboard & Analytics
- Real-time KPI metrics
- Business statistics
- Recent activity tracking
- Revenue and order analytics

### ✅ Lead Management
- Lead capture and qualification
- Status tracking (new, contacted, quoted, converted, lost)
- Lead-to-customer conversion
- Quote generation and management

### ✅ Customer Management
- Complete customer database
- Company information and contacts
- Billing details and credit terms
- Customer order history

### ✅ Carrier Management
- Carrier network management
- Equipment type tracking
- Compliance documentation
- Performance metrics

### ✅ Order Management
- Full order lifecycle management
- Origin and destination tracking
- Equipment and commodity details
- Customer rate management
- Status workflow (needs_truck → dispatched → in_transit → delivered)

### ✅ Dispatch Operations
- Load assignment to carriers
- Pickup and delivery scheduling
- Carrier rate management
- Dispatch tracking and updates

### ✅ Invoice Management
- Customer invoicing
- Carrier payment processing
- Billing status tracking
- Revenue management

### ✅ Follow-up System
- Task management
- Priority levels (low, medium, high, urgent)
- Due date tracking
- Customer communication logs

### ✅ Manual Shipment Tracing
- Real-time shipment tracking
- Status updates
- Delivery confirmation
- Issue resolution

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions

### Database Schema
- Users, Sessions (Auth)
- Leads, Customers, Carriers (Entities)
- Orders, Dispatches (Operations)
- Quotes, Invoices (Financial)
- Follow-ups (Tasks)

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout user
- `GET /api/callback` - Auth callback

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Leads
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Carriers
- `GET /api/carriers` - List all carriers
- `POST /api/carriers` - Create carrier
- `PUT /api/carriers/:id` - Update carrier
- `DELETE /api/carriers/:id` - Delete carrier

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Dispatches
- `GET /api/dispatches` - List all dispatches
- `POST /api/dispatches` - Create dispatch
- `PUT /api/dispatches/:id` - Update dispatch
- `DELETE /api/dispatches/:id` - Delete dispatch

### Quotes
- `GET /api/quotes` - List all quotes
- `POST /api/quotes` - Create quote
- `PUT /api/quotes/:id` - Update quote
- `DELETE /api/quotes/:id` - Delete quote

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Follow-ups
- `GET /api/followups` - List all follow-ups
- `GET /api/followups/urgent` - Get urgent follow-ups
- `POST /api/followups` - Create follow-up
- `PUT /api/followups/:id` - Update follow-up
- `DELETE /api/followups/:id` - Delete follow-up

## Deployment

The application is configured for Replit deployment with:
- Automatic builds via Vite
- PostgreSQL database integration
- Session-based authentication
- Environment variable management
- Production optimizations

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push     # Push schema changes
npm run db:generate # Generate migrations
npm run db:migrate  # Run migrations

# Type checking
npm run type-check

# Linting
npm run lint
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=5432
PGUSER=...
PGPASSWORD=...
PGDATABASE=...

# Authentication
SESSION_SECRET=random_secret_key
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-domain.replit.app

# Optional: Google Auth (if implementing)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

This is a complete, production-ready freight brokerage platform with all core functionality implemented and ready for deployment.