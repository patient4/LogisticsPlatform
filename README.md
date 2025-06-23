# EverFlown Logistics - Freight Brokerage Platform

A comprehensive, production-ready freight brokerage operations platform built with React, Express.js, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **Lead Management**: Capture and qualify potential customers with full CRUD operations
- **Quote System**: Generate and manage freight quotes with currency support
- **Customer Management**: Maintain customer relationships and contracts
- **Carrier Network**: Manage carrier partnerships and qualifications
- **Order Processing**: Handle freight orders from quote to delivery
- **Dispatch Operations**: Assign loads to carriers and track progress
- **Invoice Management**: Generate and track customer and carrier invoices with PDF download
- **Follow-up System**: Task management for ongoing customer communication

### Authentication & Authorization
- Username/password authentication (default: admin/admin)
- Role-based access control (Admin/Broker/User)
- Session-based authentication with PostgreSQL storage
- Password reset functionality

### User Interface
- **Responsive Design**: Optimized for MacBook Air, tablets, and mobile devices
- **Dark/Light Mode**: Complete theme support with consistent styling
- **Currency Configuration**: Support for 10+ international currencies
- **Real-time Updates**: Live data refresh with toast notifications
- **Navigation**: Intuitive sidebar and breadcrumb navigation

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** with custom design system
- **Shadcn/ui** components built on Radix UI
- **TanStack Query** for server state management
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **PostgreSQL** with Neon serverless connection
- **Drizzle ORM** for type-safe database operations
- **Passport.js** for authentication
- **Session management** with connect-pg-simple

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd everflown-logistics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_secure_session_secret
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── App.tsx         # Main application component
├── server/                 # Express backend
│   ├── auth.ts            # Authentication middleware
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## 🔐 Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin`

## 📊 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Leads
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Quotes
- `GET /api/quotes` - List all quotes
- `POST /api/quotes` - Create new quote
- `PUT /api/quotes/:id` - Update quote
- `DELETE /api/quotes/:id` - Delete quote

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id/pdf` - Download invoice PDF
- `DELETE /api/invoices/:id` - Delete invoice

### Settings
- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update user settings

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Styling & Theming

The application uses Tailwind CSS with a custom design system supporting:
- **Light/Dark mode** with automatic system detection
- **Responsive breakpoints** for all screen sizes
- **Custom color palette** optimized for accessibility
- **Consistent spacing** and typography scales

## 💱 Currency Support

Supported currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CNY (Chinese Yuan)
- INR (Indian Rupee)
- MXN (Mexican Peso)
- BRL (Brazilian Real)

## 🔒 Security Features

- **Password hashing** with scrypt algorithm
- **Session-based authentication** with secure cookies
- **Role-based access control** with middleware protection
- **CORS protection** and request validation
- **SQL injection prevention** through parameterized queries

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Ensure these variables are set in production:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secure session encryption key
- `NODE_ENV=production`

### Replit Deployment
This application is optimized for Replit deployment:
1. Push your code to Replit
2. Configure environment variables
3. Use the "Deploy" button in Replit

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: 1920px+ monitors
- **Laptop**: MacBook Air (1440x900)
- **Tablet**: iPad and Android tablets
- **Mobile**: iPhone and Android phones

## 🧪 Testing

### Manual Testing Checklist
- [ ] User authentication (login/logout)
- [ ] Lead creation and management
- [ ] Quote generation and editing
- [ ] Invoice PDF download
- [ ] Dark/light mode toggle
- [ ] Responsive design on all devices
- [ ] Role-based access control
- [ ] Currency conversion display

## 📝 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open database studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**EverFlown Logistics** - Streamlining freight operations through advanced technology.