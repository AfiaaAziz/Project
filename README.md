# GoodPix - Photography Fundraising Platform

A comprehensive, production-ready fundraising platform that connects photographers with meaningful causes, featuring complete database integration, real-time updates, and secure payment processing through Stripe.

## Features

### Core Functionality
- **Dynamic Campaign Management**: Full CRUD operations for campaigns with real-time updates
- **Secure Payment Processing**: Complete Stripe integration with webhooks and transaction tracking
- **Real-time Updates**: Live campaign statistics and donation notifications
- **Photo Management**: Upload, moderation, and tagging system for campaign photos
- **User Authentication**: Secure user registration and role-based access control
- **Advanced Search & Filtering**: Dynamic campaign discovery with multiple filter options

### User Roles
- **Campaign Organizers**: Create and manage fundraising campaigns
- **Photographers**: Upload photos and collaborate on campaigns
- **Donors**: Browse campaigns and make secure donations

### Technical Features
- **Database Integration**: Complete PostgreSQL integration with Supabase
- **Payment Security**: PCI-compliant payment processing with Stripe
- **Real-time Subscriptions**: Live updates using Supabase real-time features
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance Optimization**: Query caching and optimized database queries
- **Mobile Responsive**: Fully responsive design for all devices

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching and caching
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security
- **Supabase Edge Functions** for serverless functions
- **Stripe** for payment processing
- **Real-time subscriptions** for live updates

### Development Tools
- **Vite** for build tooling
- **ESLint** for code linting
- **TypeScript** for type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goodpix-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations from `supabase/migrations/`
   - Copy your Supabase URL and anon key

4. **Set up Stripe**
   - Create a Stripe account
   - Get your publishable and secret keys
   - Set up webhook endpoints for payment processing

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase and Stripe credentials

6. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase with the following main tables:
- `profiles` - User profiles and roles
- `campaigns` - Fundraising campaigns with full metadata
- `photos` - Campaign photos with moderation workflow
- `donations` - Donation records linked to Stripe payments
- `categories` - Campaign categories for organization
- `comments` - Campaign updates and comments
- `payment_intents` - Stripe payment intent tracking

Run the migration files to set up the complete schema with proper RLS policies.

### Payment Processing Setup

1. **Stripe Configuration**
   - Get your Stripe keys from https://dashboard.stripe.com/apikeys
   - Add your publishable key to VITE_STRIPE_PUBLISHABLE_KEY
   - Add your secret key to STRIPE_SECRET_KEY (for edge functions)
   - Deploy the Stripe webhook function to Supabase
   - Configure webhook endpoints in Stripe dashboard pointing to your deployed edge function

2. **Webhook Setup**
   - Point Stripe webhooks to: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Include events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET

### Testing Payments

Use these test card numbers in development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995
- Use any future expiry date and any 3-digit CVC
### Deployment

The application can be deployed to any static hosting service:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Deploy Supabase Edge Functions**
   ```bash
   supabase functions deploy create-payment-intent
   supabase functions deploy stripe-webhook
   ```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── campaign-steps/   # Campaign creation wizard steps
│   ├── PaymentModal.tsx  # Payment processing modal
│   ├── DonationButton.tsx # Donation button component
│   ├── CampaignCard.tsx  # Campaign display card
│   ├── RealtimeUpdates.tsx # Real-time subscription handler
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProgressSteps.tsx
├── contexts/            # React contexts for state management
│   └── AuthContext.tsx
├── hooks/               # Custom React hooks
│   ├── useCampaigns.ts  # Campaign data management
│   ├── useDonations.ts  # Donation data management
│   └── usePayments.ts   # Payment processing
├── lib/                 # Utility libraries
│   ├── supabase.ts
│   └── stripe.ts        # Stripe integration
├── pages/               # Main application pages
│   ├── HomePage.tsx
│   ├── BrowseCampaigns.tsx
│   ├── CampaignDetails.tsx
│   ├── CreateCampaign.tsx
│   ├── Dashboard.tsx
│   └── AuthPage.tsx
├── types/               # TypeScript type definitions
│   ├── index.ts
│   └── database.ts      # Database type definitions
├── utils/               # Utility functions
│   └── formatters.ts    # Data formatting utilities
└── App.tsx             # Main application component
```

## Key Features Implementation

### Real-time Updates
- Live campaign statistics using Supabase subscriptions
- Instant donation notifications
- Real-time progress bar updates
- Live donor count updates

### Payment Processing
- Secure Stripe integration with payment intents
- Multiple donation amount options ($25, $50, $100, custom)
- Payment confirmation and error handling
- Automatic donation recording in database
- Webhook processing for payment events

### Database Features
- Complete CRUD operations for all entities
- Row Level Security (RLS) for data protection
- Automatic campaign statistics calculation
- Optimized queries with proper indexing
- Data validation and constraints

### Campaign Creation Wizard
- 6-step process matching the provided designs
- Form validation and data persistence
- Photo upload with drag-and-drop
- Pricing configuration with fee splits
- Terms acceptance and sharing options

### Photo Management
- Secure upload to Supabase storage
- Automatic thumbnail generation
- Moderation workflow
- Tag-based search and filtering
- Watermark application

### User Dashboard
- Campaign performance analytics
- Photo management tools
- Donation tracking
- Real-time activity feed

## Security Features

- **Row Level Security (RLS)** on all database tables
- **Authentication** with Supabase Auth
- **Input validation** with Zod schemas
- **CSRF protection** built into Supabase
- **Secure file uploads** with signed URLs
- **PCI Compliance** through Stripe integration
- **Environment variable protection** for sensitive keys

## API Documentation

### Supabase Edge Functions

#### `/functions/v1/create-payment-intent`
Creates a Stripe payment intent for donations.

**Request:**
```json
{
  "campaignId": "uuid",
  "amount": 50,
  "donorEmail": "donor@example.com",
  "donorName": "John Doe",
  "photoIds": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "id": "pi_1234567890",
  "client_secret": "pi_1234567890_secret_abc",
  "amount": 5000,
  "currency": "usd",
  "status": "requires_payment_method"
}
```

#### `/functions/v1/stripe-webhook`
Handles Stripe webhook events for payment processing.

### Database Queries

The application uses optimized queries with proper indexing:
- Campaign listing with pagination and filtering
- Real-time donation tracking
- User-specific campaign management
- Photo moderation workflow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Testing

### Payment Testing
Use Stripe test cards for payment testing:
- Success: `4242424242424242`
- Decline: `4000000000000002`
- Insufficient funds: `4000000000009995`

### Database Testing
- All CRUD operations are tested through the UI
- Real-time updates can be tested with multiple browser windows
- Authentication flows are fully functional

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@goodpix.org or create an issue in the repository.