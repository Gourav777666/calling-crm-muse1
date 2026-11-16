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

## v3 (Nov 2026)
- **Distribution:** Unassigned pool, bulk upload par load-balanced round-robin (sirf active callers, barabar), single + bulk assign/reassign, campaign-wise aur caller-wise load, assignment history har lead ki timeline me.
- **Auto-Dial unlimited:** koi call cap nahi (quota sirf daily TARGET hai, limit nahi). One-click Start Auto-Dial session, Pause/Resume/Stop, live session stats, adjustable next gap.
- **In-app calling:** app ke andar calling screen (lead details, timer, controls), disposition wahi se. APK me native direct call (ACTION_CALL, dialpad bina) bridge — web par tel: fallback. Browser se direct SIM call technically possible nahi, isliye wo APK route se hai.
- **History + Recording:** caller ko My Call History tab (filters + recording play), lead timeline me calls + distribution history, admin master logs me filters. Auto-recording native hook har call par (jahan OS support kare auto-attach + play), OS block par graceful note, web par upload.
- **UI:** campaign colours, avatar cards, analytics bar charts/funnel, bade call buttons, empty states. Light + Deep Charcoal themes.
- Note: data abhi in-memory demo store par hai — real leads se pehle Postgres (prisma/schema.prisma ready) wala step baaki hai.

<!-- deploy refresh: compact cards + safe-area (c4a23f3) -->
