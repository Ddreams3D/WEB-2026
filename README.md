# Ddreams 3D - Next.js

Un proyecto moderno de mapas conceptuales desarrollado con Next.js 15, utilizando App Router y las mejores prácticas de desarrollo.

## Tecnologías Utilizadas

- **Next.js 16** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Framer Motion** - Animaciones fluidas
- **Firebase** - Base de datos y autenticación
- **Lucide React** - Iconos modernos

## Instalación y Desarrollo

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter de código
- `npm run test` - Ejecutar pruebas

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página de inicio
│   └── [rutas]/        # Páginas de la aplicación
├── components/         # Componentes reutilizables
├── shared/            # Estilos y utilidades compartidas
├── hooks/             # Custom hooks
└── utils/             # Funciones utilitarias
```

## Características

- ✅ **App Router** de Next.js 15
- ✅ **TypeScript** con tipado estricto
- ✅ **Tailwind CSS** con configuración personalizada
- ✅ **Framer Motion** para animaciones
- ✅ **Responsive Design** optimizado
- ✅ **SEO optimizado** con metadata
- ✅ **Testing** con Jest y Testing Library
- ✅ **Linting** con ESLint
- ✅ **Optimización** de rendimiento

## Despliegue

El proyecto está configurado para desplegarse en Netlify.

```bash
npm run build
```
