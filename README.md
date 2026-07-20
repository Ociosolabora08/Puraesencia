# Pura Esencia — Catálogo Digital Artesanal

> Productos artesanales con ingredientes honestos, hechos a mano con cariño — para cuidarte sin sacrificar la belleza, ni el planeta, ni tu bolsillo.

Aplicación web construida con **Next.js 16 + TypeScript + Tailwind CSS + Prisma**, adaptada al brief de marca de Pura Esencia. Lista para desplegar de forma **gratuita** en Render + Neon (PostgreSQL).

---

## ✨ Características

- **Catálogo estilo Instagram** con navegación por categorías (stories-style)
- **Productos destacados** en carousel horizontal
- **Tarjetas de producto** con carrusel de imágenes, likes, bookmarks
- **Botón de pedido por WhatsApp** en cada producto
- **Panel de administración** con login (cookie auth + bcrypt + rate limiting)
- **Gestión CRUD** de categorías, productos y configuración de tienda
- **Subida de imágenes** con optimización automática a WebP (Sharp)
- **Paleta cromática Pura Esencia**: crema, rosa vibrante, menta, amarillo, turquesa
- **Tipografías oficiales**: Dancing Script (display), Caveat (script), Quicksand (body), Cormorant Italic (citas)
- **Elementos decorativos**: corazones, estrellas, gota de agua, manchas de acuarela

---

## 🆓 Despliegue gratuito (Render + Neon)

### Arquitectura recomendada

