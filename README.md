# Bella Vista Frontend

Modern webbapplikation för Bella Vista Ristorante - en italiensk restaurang i Stockholm. Innehåller både publik webbplats och admin-panel för komplett restauranghantering.
[Publik-Webbplats](https://bella-vista-frontend-hawi2401.netlify.app/)
[Admin-Dashboard](https://bella-vista-frontend-hawi2401.netlify.app/admin/)

## 📋 Översikt

Bella Vista Frontend består av två huvudkomponenter:

- **Publik webbplats** - Elegant presentation av restaurangen med meny och reservationssystem
- **Admin-panel** - Komplett hanteringssystem för meny, kategorier och reservationer

Applikationen är byggd med modern vanilla JavaScript och Webpack för optimal prestanda och användarupplevelse.

## 🛠 Teknisk Stack

| Teknologi              | Syfte                                | Version |
| ---------------------- | ------------------------------------ | ------- |
| **HTML**               | Semantisk markup                     | -       |
| **CSS**                | Modern styling med custom properties | -       |
| **Vanilla JavaScript** | Modulär frontend-logik               | ES6+    |
| **Webpack**            | Build system och bundling            | ^5.88.0 |
| **Webpack Dev Server** | Utvecklingsserver                    | ^4.15.1 |

## 🏗 Projektstruktur

```
bella-vista-frontend/
├── src/                          # Publik webbplats
│   ├── css/
│   │   ├── variables.css         # CSS custom properties
│   │   ├── base.css              # Grundläggande stilar
│   │   ├── layout.css            # Layout-komponenter
│   │   ├── sections.css          # Sektionsspecifika stilar
│   │   ├── components.css        # UI-komponenter
│   │   ├── responsive.css        # Responsiv design
│   │   ├── utilities.css         # Hjälpklasser
│   │   └── main.css              # Huvudstilmall
│   ├── js/
│   │   ├── modules/
│   │   │   ├── navigation.js     # Navigationslogik
│   │   │   ├── loading.js        # Laddningshantering
│   │   │   ├── menu.js           # Menyvisning
│   │   │   └── reservation.js    # Reservationsformulär
│   │   └── main.js               # Huvudapplikation
│   ├── images/                   # Statiska bilder
│   └── index.html                # Huvudsida
├── admin/                        # Admin-panel
│   ├── js/
│   │   ├── api.js                # API-kommunikation
│   │   ├── auth.js               # Autentisering
│   │   ├── dashboard.js          # Dashboard-funktionalitet
│   │   ├── menu.js               # Menyhantering
│   │   ├── categories.js         # Kategorihantering
│   │   ├── reservations.js       # Reservationshantering
│   │   └── main.js               # Admin-applikation
│   ├── styles/
│   │   └── main.css              # Admin-stilar
│   ├── index.html                # Admin-interface
│   └── serve.js                  # Lokal server för admin
├── dist/                         # Build-output
├── webpack.config.js             # Webpack-konfiguration
├── netlify.toml                  # Netlify-deployment
└── package.json                  # Dependencies och scripts
```

## 🌐 Publik Webbplats

### Funktioner

- **Responsiv design** - Optimerad för alla enheter
- **Dynamisk meny** - Hämtas från API och grupperas per kategori
- **Reservationssystem** - Formulär med validering och API-integration
- **Smooth scrolling** - Smidig navigation mellan sektioner
- **Loading states** - Användarvänlig feedback under laddning

### Sektioner

1. **Hero** - Välkomstsektion med call-to-action
2. **Om oss** - Restaurangpresentation
3. **Meny** - Dynamisk menyvisning från API
4. **Reservation** - Bordsreservationsformulär
5. **Kontakt** - Kontaktinformation och öppettider

### CSS-arkitektur

```css
/* CSS Custom Properties för konsistent design */
:root {
  --primary-color: #8b4513;
  --secondary-color: #d4af37;
  --text-color: #333;
  --background-color: #fff;
  /* ... fler variabler */
}
```

## 🔐 Admin-Panel

### Funktioner

- **JWT-autentisering** - Säker inloggning med token-hantering
- **Dashboard** - Översikt med statistik och snabbåtgärder
- **Menyhantering** - CRUD-operationer för rätter
- **Kategorihantering** - Hantering av menykategorier
- **Reservationshantering** - Visa, uppdatera och ta bort reservationer
- **Responsiv design** - Fungerar på alla enheter
- **Modal-system** - Elegant formulärhantering

### Admin-sektioner

#### Dashboard

- Översikt över reservationer
- Snabbstatistik
- Senaste aktiviteter

#### Menyhantering

```javascript
// CRUD-operationer för meny
- Visa alla rätter
- Lägg till ny rätt
- Redigera befintlig rätt
- Ta bort rätt
- Aktivera/inaktivera rätter
```

#### Kategorihantering

```javascript
// Kategori-funktioner
- Visa kategorier
- Skapa ny kategori
- Redigera kategori
- Ta bort kategori
- Sortera kategorier
```

#### Reservationshantering

```javascript
// Reservationsstatus
-pending(väntande) - confirmed(bekräftad) - cancelled(avbokad);
```

## 📡 API-integration

### Konfiguration

```javascript
// Automatisk miljöhantering
const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://bella-vista-backend.onrender.com/api"
    : "http://localhost:3000/api";
```

### Publika API-anrop

```javascript
// Hämta meny
GET / api / menu;

// Skapa reservation
POST / api / reservations;
```

### Admin API-anrop (JWT krävs)

```javascript
// Autentisering
POST /api/auth/login

// Menyhantering
GET /api/menu/all
POST /api/menu
PUT /api/menu/:id
DELETE /api/menu/:id

// Kategorihantering
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

// Reservationshantering
GET /api/reservations
PUT /api/reservations/:id/status
DELETE /api/reservations/:id
```

## 🚀 Build & Deployment

### NPM Scripts

```bash
npm run dev          # Utvecklingsserver med hot reload
npm run build        # Produktionsbygge
npm run watch        # Watch-läge för utveckling
```

### Webpack-konfiguration

- **Utveckling:** Hot reload, source maps, style-loader
- **Produktion:** Minifiering, CSS-extraktion, content hashing

### Netlify Deployment

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deployment-URLs

- **Publik webbplats:** `https://bella-vista-frontend-hawi2401.netlify.app`
- **Admin-panel:** `https://bella-vista-hawi2401.netlify.app/admin`
