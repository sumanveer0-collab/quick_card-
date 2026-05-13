# QuickCard - Complete URL Reference Guide

## 🌐 Frontend URLs (localhost:3000)

### Public Pages
```
http://localhost:3000/                          - Home page
http://localhost:3000/login                     - Login page
http://localhost:3000/signup                    - Signup page
http://localhost:3000/create                    - Create new card form
```

### Template & Design Pages
```
http://localhost:3000/templates                 - Template gallery
http://localhost:3000/templates?category=minimal - Filtered templates
http://localhost:3000/business-card-designs     - E-commerce designs page
http://localhost:3000/customize                 - Canvas editor (empty)
http://localhost:3000/customize?templateId={id} - Editor with template loaded
http://localhost:3000/customize?designId={id}   - Editor with saved design
```

### User Pages
```
http://localhost:3000/profile                   - User profile
http://localhost:3000/my-designs                - User's saved designs
http://localhost:3000/upgrade                   - Premium upgrade page
```

### Product & Checkout
```
http://localhost:3000/product-options           - Product configuration
http://localhost:3000/cart                      - Shopping cart
http://localhost:3000/checkout                  - Checkout page
```

---

## 🔌 Backend API URLs (localhost:3001)

### Base URL
```
http://localhost:3001/api/v1
```

### Health Check
```
GET http://localhost:3001/api/v1/health
```

### Authentication
```
POST http://localhost:3001/api/v1/auth/login
POST http://localhost:3001/api/v1/auth/signup
POST http://localhost:3001/api/v1/auth/refresh
POST http://localhost:3001/api/v1/auth/logout
```

### Templates
```
GET  http://localhost:3001/api/v1/templates              - List all templates
GET  http://localhost:3001/api/v1/templates?limit=20     - Paginated templates
GET  http://localhost:3001/api/v1/templates/{id}         - Get single template
POST http://localhost:3001/api/v1/templates              - Create template (admin)
PUT  http://localhost:3001/api/v1/templates/{id}         - Update template (admin)
DELETE http://localhost:3001/api/v1/templates/{id}       - Delete template (admin)
```

### Business Cards
```
GET  http://localhost:3001/api/v1/card                   - List user's cards
GET  http://localhost:3001/api/v1/card/{id}              - Get single card
POST http://localhost:3001/api/v1/card/create            - Create new card
PUT  http://localhost:3001/api/v1/card/{id}              - Update card
DELETE http://localhost:3001/api/v1/card/{id}            - Delete card
```

### Designs
```
GET  http://localhost:3001/api/v1/designs                - List user's designs
GET  http://localhost:3001/api/v1/designs/{id}           - Get single design
POST http://localhost:3001/api/v1/designs                - Create design
PUT  http://localhost:3001/api/v1/designs/{id}           - Update design
DELETE http://localhost:3001/api/v1/designs/{id}         - Delete design
```

### User
```
GET  http://localhost:3001/api/v1/user/profile           - Get user profile
PUT  http://localhost:3001/api/v1/user/profile           - Update profile
GET  http://localhost:3001/api/v1/user/subscription      - Get subscription info
```

---

## 🎯 Complete User Journey URLs

### Journey 1: Quick Start (No Login)
```
1. http://localhost:3000/
2. http://localhost:3000/templates
3. http://localhost:3000/customize?templateId={id}
4. [Edit and download]
```

### Journey 2: Full Registration Flow
```
1. http://localhost:3000/
2. http://localhost:3000/signup
3. http://localhost:3000/create
4. http://localhost:3000/templates
5. http://localhost:3000/customize?templateId={id}
6. http://localhost:3000/product-options
7. http://localhost:3000/cart
8. http://localhost:3000/checkout
```

### Journey 3: Browse Designs → Customize
```
1. http://localhost:3000/business-card-designs
2. [Select category: Shapes/Papers/Specialty/Creative]
3. http://localhost:3000/customize?designType={type}
4. [Customize and save]
```

### Journey 4: Edit Existing Design
```
1. http://localhost:3000/login
2. http://localhost:3000/my-designs
3. http://localhost:3000/customize?designId={id}
4. [Edit and save]
```

---

## 🔗 URL Parameters

### Template Loading
```
?templateId={id}          - Load specific template
?category={category}      - Filter by category
?search={query}           - Search templates
```

### Design Loading
```
?designId={id}            - Load saved design
?designType={type}        - Load design type (from business-card-designs)
```

### Product Options
```
?orientation=horizontal   - Card orientation
?quantity=100             - Number of cards
?paper=glossy             - Paper type
```

### Filters
```
?category=minimal         - Category filter
?color=blue               - Color filter
?premium=true             - Premium only
?sort=popular             - Sort order
```

---

