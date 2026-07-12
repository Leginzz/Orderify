# Orderify 🍔

Plataforma SaaS multi-tenant para gestión de pedidos de restaurantes.

## 🚀 Características

- **Multi-tenant**: Múltiples restaurantes en una sola plataforma
- **Menú digital**: Gestión completa de productos y categorías
- **Pedidos en tiempo real**: Seguimiento de estados de pedidos
- **Pagos integrados**: Stripe para procesamiento de pagos
- **Dashboard administrativo**: Panel para dueños de restaurantes
- **Super Admin**: Panel para gestionar todos los restaurantes
- **Branding personalizado**: Colores y logo por restaurante

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Estilos**: Tailwind CSS v4, shadcn/ui
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe (pendiente de implementar)
- **Deploy**: GitHub Pages (frontend) + Supabase (backend)

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en GitHub

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Leginzz/Orderify.git
cd Orderify
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Configurar base de datos en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com/)
2. Crea un nuevo proyecto
3. Ve al SQL Editor
4. Ejecuta el archivo `supabase-schema.sql`

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
orderify/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Páginas públicas (clientes)
│   ├── (admin)/                  # Dashboard de restaurantes
│   ├── (super-admin)/            # Panel de administración
│   ├── auth/                     # Autenticación
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Componentes shadcn/ui
│   ├── restaurant/               # Componentes de restaurantes
│   ├── admin/                    # Componentes de admin
│   └── super-admin/              # Componentes de super admin
├── hooks/                        # Custom React hooks
├── lib/
│   └── supabase/                 # Configuración de Supabase
├── types/                        # TypeScript types
└── supabase-schema.sql           # Schema de la base de datos
```

## 🔐 Autenticación

El sistema soporta tres roles de usuario:

- **customer**: Clientes que hacen pedidos
- **restaurant_owner**: Dueños de restaurantes
- **super_admin**: Administrador de la plataforma

## 🎨 Componentes UI

Usamos [shadcn/ui](https://ui.shadcn.com/) para los componentes de la interfaz.

Para agregar nuevos componentes:

```bash
npx shadcn@latest add [componente]
```

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Linting
npm run lint         # Ejecutar ESLint
```

## 🚀 Deploy a GitHub Pages

### 1. Configurar Next.js para exportación estática

Edita `next.config.js`:

```js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

### 2. Build y deploy

```bash
npm run build
npx gh-pages -d out
```

### 3. Configurar GitHub Pages

Ve a Settings → Pages en tu repositorio y selecciona la rama `gh-pages`.

## 🗄️ Base de Datos

El schema incluye las siguientes tablas principales:

- `restaurants`: Información de los restaurantes
- `menu_items`: Productos del menú
- `orders`: Pedidos de clientes
- `order_items`: Items de cada pedido
- `user_profiles`: Perfiles de usuarios
- `reviews`: Reseñas de clientes

Todas las tablas tienen **Row Level Security (RLS)** activado para garantizar el aislamiento multi-tenant.

## 🔒 Seguridad

- **Row Level Security (RLS)**: Cada restaurante solo ve sus datos
- **Supabase Auth**: Autenticación segura con JWT
- **Variables de entorno**: Credenciales nunca se exponen en el cliente

## 📝 Licencia

MIT

## 👥 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Para dudas o problemas, abre un issue en GitHub.

---

Hecho con ❤️ para restaurantes de todo el mundo