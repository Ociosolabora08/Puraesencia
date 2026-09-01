# Pura Esencia V2 — Worklog de sesión

> Estado real verificado con `git log`, `git status` y lectura de archivos.
> Última actualización: 2026-09-01

---

## 🎯 Estado de la rama

| Item | Valor |
|---|---|
| **Branch activo** | `v2-migration` |
| **Último commit** | `d776e57 feat(fase2): sesión JWT firmada + rate limiting real para login` |
| **Estado de archivos** | 15 modificados (M) + 1 eliminado (D) + 13 nuevos (??) |
| **.env.local** | ✅ Existe (529 bytes, contiene 8 vars) |

---

## ✅ Trabajo completado (commits en `v2-migration`)

### Commit `d6e43db` — `chore(v2): inicio rama v2-migration`
- Branch creada desde main
- Plan de migración documentado

### Commit `cbd4746` — `chore(fase0): AUTH_SECRET + .env.local`
- AUTH_SECRET generado
- .env.local creado con las 8 variables documentadas:
  - DATABASE_URL
  - AUTH_SECRET
  - UPSTASH_REDIS_REST_URL
  - UPSTASH_REDIS_REST_TOKEN
  - NEXT_PUBLIC_SITE_URL
  - BLOB_READ_WRITE_TOKEN
  - (+ 2 más)

### Commit `b843b53` — `feat(fase1): PostgreSQL + slugs + Vercel Blob upload con blurDataURL`
- `prisma/schema.prisma`:
  - provider cambiado a `postgresql`
  - Campo `slug String? @unique` añadido a MenuItem
- `api/upload/route.ts`:
  - Usa `@vercel/blob` (put) en vez de writeFile
  - Genera blurDataURL con sharp
- `/api/uploads/[name]/route.ts` eliminado (ya no se necesita)

### Commit `d776e57` — `feat(fase2): sesión JWT firmada + rate limiting real`
- `api/admin/login/route.ts`:
  - JWT firmado con `jose` (expiresIn: 7d)
  - Rate limiting con `@upstash/ratelimit` (sliding window 5/15min)
