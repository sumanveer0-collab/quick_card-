# QuickCard – Your Business Card Mitra 🪪

Production-ready NestJS backend for QuickCard — a SaaS platform for creating, sharing, and printing professional digital business cards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (Node.js) |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh tokens) |
| Image Storage | Cloudinary |
| Card Rendering | Puppeteer (300 DPI) |
| Payments | Razorpay |
| AI Generation | OpenAI GPT-4o-mini |
| Queue | BullMQ + Redis |
| Rate Limiting | @nestjs/throttler |

---

## Project Structure

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── cloudinary/         # Cloudinary provider + service
│   ├── decorators/         # @CurrentUser, @Public
│   ├── filters/            # Global HTTP exception filter
│   ├── guards/             # JwtAuthGuard
│   ├── interceptors/       # Response transform interceptor
│   └── logger/             # Winston config
└── modules/
    ├── auth/               # Register, Login, Refresh
    ├── user/               # Profile, plan management
    ├── template/           # Card templates by category
    ├── ai/                 # OpenAI branding generation
    ├── card/               # Card CRUD + image generation
    │   ├── processors/     # BullMQ Puppeteer processor
    │   └── templates/      # HTML card builder
    ├── share/              # Public card page (GET /c/:slug)
    ├── subscription/       # Razorpay plans + webhooks
    └── print/              # Physical print orders
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Start Redis (required for BullMQ)

```bash
docker run -d -p 6379:6379 redis:alpine
```

### 4. Run development server

```bash
npm run start:dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login |
| POST | `/api/v1/auth/refresh` | Public | Refresh tokens |

### User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/user/profile` | JWT | Get profile |
| PATCH | `/api/v1/user/profile` | JWT | Update profile |

### Templates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/templates` | Public | All templates |
| GET | `/api/v1/templates?category=food` | Public | Filter by category |

### AI
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/ai/generate` | JWT | Generate branding |

### Cards
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/card/create` | JWT | Create card |
| GET | `/api/v1/card/list` | JWT | List my cards |
| DELETE | `/api/v1/card/:id` | JWT | Delete card |
| POST | `/api/v1/card/print-ready` | JWT | Queue 300 DPI export |

### Share
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/c/:slug` | Public | Public card page |

### Subscription
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/subscription/create-order` | JWT | Create Razorpay order |
| POST | `/api/v1/subscription/verify` | JWT | Verify payment |
| POST | `/api/v1/subscription/webhook` | Public | Razorpay webhook |
| GET | `/api/v1/subscription/history` | JWT | Payment history |

### Print Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/print/pricing` | Public | Pricing info |
| POST | `/api/v1/print/order` | JWT | Place print order |
| GET | `/api/v1/print/orders` | JWT | My print orders |
| GET | `/api/v1/print/orders/:id` | JWT | Order details |

---

## Plans & Limits

| Plan | Price | Print-Ready/Month | AI/Day |
|---|---|---|---|
| Free | ₹0 | 0 | 3 |
| Basic | ₹49 | 1 | 10 |
| Pro | ₹99 | 5 | 30 |

---

## Card Generation Flow

```
User → Create Card
  → Generate QR (WhatsApp link)
  → Queue BullMQ job
    → Puppeteer renders HTML template
    → Inject card data + colors
    → Screenshot/PDF at correct DPI
    → Upload to Cloudinary
    → Update card.imageUrl / card.printReadyUrl
```

### Print-Ready Specs
- Size: 3.5 × 2 inches (standard business card)
- DPI: 300 (print-ready) / 96 (normal)
- Bleed: 3mm on all sides
- Format: PDF (print-ready) / PNG (normal)
- Color: CMYK-optimized CSS filters

---

## Print Order Pricing

```
Price = (Base ₹2 + Paper Upgrade + Finish Upgrade) × Quantity

Paper:
  Basic   → +₹0
  Premium → +₹1/card
  Luxury  → +₹3/card

Finish:
  Matte  → +₹0
  Glossy → +₹0.50/card

Minimum order: ₹50
```

---

## Template Categories

- `corporate` – Professional, clean layouts
- `creative` – Bold, artistic designs
- `local` – Simple, trust-building
- `food` – Warm, appetizing colors
- `beauty` – Elegant, feminine aesthetics
- `fitness` – Bold, energetic dark themes

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens (15m) + refresh tokens (7d)
- Razorpay signature verification (HMAC-SHA256)
- DTO validation with class-validator (whitelist mode)
- Rate limiting on all endpoints (100 req/min)
- AI endpoint throttled separately
- HTML output sanitized (XSS prevention)
