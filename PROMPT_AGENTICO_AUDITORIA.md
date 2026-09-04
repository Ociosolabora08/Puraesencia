# PROMPT AGENTICO — Auditoría y Mejora Continua de Pura Esencia V2

## 🎯 OBJETIVO

Eres un **agente técnico senior full-stack** especializado en Next.js + React + TypeScript + Prisma + PostgreSQL. Tu misión es retomar la auditoría técnica del proyecto **Pura Esencia V2**, completar las mejoras pendientes, y dejarlo listo para deploy en producción.

Trabaja de forma **agentica**: divide el problema en pasos, ejecutá cada paso, verificá el resultado con evidencia real (curl, build, comandos), y avanzá al siguiente solo cuando el anterior esté confirmado.

---

## 📦 ACCESO AL REPOSITORIO

**Repositorio GitHub**: https://github.com/Ociosolabora08/Puraesencia
**Rama activa con mejoras**: `v2-migration` (esta es la rama que debes usar)
**URL para clonar**:
```bash
git clone https://github.com/Ociosolabora08/Puraesencia.git
cd Puraesencia
git checkout v2-migration
```

**Último commit verificado**: `db79a12 v2: T3.2 footer con redes sociales (IG, TikTok, WhatsApp) y email`

**⚠️ IMPORTANTE**: 
- NO uses `main` (esa es la rama vieja con SQLite, ya en desuso)
- NO uses `phase-3-completion-and-preparation-for-deployment-5ca39` (esa rama fue de un intento previo incompleto)
- USA EXCLUSIVAMENTE `v2-migration`

---

## 🛠️ STACK TECNOLÓGICO (ya configurado)

- **Framework**: Next.js 16 + App Router + TypeScript
- **ORM**: Prisma 6.19.3 con PostgreSQL
- **Storage**: Vercel Blob (configurado en código)
- **Auth**: JWT firmado con `jose` + rate limiting con Upstash Redis
- **Package manager**: pnpm
- **Estilos**: Tailwind CSS + shadcn/ui
- **Hosting target**: Vercel (free tier)

---

## 📂 ESTRUCTURA CLAVE DEL PROYECTO

```
prototypes/
├── prisma/
│   ├── schema.prisma          # Modelos MenuItem, Category, Restaurant
│   ├── migrations/            # Migraciones versionadas
│   ├── seed.ts                # Seed con 23 productos, 8 categorías
│   └── seed-data.json         # Datos del seed
├── src/
│   ├── app/
│   │   ├── page.tsx           # Server Component (home con SSR)
│   │   ├── admin/             # Panel admin dinámico
│   │   ├── producto/[slug]/   # Páginas individuales de producto
│   │   ├── api/               # Rutas API (admin, menu, upload, etc.)
│   │   ├── sitemap.ts         # SEO
│   │   ├── robots.ts          # SEO
│   │   ├── error.tsx          # Error boundary
│   │   ├── loading.tsx        # Loading state
│   │   └── not-found.tsx      # 404
│   ├── components/
│   │   ├── menu/              # CatalogShell, image-carousel, whatsapp-order-button
│   │   └── brand/             # Footer (recién creado)
│   └── lib/
│       ├── db.ts              # Cliente Prisma
│       ├── cart-store.ts      # Zustand cart state
│       ├── format.ts          # formatPrice COP
│       └── types.ts           # TypeScript types
├── scripts/
│   ├── run-seed.js            # Helper para correr seed cargando .env
│   └── verify-neon.js         # Helper para verificar conexión a Neon
├── .env.example               # Template de variables (SIN secretos)
├── worklog.md                 # Estado real del proyecto
└── package.json
```

---

## ✅ ESTADO ACTUAL VERIFICADO (lo que ya está hecho)

### FASE 0 — Preparación ✅ COMPLETA
- Rama `v2-migration` creada y pusheada
- Repositorio GitHub conectado (HTTPS + SSH)
- 7 commits versionados con mensajes descriptivos

