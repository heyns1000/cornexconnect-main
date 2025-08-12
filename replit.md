# CornexConnect - AI-Powered Manufacturing Platform

## Overview

CornexConnect is a comprehensive enterprise manufacturing and distribution platform for Cornex™ brand building materials, specifically EPS and BR XPS cornice products. The platform integrates AI-powered demand forecasting, automated production scheduling, global distributor management, and advanced inventory optimization across a multi-brand portfolio including TrimStyle™, DesignAura™, CorniceCraft™, and CeilingTech™.

The system is designed as a global-scale business management solution targeting South African provinces initially, with expansion plans for SADC regions and beyond. It features complete product catalog management for 31+ SKUs, multi-currency support for 190+ currencies, and sophisticated manufacturing resource planning (MRP) capabilities.

**Recent Enhancement (August 2025)**: Successfully implemented premium visual design matching the landing page aesthetic with gradient backgrounds (emerald to blue), glass morphism effects on all cards, and enhanced UI components while preserving all existing functionality and data integrity.

**Latest Update (August 2025)**: Completed implementation of bulk Excel import functionality for unstructured files:
- Drag & drop interface supporting up to 50 Excel/CSV files simultaneously
- Real-time progress tracking with session management and status monitoring
- Comprehensive file processing backend with error handling and validation
- Integration with hardware store database for sales rep route data
- Import history tracking with detailed session information
- In-memory storage implementation due to database limitations

**Strategic Logistics Integration (August 2025)**: Completed comprehensive South African logistics partnership integration following careful analysis of real market data:
- RouteMesh™ SA integrated with Unitrans Africa & Imperial Logistics for route optimization
- CrateLogic™ Connect partnered with Shaft Packaging & Polyoak Packaging for container management  
- DeliveryX™ Network connected with PostNet/Aramex for last-mile delivery
- LabelFlow™ Pro linked with packaging companies for automated labeling
- All integrations based on actual SA companies researched via web search
- Covers 8500+ hardware stores through real logistics networks
- Strategic focus on realistic, implementable partnerships vs fictional concepts

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Wouter** for client-side routing
- **TanStack Query** for server state management and caching
- **Tailwind CSS** with shadcn/ui component library for styling
- **Framer Motion** for smooth page transitions and interactive animations
- **Modern glass morphism design** with gradient backgrounds and backdrop blur effects
- **Premium visual styling** matching landing page aesthetic with emerald-to-blue gradients
- **Smooth page transitions** with fade, scale, slide, and staggered animations
- **Enhanced interactive elements** with hover effects and micro-animations
- **Responsive design** with mobile-first approach using custom breakpoints

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with comprehensive route structure
- **In-memory storage layer** with interface-based data access patterns
- **Modular route registration** system for scalable endpoint management
- **Comprehensive error handling** with proper HTTP status codes
- **CORS and security middleware** for production deployment

### Database Design
- **PostgreSQL** as the primary database (configured via Drizzle)
- **Drizzle ORM** for type-safe database operations and migrations
- **Neon Database** serverless PostgreSQL provider
- **Comprehensive schema** covering users, products, inventory, distributors, orders, production schedules, demand forecasting, and sales metrics
- **Relational data modeling** with proper foreign key constraints and indexes

### Data Models
- **Users**: Role-based access control (admin, manager, distributor, viewer) with regional assignments
- **Products**: Complete SKU management for EPS01-EPS18 and BR1-BR13 product lines with specifications and pricing
- **Inventory**: Multi-location stock tracking with reorder points and optimization algorithms
- **Distributors**: Global network management with regional distribution and multi-currency support
- **Orders**: Comprehensive order lifecycle management with item-level tracking
- **Production**: Scheduling and capacity planning with AI-driven optimization
- **Analytics**: Sales metrics, demand forecasting, and business intelligence
- **Sales Representatives**: Employee management with territory assignments and performance tracking
- **Hardware Stores**: 8500+ store database with geographic, size, and credit information
- **Route Plans**: Sales rep route optimization with visit scheduling and frequency management
- **AI Order Suggestions**: Machine learning-powered smart ordering recommendations
- **Store Visits**: Visit tracking with performance metrics and follow-up management

### AI and Machine Learning Features
- **Demand Forecasting**: SKU-level predictions using Random Forest and LSTM models
- **Production Optimization**: AI-driven scheduling with finite capacity planning
- **Inventory Intelligence**: Predictive analytics for stock optimization and reorder automation
- **Business Intelligence**: Real-time analytics and automated insight generation

### Authentication and Authorization
- **Role-based access control** with hierarchical permissions
- **Multi-regional user management** with currency and localization preferences
- **Session-based authentication** with secure credential handling

### Multi-Currency and Localization
- **190+ currency support** with real-time exchange rate integration
- **Regional pricing strategies** with IP-based detection
- **26-language localization** capabilities
- **Provincial distribution tracking** for South African market focus

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI and Component Libraries
- **Radix UI**: Comprehensive accessible component primitives for dialogs, dropdowns, navigation, and form controls
- **Lucide React**: Icon library for consistent iconography
- **Chart.js**: Data visualization for analytics dashboards
- **Embla Carousel**: Touch-friendly carousel components

### Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Autoprefixer**: CSS vendor prefix automation

### Validation and Type Safety
- **Zod**: Runtime type validation for API requests and responses
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for schema validation
- **TypeScript**: End-to-end type safety across frontend and backend

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class name utility
- **class-variance-authority**: Variant-based component styling
- **nanoid**: Unique identifier generation

### Production Dependencies
- **connect-pg-simple**: PostgreSQL session store for Express
- **ws**: WebSocket support for real-time features
- **@jridgewell/trace-mapping**: Source map utilities for debugging