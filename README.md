# Face of Creativity Nigeria (FOC) - Official Platform

> **"Unleash Your Creativity. Be Seen. Be Celebrated."**  
> Complete full-stack commercial web application and competition engine for Nigeria's premier creative, modeling, and talent tournament.

---

## 1. System Architecture

The platform is designed with a strict separation of concerns, ensuring bank-grade payment processing, cryptographic idempotency, and high-concurrency leaderboard tabulation:

```
face-of-creativity/
├── backend/
│   ├── src/
│   │   ├── config/             # Atomic database persistence & connection adapters
│   │   ├── controllers/        # REST controllers (auth, contestants, votes, payments, admin)
│   │   ├── middleware/         # JWT protect, RBAC authorize, rate-limiters, error handling
│   │   ├── models/             # Mongoose-compatible schema definitions
│   │   ├── routes/             # Express API route modules (/api/*)
│   │   ├── services/           # Paystack gateway, live leaderboard calculations, notifications
│   │   ├── utils/              # Contestant ID generator, unique slugify, pagination, seed script
│   │   ├── app.ts              # Express application assembly
│   │   └── server.ts           # Standalone backend server runner
│   ├── .env.example            # Environment variables blueprint
│   ├── package.json            # Backend dependencies & scripts
│   └── README.md
├── src/                        # React 19 Frontend SPA
│   ├── components/             # Reusable UI (Navbar, Footer, ContestantCard, VoteModal, ShareModal)
│   ├── context/                # Authentication & User state context
│   ├── lib/                    # Axios API client with bearer token interceptors
│   ├── pages/                  # Public & Admin pages
│   │   ├── admin/              # Management Dashboard, Contestants, Applications, Votes, Ledger
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContestantsPage.tsx
│   │   ├── ContestantProfilePage.tsx
│   │   ├── LeaderboardPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── VotePage.tsx
│   │   ├── VoteContestantPage.tsx
│   │   ├── RulesPage.tsx
│   │   ├── FaqPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── PaymentCallbackPage.tsx
│   ├── App.tsx                 # Client routing hierarchy
│   ├── main.tsx                # DOM entry point
│   └── index.css               # Editorial African luxury styling, Syne & Plus Jakarta Sans typography
├── data/                       # Persistent JSON document store for zero-config reliability
├── index.html                  # HTML entry point with synchronized metadata & OpenGraph tags
├── metadata.json               # Platform capabilities & identity descriptor
├── package.json                # Root build & execution scripts
├── server.ts                   # Production full-stack server
├── tsconfig.json               # TypeScript compiler rules
└── vite.config.ts              # Vite dev server with integrated Express backend middleware
```

---

## 2. Default Administrator Credentials

During initial database seeding, default administrative accounts are provisioned:

- **Super Administrator**:
  - **Email**: `admin@faceofcreativity.ng`
  - **Password**: `AdminPassword2026!`
  - **Role**: `super_admin` (Full permissions across votes, finances, staff, and content)

- **Moderation Committee**:
  - **Email**: `moderator@faceofcreativity.ng`
  - **Password**: `Moderator2026!`
  - **Role**: `moderator` (Application review and contestant approval)

*(Note: In production, change passwords immediately via the Admin Console).*

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
# Server & Environment
PORT=3000
NODE_ENV=production

# Database (Optional MongoDB Atlas connection; defaults to atomic file-persistence if omitted)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/face_of_creativity?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=super_secret_jwt_encryption_key_at_least_32_characters_long

# Paystack API Keys (https://dashboard.paystack.com/#/settings/developer)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_signature

# Supabase Media Storage (https://app.supabase.com/project/_/settings/api)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_or_service_role_key
SUPABASE_STORAGE_BUCKET=contestants

# Initial Admin Seeding
ADMIN_EMAIL=admin@faceofcreativity.ng
ADMIN_PASSWORD=AdminPassword2026!
```

---

## 4. Paystack Payment Gateway & Anti-Fraud Architecture

### Strict Server-Side Calculation
1. **Never trust client amounts**: Frontend requests specify only `votes` (e.g. 50 votes). The backend calculates `amount = votes * votePrice` (₦5,000).
2. **Pending Ledger Record**: An immutable `Payment` record with status `pending` is written to the database before the Paystack authorization URL is returned.
3. **Cryptographic Verification**:
   - For callbacks: `GET /api/votes/verify/:reference` queries Paystack's verify endpoint.
   - For webhooks: `POST /api/votes/webhook` validates the HMAC-SHA512 signature using `PAYSTACK_WEBHOOK_SECRET`.
4. **Idempotency & Double-Credit Prevention**: If a reference is already marked `status: 'success'`, re-verification returns the cached receipt and refuses to increment votes twice.
5. **Audited Vote Adjustments**: Administrators cannot casually edit vote tallies. Any manual adjustment requires an administrative reason (minimum 5 characters) and writes an indelible record to `activities`.

---

## 5. Development & Production Commands

### Install Dependencies
```bash
npm install
```

### Seed Database
```bash
npm run seed
```

### Development Mode (Unified Port 3000)
Runs Vite with integrated Express API proxy:
```bash
npm run dev
```

### Standalone Backend Server (Port 5000)
```bash
npm run server
```

### Production Build & Launch
```bash
npm run build
npm start
```

---

## 6. High-Concurrency Scaling Strategy (100k+ Live Voters)

During live national finals broadcasts, voting spikes can generate tens of thousands of concurrent requests per minute. The system is designed to scale horizontally:

1. **Redis Caching & Atomic Buffering**:
   - Cache contestant profiles and the calculated top 100 leaderboard in Redis (`SET foc:leaderboard <json> EX 5`).
   - Use Redis `HINCRBY foc:contestant:votes <contestantId> <votes>` for near-instant sub-millisecond voting updates, with an asynchronous worker worker writing batches to MongoDB every 2 seconds.

2. **Database Sharding & Read Replicas**:
   - Route all public `GET /api/leaderboard` and `GET /api/contestants` queries to MongoDB Read Replicas.
   - Index `contestantId`, `slug`, `status`, and `voteCount` fields with compound indexes:
     ```js
     contestantSchema.index({ status: 1, voteCount: -1 });
     voteSchema.index({ contestant: 1, createdAt: -1 });
     ```

3. **Rate Limiting & Cloudflare Edge Protection**:
   - Deploy behind Cloudflare with DDoS protection and rate limiting on `POST /api/votes/initialize`.
   - Use Express Rate Limit (`express-rate-limit`) to prevent automated credential stuffing and bot voting.

4. **Webhook Queuing via BullMQ / RabbitMQ**:
   - Paystack webhook bursts during commercial breaks are ingested into an in-memory Redis message queue and processed by dedicated background workers with retry policies.
# faceofcreativity