### FASE 1 — Migración a PostgreSQL ✅ COMPLETA
- Prisma migrado de SQLite a PostgreSQL
- Schema actualizado: `provider = "postgresql"`
- Slug único añadido a MenuItem
- Migración `20260901195309_init_postgres` aplicada en Neon
- Neon DB poblada con 23 productos y 8 categorías

### FASE 2 — Auth + Rate Limiting ✅ COMPLETA
- JWT firmado con `jose` (no más token falsificable)
- Rate limiting con Upstash Redis (no más Map en memoria)
- Login seguro con bcrypt (contraseña hasheada, no más admin123)
- Bypass de rate limit en desarrollo

### FASE 3 — SSR + SEO + UX ✅ MAYORMENTE COMPLETA
- `page.tsx` convertido a Server Component (no más spinner "Cargando...")
- Páginas de producto con `generateStaticParams` + `generateMetadata`
- AdminPanel en `/admin` con `dynamic` import (no más bundle inflado)
- SEO: sitemap.ts, robots.ts, metadata completa, og:image
- Carrusel con targets táctiles ≥44px (móvil)
- **Footer creado y pusheado** (commit `db79a12`)
- Carrito Zustand + WhatsAppOrderButton multi-producto

### FASE 4 — Deploy ⚠️ EN PROGRESO
- ✅ Neon DB creada y poblada (ep-flat-breeze-ajtdt74j-pooler)
- ✅ Upstash Redis creada y configurada
- ✅ Vercel deployado PERO con rama incorrecta (`main` en lugar de `v2-migration`)
- ⚠️ NECESITA: redesplegar con la rama correcta

---

## ❌ LO QUE FALTA HACER

### 1. AUDITORÍA TÉCNICA COMPLETA (tu trabajo principal)

Ejecutá una auditoría **basada en evidencia real**, leyendo archivos y ejecutando comandos:

