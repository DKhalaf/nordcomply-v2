# NordComply Portal

Microsoft 365 Security Management Portal med Google OAuth login og tenant management.

## Struktur

```
nordcomply-portal/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── .env.example
└── README.md
```

## Setup Guide

### 1. Google OAuth Setup

Du skal sætte Google OAuth op før du kan køre appen.

1. Gå til https://console.cloud.google.com/
2. Opret et nyt projekt
3. Gå til "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
4. Vælg "Web application"
5. Tilføj authorized redirect URIs:
   - `http://localhost:3000`
   - `https://portal.nordcomply.dk`
6. Kopier "Client ID"

### 2. Miljøvariabler

Kopier `.env.example` til `.env.local` og indsæt din Google Client ID:

```bash
cp .env.example .env.local
```

Åbn `.env.local` og erstat:
```
REACT_APP_GOOGLE_CLIENT_ID=din-client-id-her.apps.googleusercontent.com
```

### 3. Installation og kørsel

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Appen åbner på `http://localhost:3000`

## Features

### Landing Page
- Responsiv design med dark theme
- Atmosfærisk baggrund med grid og orbs
- Feature showcase
- CTA (Call-to-Action) knap

### Login Page
- Google OAuth integration
- Sikker JWT-baseret login
- Session management via localStorage

### Dashboard
- Oversigt over importerede tenants
- Stats cards med antal tenants, avg Secure Score osv.
- Tenant list med status

### Admin Panel
- Importer M365 tenants
- Input: Tenant navn, Tenant ID, Global Admin email/password
- API integration med `/api/admin/import-tenant`

## API Endpoints

Din CloudFlare Worker skal understøtte følgende endpoints:

```
GET  /api/tenants                    - Hent liste over importerede tenants
POST /api/admin/import-tenant        - Importer en ny tenant
GET  /api/secure-score?tenantId=...  - Hent Secure Score data
```

## Authentication Flow

1. User besøger `/` (ulogget) → ser LandingPage
2. User klikker "Log ind" → navigerer til `/login`
3. Google OAuth login → JWT token gemmes i localStorage
4. User redirects til `/dashboard`
5. ProtectedRoute checker hvis user er logget in
6. Hvis ikke → redirect til `/login`
7. User kan tilgå `/dashboard` og `/admin`

## Sikkerhed

- **Credentials**: Gemmes IKKE i localStorage, kun JWT
- **Tenants**: Refresh tokens gemmes sikkert på CloudFlare KV
- **API**: Alle endpoints skal være beskyttet med IP-whitelist eller authentication

## Design System

### Farver
- **Deep Navy**: `#060b18` (bg-deep)
- **Primary Blue**: `#2563eb` (blue-500)
- **Conversion Orange**: `#f97316` (orange-500)
- **Text Bright**: `#f1f5fb` (text-bright)

### Styling
- CSS Variables for farver og spacing
- Responsive grid layout
- Glassmorphism effects
- Atmospheric backgrounds

## Deployment

### CloudFlare Pages

1. Push til GitHub
2. CloudFlare Pages linker til repo
3. Build command: `cd frontend && npm install && npm run build`
4. Build output: `frontend/build`

### Environment Variables i CloudFlare

Sæt `REACT_APP_GOOGLE_CLIENT_ID` i CloudFlare Pages settings → Environment variables

## Troubleshooting

### Google Sign-In button vises ikke
- Check at Google Script loader er loaded: `<script src="https://accounts.google.com/gsi/client" async defer></script>`
- Check at Client ID er gyldig i `.env.local`
- Check Browser Console for fejl

### API endpoints returnerer 405
- Check at CloudFlare Workers er deployede
- Check at IP-whitelist ikke blokerer requests
- Verificer request URL er korrekt

### Login virker ikke
- Check localStorage: `localStorage.getItem('nordcomply_user')`
- Check at JWT token er gyldig
- Verificer Google Client ID i environment

## Development

```bash
# Start dev server
npm start

# Build for production
npm run build

# Test build locally
npm install -g serve
serve -s build
```

## Licens

Privat projekt for NordComply
