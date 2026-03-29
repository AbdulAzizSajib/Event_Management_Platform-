# Event Management Platform - Backend (Server)

A full-featured event management platform backend built with Express.js, TypeScript, and PostgreSQL. Supports event creation, ticketing, payments, real-time chat, and more.

## Live URL

**Server:** https://event-management-platform-server.onrender.com

## Features

- **Authentication** - Email/password and Google OAuth login via Better Auth, email OTP verification, JWT-based access/refresh tokens
- **Event Management** - Create, update, delete events with image upload (Cloudinary), category filtering, featured events, public/private events
- **Participant System** - Join events, approve/reject/ban participants, cancel participation
- **Payment Integration** - Stripe checkout for paid events, webhook handling, payment receipts (PDF generation)
- **Real-time Chat** - Socket.IO based messaging between event organizers and users, typing indicators, online status, read receipts
- **Invitation System** - Invite users to events, accept/decline invitations
- **Review & Rating** - Rate and review events (approved participants only), featured reviews
- **Saved Events** - Bookmark/save events for later
- **Admin Dashboard** - User management, event moderation, platform stats
- **User Dashboard** - Personal stats, participation breakdown, upcoming events, spending summary
- **Email Notifications** - OTP verification, password reset via Nodemailer with EJS templates

## Technologies Used

| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| Authentication | Better Auth, JWT |
| Payment | Stripe |
| Real-time | Socket.IO |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Validation | Zod 4 |
| PDF | PDFKit |
| Deployment | Render |

## Project Structure

```
src/app/
├── config/          # Environment, Multer, Cloudinary config
├── lib/             # Prisma client, Better Auth, Stripe, Socket.IO setup
├── middleware/       # Auth, validation, error handling, CORS
├── module/
│   ├── admin/       # Admin dashboard & user management
│   ├── auth/        # Register, login, OAuth, OTP, password reset
│   ├── category/    # Event categories CRUD
│   ├── chat/        # Conversations & real-time messaging
│   ├── event/       # Event CRUD with image upload
│   ├── invitation/  # Event invitation system
│   ├── participant/ # Join, approve, reject, ban participants
│   ├── payment/     # Stripe checkout, webhooks, receipts
│   ├── review/      # Event reviews & ratings
│   ├── savedEvent/  # Bookmark events
│   └── user/        # Profile management & user dashboard
├── templates/       # EJS email templates
├── utils/           # JWT, cookies, seed, helpers
├── app.ts           # Express app setup
└── server.ts        # HTTP server + Socket.IO initialization
```

## Setup Instructions

### Prerequisites

- Node.js v22+
- pnpm
- PostgreSQL database (or Neon)
- Stripe account
- Cloudinary account
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/AbdulAzizSajib/event-management-platform-server.git
cd event-management-platform-server
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# JWT
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin Seed
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
ADMIN_NAME=Admin
```

### 4. Run database migrations

```bash
pnpm migrate
```

### 5. Generate Prisma client

```bash
pnpm generate
```

### 6. Start development server

```bash
pnpm dev
```

Server will run at `http://localhost:5000`

### 7. Stripe webhook (local testing)

```bash
pnpm stripe:webhook
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/login/google` | Google OAuth |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/refresh-token` | Refresh tokens |
| POST | `/api/v1/auth/verify-email` | Verify email OTP |
| POST | `/api/v1/auth/forget-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |
| POST | `/api/v1/auth/logout` | Logout |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | Get all events (public) |
| GET | `/api/v1/events/:id` | Get single event |
| POST | `/api/v1/events` | Create event (form-data + image) |
| PATCH | `/api/v1/events/:id` | Update event (form-data + image) |
| DELETE | `/api/v1/events/:id` | Delete event |
| GET | `/api/v1/events/my-events` | Get my events |

### Participants
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/participants/join` | Join event |
| GET | `/api/v1/participants/my-participations` | My participations |
| GET | `/api/v1/participants/event/:eventId` | Event participants |
| PATCH | `/api/v1/participants/:id/status` | Update status |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/create-checkout-session` | Create Stripe checkout |
| GET | `/api/v1/payments/my-payments` | My payments |
| GET | `/api/v1/payments/verify/:sessionId` | Verify payment |
| GET | `/api/v1/payments/receipt/:paymentId` | Payment receipt |

### Chat (REST + Socket.IO)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat/conversations` | Start conversation |
| GET | `/api/v1/chat/conversations` | My conversations |
| GET | `/api/v1/chat/conversations/:id/messages` | Get messages |
| POST | `/api/v1/chat/conversations/:id/messages` | Send message |
| PATCH | `/api/v1/chat/conversations/:id/read` | Mark as read |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/reviews` | Create review |
| GET | `/api/v1/reviews/featured` | Featured reviews (public) |
| GET | `/api/v1/reviews/event/:eventId` | Event reviews (public) |
| GET | `/api/v1/reviews/my-reviews` | My reviews |

### Saved Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/saved-events` | Save event |
| GET | `/api/v1/saved-events` | My saved events |
| GET | `/api/v1/saved-events/check/:eventId` | Check save status |
| DELETE | `/api/v1/saved-events/:eventId` | Unsave event |

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-conversation` | Client -> Server | Join chat room |
| `send-message` | Client -> Server | Send message |
| `new-message` | Server -> Client | Receive message |
| `mark-read` | Client -> Server | Mark messages read |
| `typing` / `stop-typing` | Both | Typing indicator |
| `check-online` | Client -> Server | Check user online status |