| Componente | Plataforma | Plan | Costo |
|------------|------------|------|-------|
| App Next.js | [Render](https://render.com) | Web Service Free | $0/mes |
| Base de datos | [Neon](https://neon.tech) | Free Tier (0.5 GB) | $0/mes |
| Imágenes | Unsplash URLs o subidas locales | — | $0 |

**Limitaciones del plan gratuito:**
- Render Free: 512MB RAM, 0.1 CPU, **se duerme tras 15 min de inactividad** (~30s de cold start al despertar)
- Render Free: 750 horas/mes (suficiente para 1 servicio 24/7 si recibe tráfico; si no, entra en sueño)
- Neon Free: 0.5 GB storage, 100 horas de compute/mes (suficiente para tráfico bajo-medio)
- Ancho de banda: ilimitado en ambos

---

## 🚀 Guía de despliegue paso a paso

### Paso 1: Preparar el repositorio

1. Sube este proyecto a un repositorio de GitHub (público o privado).
2. Asegúrate de que el archivo `.env` **NO** esté commiteado (está en `.gitignore`).

### Paso 2: Crear base de datos gratuita en Neon

1. Ve a https://neon.tech y regístrate (gratis, con GitHub o email).
2. Crea un nuevo proyecto: "Pura Esencia".
3. Selecciona la región más cercana a tus usuarios (us-east-2 para Latam).
4. Neon te dará una **connection string** con este formato:
   ```
   postgresql://neondb_owner:password@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Cópiala — la usarás en el siguiente paso.

### Paso 3: Desplegar en Render

Tienes dos opciones:

#### Opción A: Blueprint (recomendada, 1 clic)

1. Ve a https://render.com y regístrate.
2. Click en **"New"** → **"Blueprint"**.
3. Selecciona tu repositorio de GitHub.
4. Render detectará automáticamente `render.yaml` y creará el servicio.
5. En la pantalla de configuración, te pedirá `DATABASE_URL` — pega aquí la connection string de Neon.
6. Click en **"Apply"**.
7. Espera a que termine el build (~3-5 minutos).

#### Opción B: Manual

1. En Render, click **"New"** → **"Web Service"**.
2. Conecta tu repositorio de GitHub.
3. Configura:
   - **Name**: `pura-esencia-catalog`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. En **"Environment"**, añade las variables:
   - `DATABASE_URL` = (tu connection string de Neon)
   - `ADMIN_SESSION_SECRET` = (cualquier string aleatorio largo, ej: `openssl rand -base64 32`)
   - `NODE_ENV` = `production`
5. Click en **"Create Web Service"**.

### Paso 4: Inicializar la base de datos

Una vez que el despliegue esté corriendo (verás la URL `https://pura-esencia-catalog.onrender.com`):

1. En Render, ve a tu servicio y click en la pestaña **"Shell"**.
2. Ejecuta:
   ```bash
   bash scripts/init-db.sh
   ```
3. Verás la salida confirmando que se crearon 8 categorías y 23 productos.

> Alternativa: si el Shell no está disponible en tu plan, ejecuta localmente:
> ```bash
> DATABASE_URL="tu-neon-connection-string" bash scripts/init-db.sh
> ```

### Paso 5: Verificar el despliegue

1. Abre tu URL de Render: `https://pura-esencia-catalog.onrender.com`
2. Deberías ver:
   - Hero con el logo "Pura Esencia" en Dancing Script
   - Categorías: Jabones, Velas, Skincare, Aceites, Infusiones, Baños, Aromaterapia, Sets
   - Productos destacados en carousel
   - Productos con fotos, precios en USD, descripciones cálidas
3. Para acceder al admin: click en el icono de engranaje (lado derecho de la pantalla).
4. Contraseña por defecto: `admin123`

### Paso 6: Cambiar la contraseña del admin (¡importante!)

1. Entra al panel admin (icono de engranaje).
2. Ve a **"Ajustes"**.
3. Cambia la contraseña por una segura.
4. Guarda.

---

## 💻 Desarrollo local

### Requisitos

- Node.js 18.17+ (recomendado 20+)
- Una base de datos PostgreSQL (puedes usar Neon gratis, o Docker local)

### Setup

```bash
# 1. Clonar e instalar
git clone <tu-repo>.git
cd pura-esencia
npm install

# 2. Configurar .env
cp .env.example .env
# Edita .env y pon tu DATABASE_URL

# 3. Inicializar la base de datos
bash scripts/init-db.sh

# 4. Levantar el servidor de desarrollo
npm run dev
```

Abre http://localhost:3000

### Comandos útiles

```bash
npm run dev       # Desarrollo (hot reload)
npm run build     # Build de producción
npm start         # Servir build de producción
npm run lint      # Linting
npm run db:push   # Sincronizar schema Prisma con DB
npm run db:seed   # Poblar DB con datos de Pura Esencia
```

---

## 🎨 Identidad de marca

### Paleta cromática (de `globals.css`)

| Color | HEX | Uso |
|-------|-----|-----|
| Crema | `#FFFCF7` | Fondos |
| Crema Cálido | `#FFF8EC` | Fondos secundarios |
| **Rosa Vibrante** | `#FF5A8F` | Primario, CTAs, titulares |
| Verde Menta | `#4ECDC4` | Secundario, WhatsApp |
| Amarillo Limón | `#FFD93D` | Acentos, estrellas |
| Azul Turquesa | `#45B7D1` | Gota de agua |
| Púrpura Místico | `#9B59B6` | Estrellas decorativas |
| Marrón Tipográfico | `#3D2B1F` | Texto cuerpo |
| Rosa Suave | `#FFD4E1` | Bordes suaves, hover |
| Menta Suave | `#CFF2EF` | Bordes suaves |

### Tipografías (de Google Fonts)

- **Dancing Script** — Logo, titulares display (H1, H2)
- **Caveat** — Subtítulos, captions, notas manuscritas
- **Quicksand** — Cuerpo de texto, datos, UI
- **Cormorant Garamond Italic** — Citas, frases emotivas

### Regla 60-30-10

- **60%** Crema/blanco (fondos)
- **30%** Colores principales en proporciones equilibradas (rosa, menta, amarillo, turquesa)
- **10%** Acentos decorativos (púrpura, rojo, verde hoja)

---

## 🛠️ Estructura del proyecto

```
.
├── prisma/
│   ├── schema.prisma        # Schema PostgreSQL (Restaurant, Category, MenuItem)
│   └── seed.ts              # Catálogo inicial de Pura Esencia
├── public/
│   ├── logo.svg
│   └── robots.txt
├── scripts/
│   └── init-db.sh           # Inicializar DB en producción
├── src/
│   ├── app/
│   │   ├── api/             # API routes (menu, categories, items, admin, upload)
│   │   ├── globals.css      # Estilos + paleta Pura Esencia
│   │   ├── layout.tsx       # Fuentes Dancing/Caveat/Quicksand/Cormorant
│   │   └── page.tsx         # Página principal del catálogo
│   ├── components/
│   │   ├── admin/           # Panel admin (login, CRUD, settings)
│   │   ├── brand/           # Componentes de marca (logo, decorativos)
│   │   ├── menu/            # Componentes del catálogo (cards, nav, carousel)
│   │   └── ui/              # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts            # Prisma client
│   │   ├── menu-data.ts     # Datos estáticos de fallback
│   │   └── utils.ts         # Utilidades
│   └── middleware.ts        # Auth proxy para API mutation routes
├── .env.example
├── next.config.ts
├── package.json
├── render.yaml              # Blueprint para Render
└── tailwind.config.ts
```

---

## 🔒 Seguridad

- **Autenticación**: cookie HTTP-only con token de sesión (24h de expiración)
- **Contraseñas**: bcrypt con cost 10
- **Rate limiting**: 5 intentos de login fallidos → 15 min de bloqueo
- **Validación**: Zod en todas las mutaciones de API
- **Middleware**: protege todas las rutas `/api/*` con métodos POST/PUT/DELETE
- **Uploads**: validación de tipo MIME con `file-type`, tamaño máximo 2MB, conversión a WebP

---

## ❓ Preguntas frecuentes

### ¿La app se duerme en Render Free?

Sí. Tras 15 minutos sin tráfico, la app entra en sueño. El primer request tras dormir tarda ~30 segundos en responder (cold start). Si necesitas que esté siempre activa, considera el plan Starter ($7/mes).

### ¿Puedo usar SQLite en lugar de PostgreSQL?

No para Render. El filesystem de Render es efímero: cada deploy reinicia el disco, perdiendo cualquier SQLite. Por eso usamos PostgreSQL externo (Neon). Para desarrollo local sí puedes usar SQLite cambiando el `provider` en `prisma/schema.prisma`.

### ¿Cómo cambio los productos?

Desde el panel de admin (icono de engranaje en el lado derecho de la pantalla). Contraseña por defecto: `admin123` (cámbiala en Ajustes → contraseña).

### ¿Cómo añado mis propias fotos?

Desde el admin, al crear/editar un producto, puedes subir imágenes (JPG/PNG/WebP hasta 2MB). Se optimizan automáticamente a WebP para carga rápida.

### ¿Puedo usar otro host además de Render?

Sí. Esta app es un Next.js estándar y funciona en cualquier plataforma que soporte Node.js:
- **Vercel** (gratis, perfecto para Next.js)
- **Netlify** (gratis)
- **Railway** (free tier)
- **Fly.io** (free tier)

Solo asegúrate de configurar `DATABASE_URL` apuntando a tu PostgreSQL.

### ¿Cómo cambio el número de WhatsApp?

Desde el admin: **Ajustes** → **WhatsApp**. Incluye código de país (ej: `+573001234567` para Colombia).

---

## 📝 Licencia y créditos

Proyecto adaptado al brief de marca Pura Esencia (Edición Fundacional 2026).
Fotos de producto: Unsplash (reemplazar por fotos reales antes de producción).

> "Pura Esencia no es solo un emprendimiento: es la materialización de una forma de entender la vida. Crecer como negocio debe ser siempre una consecuencia de crecer como comunidad, no al revés."
