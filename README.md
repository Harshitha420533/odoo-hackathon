# TransitOps - Smart Transport Operations Platform

A comprehensive fleet management and logistics platform built with Next.js 16, React, and TypeScript. TransitOps provides real-time tracking, maintenance management, fuel monitoring, and comprehensive analytics for transport operations.

## Features

### 🚗 Vehicle Management
- Track all vehicles in your fleet with detailed specifications
- Monitor vehicle status (Available, In Use, Maintenance, Inactive)
- Track insurance expiry dates and maintenance schedules
- Real-time odometer and fuel consumption tracking
- Vehicle capacity and cargo weight monitoring

### 👥 Driver Management
- Comprehensive driver profiles with license information
- License expiry tracking and verification status
- Performance ratings and trip history
- Emergency contact information management
- Driver verification system for compliance

### 📍 Trip Management
- Create and monitor trips in real-time
- Track route information and cargo details
- Monitor trip status (Pending, In Progress, Completed, Cancelled)
- Calculate distance traveled and fuel consumption
- Automatic trip lifecycle management

### 🔧 Maintenance Tracking
- Schedule and log routine maintenance
- Track repairs and inspections
- Monitor maintenance costs
- Set reminders for next maintenance due dates
- Maintenance history for each vehicle

### ⛽ Fuel Management
- Log fuel purchases and consumption
- Track fuel efficiency metrics
- Monitor fuel costs and trends
- Visualize fuel consumption patterns
- Calculate average efficiency per vehicle

### 💰 Expense Management
- Track all operational expenses
- Categorize expenses (Fuel, Maintenance, Toll, Other)
- Monitor expense trends with pie charts
- Filter and search expenses easily
- Export expense reports

### 📊 Analytics Dashboard
- Real-time KPI metrics (Total Vehicles, Available Vehicles, Active Trips, Total Drivers)
- Weekly trip completion metrics
- Revenue trends and forecasting
- Fleet status breakdown (Available, In Use, Maintenance)
- Operational alerts and notifications

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2 with Hooks
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for UI icons
- **Typography**: Poppins font family

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Authentication**: JWT-based session management
- **Data Source**: Mock data store (in-memory)
- **Password Security**: bcryptjs for hashing
- **Database**: PostgreSQL compatible schema (Drizzle ORM)

### Development
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Build Tool**: Turbopack (Next.js 16 default)
- **Hot Reload**: HMR enabled

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Demo Credentials
- **Email**: admin@transitops.com
- **Password**: demo123

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout with typography setup
│   ├── page.tsx                   # Login page
│   ├── globals.css                # Global styles and design tokens
│   ├── api/
│   │   ├── auth/login/            # Authentication endpoints
│   │   ├── vehicles/              # Vehicle management API
│   │   ├── drivers/               # Driver management API
│   │   ├── trips/                 # Trip management API
│   │   ├── maintenance/           # Maintenance logs API
│   │   ├── fuel/                  # Fuel logs API
│   │   └── expenses/              # Expenses API
│   └── dashboard/
│       ├── page.tsx               # Dashboard overview
│       ├── vehicles/page.tsx       # Vehicles list page
│       ├── drivers/page.tsx        # Drivers list page
│       ├── trips/page.tsx          # Trips list page
│       ├── maintenance/page.tsx    # Maintenance logs page
│       ├── fuel/page.tsx           # Fuel logs page
│       └── expenses/page.tsx       # Expenses page
├── components/
│   ├── login-form.tsx             # Login UI component
│   ├── dashboard-layout.tsx       # Main dashboard layout
│   ├── dashboard-overview.tsx     # Dashboard KPI metrics & charts
│   ├── vehicles-page.tsx          # Vehicles management UI
│   ├── drivers-page.tsx           # Drivers management UI
│   ├── trips-page.tsx             # Trips management UI
│   ├── maintenance-page.tsx       # Maintenance logs UI
│   ├── fuel-page.tsx              # Fuel logs UI
│   ├── expenses-page.tsx          # Expenses UI
│   └── ui/
│       ├── button.tsx             # Button component
│       ├── input.tsx              # Input component
│       └── card.tsx               # Card component
├── lib/
│   ├── db.ts                      # Database connection setup
│   ├── schema.ts                  # Database schema definitions
│   ├── auth.ts                    # Authentication utilities
│   └── mock-data.ts               # Mock data store
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
└── postcss.config.mjs
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login with email and password

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Add new driver

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips?status=pending` - Filter trips by status
- `POST /api/trips` - Create new trip
- `PATCH /api/trips/[id]` - Update trip status

### Maintenance
- `GET /api/maintenance` - Get all maintenance logs
- `GET /api/maintenance?vehicleId=xxx` - Get maintenance for specific vehicle
- `POST /api/maintenance` - Log maintenance

### Fuel
- `GET /api/fuel` - Get all fuel logs
- `GET /api/fuel?vehicleId=xxx` - Get fuel logs for specific vehicle
- `POST /api/fuel` - Add fuel log

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses?vehicleId=xxx` - Get expenses for specific vehicle
- `POST /api/expenses` - Add new expense