## 📱 Mobile URLs (Same as Desktop)

All URLs work on mobile with responsive design:
```
http://localhost:3000/templates          - Mobile template gallery
http://localhost:3000/customize          - Mobile editor (touch-optimized)
http://localhost:3000/business-card-designs - Mobile designs page
```

---

## 🎨 Design System URLs

### Tailwind Config
```
frontend/tailwind.config.js              - Tailwind configuration
frontend/app/globals.css                 - Global styles
```

### Component Library
```
frontend/components/                     - Reusable components
frontend/components/customize/           - Editor components
```

---

## 🛠️ Development URLs

### Development Servers
```
Frontend:  http://localhost:3000
Backend:   http://localhost:3001
MongoDB:   mongodb://localhost:27017/quickcard
```

### Hot Reload
```
Frontend: Automatic (Next.js)
Backend:  Automatic (NestJS with --watch)
```

### Build URLs
```
Frontend Build:  npm run build (in frontend/)
Backend Build:   npm run build (in root)
```

---

## 📊 API Testing URLs (Postman/Thunder Client)

### Import Collection
```
Base URL: http://localhost:3001/api/v1
Headers:
  - Content-Type: application/json
  - Authorization: Bearer {token}
```

### Example Requests

**Get Templates:**
```
GET http://localhost:3001/api/v1/templates
```

**Get Single Template:**
```
GET http://localhost:3001/api/v1/templates/6745a1b2c3d4e5f6g7h8i9j0
```

**Create Card:**
```
POST http://localhost:3001/api/v1/card/create
Body:
{
  "name": "John Doe",
  "businessName": "Doe Enterprises",
  "phone": "+91 9876543210",
  "email": "john@doe.com",
  "templateId": "6745a1b2c3d4e5f6g7h8i9j0"
}
```

---

## 🎯 Quick Access Links

### Most Used URLs
```
Templates:     http://localhost:3000/templates
Editor:        http://localhost:3000/customize
Designs:       http://localhost:3000/business-card-designs
My Designs:    http://localhost:3000/my-designs
Profile:       http://localhost:3000/profile
```

### Admin URLs (Future)
```
Admin Dashboard:  http://localhost:3000/admin
Template Manager: http://localhost:3000/admin/templates
User Manager:     http://localhost:3000/admin/users
Analytics:        http://localhost:3000/admin/analytics
```

---

## 🔐 Protected Routes

### Requires Authentication
```
/my-designs
/profile
/product-options
/cart
/checkout
/admin/*
```

### Public Routes
```
/
/login
/signup
/templates
/business-card-designs
/customize (demo mode)
```

---

## 🚀 Deployment URLs (Production)

### Frontend (Vercel)
```
Production:  https://quickcard.vercel.app
Preview:     https://quickcard-{branch}.vercel.app
```

### Backend (Railway/Heroku)
```
Production:  https://api.quickcard.com/api/v1
Staging:     https://staging-api.quickcard.com/api/v1
```

### Database (MongoDB Atlas)
```
Production:  mongodb+srv://user:pass@cluster.mongodb.net/quickcard
Staging:     mongodb+srv://user:pass@cluster.mongodb.net/quickcard-staging
```

---

## 📝 URL Naming Conventions

### Frontend Routes
- Use kebab-case: `/business-card-designs`
- Use query params for filters: `?category=minimal`
- Use path params for IDs: `/customize?templateId={id}`

### API Endpoints
- Use plural nouns: `/templates`, `/designs`
- Use RESTful verbs: GET, POST, PUT, DELETE
- Use path params for IDs: `/templates/{id}`
- Use query params for filters: `?limit=20&page=1`

---

## 🎉 Quick Start Commands

### Start Development
```bash
# Terminal 1 - Backend
cd j:\QuickCard
npm run start:dev

# Terminal 2 - Frontend
cd j:\QuickCard\frontend
npm run dev
```

### Access Application
```
Frontend: http://localhost:3000
Backend:  http://localhost:3001
API Docs: http://localhost:3001/api/v1/health
```

---

## 📞 Support URLs

### Documentation
```
Main Docs:     /QUICKCARD_DESKTOP_APP_COMPLETE_GUIDE.md
API Docs:      /API_DOCUMENTATION.md
Template Flow: /TEMPLATE_TO_EDITOR_FLOW_COMPLETE.md
```

### Help Resources
```
GitHub:        https://github.com/yourusername/quickcard
Issues:        https://github.com/yourusername/quickcard/issues
Discussions:   https://github.com/yourusername/quickcard/discussions
```

---

**Version:** 1.0.0  
**Last Updated:** May 13, 2026  
**Status:** ✅ Complete Reference

**Bookmark This Page:** Keep this reference handy for quick access to all QuickCard URLs!
