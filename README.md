# Calling CRM — Telecalling CRM
Login-only RBAC CRM. Super Admin (/admin) + Caller mobile web. Theme Light/Dark, SIM dialer, disposition, WhatsApp, offline sync, PWA + Capacitor ready.
## Demo Login (change in production)
Admin: admin / admin123 | Caller: caller1 / caller123
## Run
npm install && npm run build && npm start
## Deploy Vercel
Push to GitHub, import repo in Vercel. Set AUTH_SECRET env. For production DB set DATABASE_URL + use prisma/schema.prisma.
## Structure
app/ pages + api | components/caller, components/admin | lib/ auth, db, types, native, offline, csv, templates | prisma/ schema | public/ PWA
## Android APK (Capacitor)
See APK.md