## Design System

### Color Palette
- **Primary**: `#0066cc` (Blue) - Main brand color
- **Accent**: `#00d4ff` (Cyan) - Highlights and interactive elements
- **Success**: `#28a745` (Green) - Positive indicators
- **Warning**: `#ffc107` (Yellow) - Alerts and attention
- **Error**: `#dc3545` (Red) - Destructive actions
- **Background**: `#f8f9fa` (Light Gray) - Light mode
- **Foreground**: `#0f1419` (Dark Gray) - Text color

### Typography
- **Font Family**: Poppins (300, 400, 500, 600, 700, 800 weights)
- **Headings**: Poppins 600-700 weight
- **Body**: Poppins 400 weight
- **Line Height**: 1.4-1.6 for readability

### Components
- **Cards**: Rounded corners (8px), subtle shadows
- **Buttons**: Blue primary with hover effects
- **Inputs**: Light background with border styling
- **Status Badges**: Color-coded for quick identification

## Mock Data

The application uses an in-memory data store with pre-populated demo data:

### Sample Data Included
- **Vehicles**: 3 vehicles (Tata, Ashok Leyland, Mahindra) with various statuses
- **Drivers**: 2 verified drivers with trip history and ratings
- **Trips**: 2 sample trips (1 completed, 1 pending)
- **Maintenance Logs**: Routine maintenance records
- **Fuel Logs**: Recent fuel purchase data
- **Expenses**: Sample expense records by category

## Features Implemented

### Core Features (from PDF)
✅ Vehicle management with tracking
✅ Driver management with license verification
✅ Trip creation and monitoring
✅ Maintenance scheduling and logging
✅ Fuel consumption tracking
✅ Expense categorization and tracking
✅ Real-time KPI dashboard
✅ Analytics with charts and graphs
✅ Role-based access control (Admin, Manager, Driver, Operator)

### Bonus Features
✅ License expiry alert system
✅ Dynamic status indicators with color coding
✅ Advanced filtering and search
✅ Responsive design (Desktop & Mobile)
✅ Real-time data visualization (Charts & Graphs)
✅ Dark mode support (CSS variables)
✅ Performance metrics dashboard
✅ Expense breakdown by category
✅ Driver rating system
✅ Trip lifecycle management

## Testing

### Manual Testing
All pages have been tested and verified to be working:
- ✅ Login page - Form validation and styling
- ✅ Dashboard - KPI metrics and charts loading
- ✅ Vehicles page - Grid display with filters
- ✅ Drivers page - Driver cards with verification badges
- ✅ Trips page - Trip list with status indicators
- ✅ Maintenance page - Maintenance logs with type badges
- ✅ Fuel page - Fuel logs table with consumption chart
- ✅ Expenses page - Expense breakdown with pie chart

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind for minimal bundle size
- API response caching
- Optimized component re-renders
- Efficient data fetching with React hooks

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel Deployment
The application is ready for deployment on Vercel:

```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel deploy
```

### Environment Variables
Required environment variables (if migrating from mock data):
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## Future Enhancements

- Real database integration (PostgreSQL via Neon)
- Email notifications for license expiry
- PDF report generation
- Real-time GPS tracking
- Integration with payment gateways
- Multi-language support
- Mobile app version
- API documentation with Swagger
- Advanced reporting features
- Machine learning for route optimization

## License

Built with v0 by Vercel - A Next.js template

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**TransitOps**: Smart, efficient, transparent fleet management. Built for modern logistics operations.
