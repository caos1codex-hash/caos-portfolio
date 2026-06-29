# ⚡ CAOS Portfolio

> Portfolio de Miguel Antonio Chávez Villalba (CAOS) — Desarrollador Web Full Stack

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.185-black?logo=three.js)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple?logo=framer)

## 🌐 Demo

**Sitio en vivo:** [caos1codex-hash.github.io/caos-portfolio](https://caos1codex-hash.github.io/caos-portfolio)

## ✨ Características

- 🎬 **Pantalla de carga cinematográfica** — Animación del logo CAOS letra por letra
- 🌌 **Fondo 3D interactivo** — Partículas, nebulas y shaders con Three.js
- 🪙 **Moneda CAOS** — Moneda 3D flotante con reflejos, rotación y explosión al hacer clic
- ✍️ **Tipografía gigante** — Hero con texto masivo y gradiente shimmer
- 🔮 **Glassmorphism** — Tarjetas con efecto cristal y glow
- 🎯 **Cursor personalizado** — Cursor dual con trail y efectos hover
- 🧲 **Botones magnéticos** — Elementos que siguen el cursor
- 📊 **Proyectos desde GitHub** — Se obtienen automáticamente desde la API
- 🎨 **23+ tecnologías** — Grid interactivo con iconos y efectos 3D tilt
- 📈 **Skills animados** — Barras de progreso con count-up
- 🛣️ **Roadmap visual** — Timeline con estados (completado/en progreso/próximamente)
- 📬 **Formulario de contacto** — Con glassmorphism y animaciones
- 📱 **100% responsive** — Desktop, laptop, tablet, mobile
- ⚡ **Smooth scrolling** — Lenis para scroll suave
- 🎭 **Scroll reveal** — Animaciones al hacer scroll con Framer Motion

## 🛠️ Stack

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| UI | shadcn/ui |
| 3D | Three.js, React Three Fiber, Drei |
| Animaciones | Framer Motion, GSAP |
| Scroll | Lenis |
| Iconos | Lucide React |
| API | GitHub REST API |

## 🚀 Desarrollo Local

```bash
# Clonar
git clone https://github.com/caos1codex-hash/caos-portfolio.git
cd caos-portfolio

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev

# Abrir en navegador
# http://localhost:3000
```

## 📦 Despliegue en GitHub Pages

El proyecto incluye un workflow de GitHub Actions que despliega automáticamente:

1. Haz push a la rama `main`
2. GitHub Actions ejecuta el build con `NEXT_STATIC_EXPORT=true`
3. Se despliega automáticamente a GitHub Pages

### Despliegue manual

```bash
# Build estático
NEXT_STATIC_EXPORT=true bun run build

# Los archivos estáticos estarán en ./out
```

## 🔄 Actualización Automática de Proyectos

Los proyectos se obtienen automáticamente desde GitHub via API. Cada vez que agregues un nuevo repositorio público, aparecerá en el portafolio sin modificar el código.

## 📁 Estructura

```
src/
├── app/
│   ├── api/github/     # GitHub API route
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/
│   ├── three/          # 3D components
│   │   ├── Scene.tsx
│   │   ├── Particles.tsx
│   │   └── CaosCoin.tsx
│   ├── portfolio/      # Portfolio sections
│   │   ├── Navigation.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Technologies.tsx
│   │   ├── Skills.tsx
│   │   ├── Services.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Roadmap.tsx
│   │   ├── Achievements.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── effects/        # UI effects
│   │   ├── CustomCursor.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── ScrollProgress.tsx
│   │   └── SectionReveal.tsx
│   └── ui/             # shadcn/ui components
└── hooks/              # Custom hooks
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Negro | `#000000` | Fondo principal |
| Blanco | `#ffffff` | Texto principal |
| Azul Eléctrico | `#0066ff` | Acento principal |
| Morado | `#8b5cf6` | Acento secundario |
| Cyan | `#00ffff` | Acento terciario |
| Gris Oscuro | `#888888` | Texto secundario |

## 📄 Licencia

MIT © Miguel Antonio Chávez Villalba (CAOS)