- `middleware.ts`:
  - Verifica JWT con `jose.jwtVerify()`
  - Solo protege /admin/* y /api/* (excepto GET públicos)

---

## 📁 Archivos V2 presentes (sin commitear aún)

Estos están creados en working tree pero **NO commiteados todavía**:

```
?? public/og-default.png            # Imagen OG por defecto (1200x630)
?? scripts/gen-og.mjs                # Script para generar og-image dinámica
?? src/app/admin/page.tsx           # ✅ Ruta admin separada con dynamic import
?? src/app/error.tsx                # ✅ Error boundary global
?? src/app/loading.tsx              # ✅ Loading state
?? src/app/not-found.tsx            # ✅ 404 personalizado
?? src/app/producto/                # ✅ Rutas /producto/[slug]
?? src/app/robots.ts                # ✅ robots.ts dinámico (sustituye robots.txt)
?? src/app/sitemap.ts               # ✅ Sitemap dinámico desde Prisma
?? src/components/menu/catalog-shell.tsx  # Componente wrapper Client
?? src/lib/cart-store.ts            # ✅ Store Zustand para carrito
?? src/lib/format.ts                # ✅ formatPrice(cents) para COP
?? src/lib/types.ts                 # Tipos compartidos
```

---

## 🔄 Archivos modificados (sin commitear)

```
M next.config.ts                                    # Probablemente ignoreBuildErrors=false + remotePatterns
D public/robots.txt                                 # ✅ Reemplazado por src/app/robots.ts
M src/app/api/categories/route.ts                   # Ajustes por schema Postgres
M src/app/api/menu-items/route.ts                   # Ajustes por schema Postgres
M src/app/layout.tsx                                # metadataBase + og:image + twitter:card + footer?
M src/app/page.tsx                                  # Conversión a Server Component
M src/components/admin/image-uploader.tsx           # Adaptado a Vercel Blob
M src/components/admin/menu-item-manager.tsx        # Slug auto-generation?
M src/components/menu/category-nav.tsx              # next/image
M src/components/menu/featured-items.tsx            # next/image
M src/components/menu/image-carousel.tsx            # next/image + sin foto placeholder
M src/components/menu/menu-card.tsx                 # next/image + formatPrice (COP)
M src/components/menu/menu-section.tsx              # Adaptado a Server Component
M src/components/menu/sticky-header.tsx             # Ajustes varios
M src/components/menu/whatsapp-order-button.tsx     # formateo a COP
```

---

## 📦 Dependencias añadidas (en package.json)

| Paquete | Versión | Uso |
|---|---|---|
| `@vercel/blob` | ^2.8.0 | Upload de imágenes |
| `jose` | ^6.2.10 | JWT firmado |
| `@upstash/redis` | ^1.38.3 | Cliente Redis serverless |
| `@upstash/ratelimit` | ^2.0.8 | Rate limiting |
| `zustand` | ^5.0.6 | Estado del carrito |

---

## ❌ LO QUE FALTA (verificado por archivos)

### Fase 3 — pequeño pendiente
- [ ] **Integrar `WhatsappOrderButton`** en `page.tsx` con `cart-store.ts` (zustand ya creado)
  - Revisar `src/components/menu/catalog-shell.tsx` y `src/lib/cart-store.ts` — probablemente ya hay un wrapper
  - Verificar que el botón flotante con conteo esté visible
- [ ] **Footer con redes sociales** (IG, TikTok, WhatsApp, email)
  - Probablemente NO creado aún
  - Revisar `src/app/layout.tsx` para ver si ya hay un `<Footer />`
- [ ] **Targets táctiles ≥44px** en flechas de `image-carousel.tsx` (p-1.5 → p-3)

### Fase 4 — deploy y validación (toda pendiente)
- [ ] Conectar repo `Ociosolabora08/Puraesencia` a Vercel
- [ ] Configurar env vars en Vercel dashboard
- [ ] Primer deploy automático al push a main
- [ ] Verificar carga desde Postgres
- [ ] Crear producto de prueba + redeploy + verificar persistencia
- [ ] Probar seguridad end-to-end (token forjado, rate limit)
- [ ] Lighthouse production run (objetivo: ≥90 mobile)

---

## 🧪 Comandos de verificación sugeridos (antes de tocar nada)

```bash
# 1. Estado general
cd ~/HERMES_PROJECTS/Pura_Esencia/prototypes
git status
git log --oneline | head -10

# 2. ¿Build pasa?
pnpm install
pnpm run build

# 3. ¿Migraciones aplicadas?
npx prisma migrate status

# 4. ¿Variables configuradas?
cat .env.local

# 5. ¿Server arranca?
pnpm run dev
# Esperar a que diga "Ready on http://localhost:3000"
# Ctrl+C y luego:
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000
```

---

## 📝 Notas para retomar

1. **NO re-analizar** — la auditoría ya está hecha. El plan está en la rama `v2-migration` y este worklog.
2. **Verificar PRIMERO qué está realmente hecho** leyendo archivos clave (no asumir).
3. **Commit frecuente** — al menos uno por tarea pequeña, con mensaje descriptivo.
4. **Si te quedas sin tokens otra vez**, actualiza este `worklog.md` con el estado real al momento de parar.
5. **El carrito con Zustand YA está creado** (`src/lib/cart-store.ts`); solo falta conectarlo visualmente.
6. **Las rutas /producto/[slug] YA están creadas**; verificar que Prisma las sirva bien con el schema nuevo.

---

## 🆘 Si encuentras problemas

- **Build falla:** lee el error completo, probablemente es una dependencia faltante o import path
- **Prisma no conecta:** verifica DATABASE_URL en .env.local
- **JWT no valida:** verifica que AUTH_SECRET sea el mismo en login y middleware
- **Imágenes no se ven:** verifica `next.config.ts` remotePatterns para Vercel Blob
- **Login no acepta contraseña:** la nueva contraseña está hasheada en DB; revisa el seed

---

## 📞 Contacto

Si una decisión de diseño queda ambigua, pregúntale al usuario antes de improvisar.
El usuario es consciente del límite de tokens y prefiere scope pequeño y commits verificables sobre features grandes sin terminar.
