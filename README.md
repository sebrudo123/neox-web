# Trinitaria RP - Server Shop & Admin Dashboard

A complete e-commerce platform and admin dashboard for FiveM/GTA RP servers built with Next.js, MongoDB, and Stripe.

## Features

- **User Authentication**: Dual auth with Discord OAuth and Email/Password
- **E-Commerce Shop**: Product catalog with categories, shopping cart, and Stripe checkout
- **Admin Dashboard**: Product management, order tracking, user management
- **Role-Based Access**: Admin panel with purchase history and analytics
- **Real-Time Updates**: SWR for optimized data fetching and caching
- **Production Ready**: Secure authentication, webhook handling, and error management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB + Prisma ORM
- **Payments**: Stripe (Checkout & Webhooks)
- **Authentication**: NextAuth.js with Discord OAuth & Credentials

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd trinitaria-rp
npm install
# or
pnpm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/trinitaria-rp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-string-here"

# Discord OAuth (get from Discord Developer Portal)
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"

# Stripe (get from Stripe Dashboard)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin Access
ADMIN_DISCORD_ID="1439761085040427100"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Configuration

### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a New Application
3. Go to OAuth2 > General
4. Copy Client ID and Client Secret
5. Add Redirect URI: `http://localhost:3000/api/auth/callback/discord`

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers > API Keys
3. Create a webhook endpoint pointing to `/api/webhook/stripe`
4. Copy the webhook signing secret

### Admin Access

The app supports two ways to grant admin privileges:

**Option 1: Discord ID**
- Set `ADMIN_DISCORD_ID` environment variable
- Admin automatically gains access when signing in with that Discord account

**Option 2: Email**
- Add emails to `ADMIN_EMAILS` array in `/app/api/auth/[...nextauth]/route.ts`
- Admin automatically gains access when signing in with those email addresses

## Project Structure

```
app/
├── api/                          # API Routes
│   ├── auth/[...nextauth]/       # NextAuth configuration
│   ├── auth/register/            # User registration
│   ├── products/                 # Product CRUD
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Stripe checkout
│   ├── orders/                   # User orders
│   ├── admin/                    # Admin endpoints
│   └── webhook/stripe/           # Stripe webhooks
├── auth/                         # Auth pages
│   ├── signin/
│   └── signup/
├── shop/                         # Shop pages
│   ├── [id]/                     # Product detail
│   └── page.tsx                  # Shop listing
├── cart/                         # Shopping cart page
├── orders/                       # User orders page
├── dashboard/                    # User dashboard
├── admin/                        # Admin pages
│   ├── products/                 # Product management
│   ├── orders/                   # Order management
│   └── users/                    # User management
├── layout.tsx                    # Root layout
├── page.tsx                      # Homepage
└── globals.css                   # Global styles

lib/
└── prisma.ts                     # Prisma client

prisma/
└── schema.prisma                 # Database schema
```

## Database Schema

### User
- Basic user information
- Email and Discord authentication fields
- Role-based access (user/admin)

### Product
- Product details (name, description, price)
- Category and inventory management
- Product images

### CartItem
- User's shopping cart items
- Quantity tracking
- Links to user and product

### Order
- Order information and status
- Order items with pricing
- Stripe transaction tracking

### OrderItem
- Individual items in an order
- Quantity and pricing snapshot

### Transaction
- Stripe payment records
- Payment status tracking

## API Endpoints

### Public
- `POST /api/auth/register` - Register new user
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details

### Authenticated
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `DELETE /api/cart?id=...` - Remove from cart
- `POST /api/checkout` - Create checkout session
- `GET /api/orders` - Get user orders

### Admin Only
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - All products (admin view)
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/[id]` - Update order status
- `GET /api/admin/users` - List all users
- `POST /api/webhook/stripe` - Stripe webhook handler

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

Set environment variables in Vercel project settings.

### Deploy to Other Platforms

1. Build: `npm run build`
2. Start: `npm start`
3. Ensure MongoDB connection string is valid
4. Set all environment variables
5. Update Stripe webhook URL to your deployment URL

## Features Walkthrough

### User Flow
1. Sign up with Discord or Email
2. Browse products in the shop
3. Add items to cart
4. Checkout with Stripe
5. View order history
6. Track order status

### Admin Flow
1. Sign in with admin credentials
2. Access admin dashboard
3. Create/edit/delete products
4. View and manage orders
5. Update order statuses
6. Monitor users and revenue

## Testing

### Test Cards (Stripe)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

All test cards use any future expiry and any 3-digit CVC.

## Security Considerations

- Passwords are hashed with bcryptjs
- NEXTAUTH_SECRET is required and should be strong
- JWT strategy for secure sessions
- Row-level security via role-based access
- Stripe webhooks are signature-verified
- SQL injection prevention with Prisma
- CSRF protection via NextAuth
- Secure cookies (HTTP-only)

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database exists

### Discord OAuth Not Working
- Verify callback URL matches exactly
- Check Client ID and Secret
- Ensure bot has required permissions

### Stripe Webhooks Not Firing
- Verify webhook signing secret
- Check webhook endpoint in Stripe dashboard
- Ensure STRIPE_WEBHOOK_SECRET is set correctly
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

## Support

For issues, questions, or contributions, please contact the development team.

## License

Proprietary - Trinitaria RP Server
