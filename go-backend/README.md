# EverFlown Logistics - Go Backend

## Overview
Complete Go REST API backend for the freight brokerage platform with GORM and PostgreSQL.

## Features
- Complete REST API with all endpoints
- GORM for database operations
- Automatic sample data seeding
- CORS enabled for frontend integration
- Compatible with existing React frontend

## Setup

1. Install Go dependencies:
```bash
cd go-backend
go mod tidy
```

2. Set environment variables in .env:
```bash
DATABASE_URL=your_postgresql_url
PORT=8080
```

3. Run the server:
```bash
go run main.go
```

## API Endpoints

### Dashboard
- GET /api/dashboard/stats - Dashboard statistics

### Authentication
- GET /api/auth/user - Current user info

### Leads
- GET /api/leads - List all leads
- POST /api/leads - Create lead
- PUT /api/leads/:id - Update lead
- DELETE /api/leads/:id - Delete lead

### Customers
- GET /api/customers - List all customers  
- POST /api/customers - Create customer
- PUT /api/customers/:id - Update customer
- DELETE /api/customers/:id - Delete customer

### Carriers
- GET /api/carriers - List all carriers
- POST /api/carriers - Create carrier
- PUT /api/carriers/:id - Update carrier
- DELETE /api/carriers/:id - Delete carrier

### Orders
- GET /api/orders - List all orders
- POST /api/orders - Create order
- PUT /api/orders/:id - Update order
- DELETE /api/orders/:id - Delete order

### Dispatches
- GET /api/dispatches - List all dispatches
- POST /api/dispatches - Create dispatch
- PUT /api/dispatches/:id - Update dispatch
- DELETE /api/dispatches/:id - Delete dispatch

### Quotes
- GET /api/quotes - List all quotes
- POST /api/quotes - Create quote
- PUT /api/quotes/:id - Update quote
- DELETE /api/quotes/:id - Delete quote

### Invoices
- GET /api/invoices - List all invoices
- POST /api/invoices - Create invoice
- PUT /api/invoices/:id - Update invoice
- DELETE /api/invoices/:id - Delete invoice

### Follow-ups
- GET /api/followups - List all follow-ups
- GET /api/followups/urgent - Get urgent follow-ups
- POST /api/followups - Create follow-up
- PUT /api/followups/:id - Update follow-up
- DELETE /api/followups/:id - Delete follow-up

## Database
Uses PostgreSQL with GORM for ORM. Database schema matches the existing Node.js backend for compatibility.

## Sample Data
Automatically seeds realistic freight brokerage data including:
- 4 leads with different statuses
- 3 customers with billing information
- 3 carriers with compliance data
- 4 orders with various statuses
- 3 dispatches with carrier assignments
- 3 quotes with pricing
- 4 invoices (customer and carrier)
- 4 follow-up tasks with priorities

This provides a complete visualization of the freight brokerage workflow.