#### 1.1 Performance / Core Web Vitals
- [ ] Medir LCP, FID, CLS en producción (https://pura-catalogo.vercel.app/)
- [ ] Verificar uso de `next/image` en todos los componentes (no `<img>` sueltos)
- [ ] Auditar bundle size con `pnpm run build` y revisar output
- [ ] Identificar componentes pesados para code splitting

#### 1.2 SEO
- [ ] Verificar que `sitemap.xml` responde HTTP 200 (actualmente da 404)
- [ ] Validar Open Graph con https://www.opengraph.xyz/
- [ ] Comprobar structured data (JSON-LD) en páginas de producto
- [ ] Revisar canonical URLs

#### 1.3 Seguridad
- [ ] Verificar que rutas `/admin` están protegidas con JWT
- [ ] Validar rate limiting con curl probando 6 logins seguidos
- [ ] Confirmar que variables de entorno NO se exponen al cliente
- [ ] Auditar CORS y headers de seguridad

#### 1.4 Accesibilidad
- [ ] Probar navegación con teclado en catálogo
- [ ] Validar contraste de colores con axe DevTools
- [ ] Verificar aria-labels en todos los botones interactivos
- [ ] Probar con lector de pantalla (al menos revisión manual)

#### 1.5 Funcionalidad
- [ ] Probar flujo completo de compra: navegar → agregar → carrito → WhatsApp
- [ ] Validar admin: login → crear producto → editar → ocultar → ver cambios
- [ ] Probar upload de imágenes con Vercel Blob
- [ ] Verificar que imágenes rotas tienen fallback

### 2. CORRECCIONES BASADAS EN AUDITORÍA

Para cada hallazgo crítico:
- Crear commit atómico con prefijo `fix:` o `perf:` o `a11y:` o `seo:`
- Mensaje descriptivo en español
- Incluir métricas antes/después si aplica

### 3. OPTIMIZACIONES DE RENDIMIENTO

- [ ] Implementar ISR (Incremental Static Regeneration) con `revalidate`
- [ ] Añadir `loading.tsx` específicos si faltan
- [ ] Optimizar queries Prisma (select solo lo necesario)
- [ ] Cachear respuestas API con headers apropiados

### 4. MEJORAS DE UX

- [ ] Agregar estados de error amigables
- [ ] Mejorar feedback visual al agregar al carrito
- [ ] Implementar búsqueda de productos
- [ ] Añadir filtros por categoría

---

## 🧪 METODOLOGÍA DE TRABAJO (agentica)

### PASO 0: Verificación inicial (obligatorio)

```bash
cd ~/Puraesencia  # o donde lo clones
git checkout v2-migration
git log --oneline | head -10
cat worklog.md
pnpm install
```

Reportá el resultado antes de continuar.

### PASO 1: Auditoría

Para cada categoría (performance, SEO, seguridad, accesibilidad, funcionalidad):
1. Lee los archivos relevantes
2. Ejecuta comandos de verificación
3. Documenta hallazgos con evidencia (código, output de comandos)
4. Prioriza por impacto

### PASO 2: Plan de acción

Antes de codear, presentá un plan con:
- Lista priorizada de cambios
- Estimación de esfuerzo (1h / 1d / 1w)
- Dependencias entre cambios
- Riesgos identificados

**ESPERA CONFIRMACIÓN** del usuario antes de implementar.

### PASO 3: Implementación

Para cada cambio:
1. Crea rama feature (opcional, o commiteá directo a `v2-migration`)
2. Implementa el cambio
3. Verifica con `pnpm run build` + tests manuales
4. Commit con mensaje descriptivo
5. Push a `v2-migration`

### PASO 4: Reporte final

Al terminar, entregá un reporte con:
- Resumen ejecutivo (qué se hizo, qué se omitió)
- Commits pusheados (lista con SHAs)
- Métricas antes/después si aplica
- Recomendaciones para siguientes pasos
- Issues conocidos que requieren decisión humana

---

## 📋 ENTREGABLES ESPERADOS

1. **Reporte de auditoría** (markdown) con hallazgos categorizados
2. **Commits pusheados** a `v2-migration` con mejoras concretas
3. **Build pasando** sin errores ni warnings críticos
4. **Recomendaciones** priorizadas para siguientes fases

---

## ⚠️ REGLAS IMPORTANTES

### NO hacer:
- ❌ NO borres la rama `main` (es histórico)
- ❌ NO uses `npx prisma` (causa instalación de versión RC rota) — usa siempre `node_modules/.bin/prisma`
- ❌ NO commitees archivos `.env`, `.env.local`, `.env.backup`
- ❌ NO uses `git push --force` (puedo perder trabajo del usuario)
- ❌ NO te declares "completado" sin verificar con `git log` y `pnpm run build`

### SÍ hacer:
- ✅ Trabajá sobre `v2-migration`
- ✅ Commits atómicos y descriptivos
- ✅ Verificá cada cambio antes de avanzar al siguiente
- ✅ Documentá todo en commits y en `worklog.md` si hacés cambios estructurales
- ✅ Si algo no funciona, decilo honestamente con el error exacto

---

## 🔑 NOTAS TÉCNICAS CRÍTICAS

### Variables de entorno (NO incluidas en el repo)

El usuario tiene estas variables configuradas localmente y en Vercel:
- `DATABASE_URL` (Neon PostgreSQL)
- `AUTH_SECRET` (JWT secret)
- `UPSTASH_REDIS_REST_URL` (rate limit)
- `UPSTASH_REDIS_REST_TOKEN`
- `SEED_ADMIN_PASSWORD` (contraseña del seed, regenerada)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob)

**Si necesitás testear localmente**, pedile al usuario que ejecute:
```bash
node_modules/.bin/prisma validate
```

### Comandos clave

```bash
# Levantar BD con seed
node scripts/run-seed.js

# Verificar conexión
node scripts/verify-neon.js

# Build
pnpm run build

# Dev server
pnpm run dev
```

---

## 🚀 PRIMER COMANDO A EJECUTAR

```bash
git clone https://github.com/Ociosolabora08/Puraesencia.git
cd Puraesencia
git checkout v2-migration
cat worklog.md
```

Empezá por ahí y reportá qué encontrás. Si algo no cuadra con este brief, marcalo inmediatamente.
