# Installation & Dependencies Guide

## 📦 Required Libraries

All dependencies are already installed in this project. This document explains what each library does and why it's needed.

## Core Dependencies

### React & TypeScript
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "typescript": "^5.0.0"
}
```
**Purpose:** Core framework for building the user interface  
**Used for:** Component structure, state management, type safety

### Recharts
```json
{
  "recharts": "2.15.2"
}
```
**Purpose:** Data visualization library  
**Used for:** 
- Scatter plots (population vs congestion)
- Line charts (predictions over time)
- Tooltips and legends
- Responsive charts

**Key Components Used:**
- `ScatterChart` - Main visualization for regression
- `LineChart` - Time series predictions
- `ComposedChart` - Combined visualizations
- `Tooltip` - Interactive data display

### Radix UI
```json
{
  "@radix-ui/react-select": "2.1.6",
  "@radix-ui/react-tabs": "1.1.3",
  "@radix-ui/react-label": "2.1.2",
  // ... other Radix components
}
```
**Purpose:** Accessible, unstyled UI components  
**Used for:**
- Dropdown menus (state/year selection)
- Tab navigation
- Cards and layouts
- Form controls

### Tailwind CSS
```json
{
  "tailwindcss": "4.1.12",
  "@tailwindcss/vite": "4.1.12"
}
```
**Purpose:** Utility-first CSS framework  
**Used for:** All styling, responsive design, color schemes

### Lucide React
```json
{
  "lucide-react": "0.487.0"
}
```
**Purpose:** Icon library  
**Used for:** UI icons (BarChart3, TrendingUp, Database, etc.)

## Development Dependencies

### Vite
```json
{
  "vite": "6.3.5",
  "@vitejs/plugin-react": "4.7.0"
}
```
**Purpose:** Build tool and dev server  
**Features:**
- Fast hot module replacement (HMR)
- Optimized production builds
- TypeScript support

## Optional Dependencies (Not Required)

These libraries are installed but not used in this traffic analysis app:

### Material UI
- `@mui/material`
- `@emotion/react`
- `@emotion/styled`

*Alternative to Radix UI, not used in this project*

### Motion (Framer Motion)
- `motion`

*For animations, not used in this project*

### React DnD
- `react-dnd`
- `react-dnd-html5-backend`

*For drag & drop, not used in this project*

## Installation Commands

### If Starting Fresh

```bash
# Install Node.js dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm (recommended)
pnpm install
```

### Install Individual Packages

```bash
# Recharts (for charts)
npm install recharts

# Radix UI Select (for dropdowns)
npm install @radix-ui/react-select

# Radix UI Tabs (for tab navigation)
npm install @radix-ui/react-tabs

# Lucide React (for icons)
npm install lucide-react

# Tailwind CSS (already configured)
npm install -D tailwindcss @tailwindcss/vite
```

## Library Documentation Links

### Essential Reading

1. **Recharts**
   - Docs: https://recharts.org/en-US/
   - Examples: https://recharts.org/en-US/examples
   - API: https://recharts.org/en-US/api

2. **Radix UI**
   - Docs: https://www.radix-ui.com/primitives
   - Select: https://www.radix-ui.com/primitives/docs/components/select
   - Tabs: https://www.radix-ui.com/primitives/docs/components/tabs

3. **Tailwind CSS**
   - Docs: https://tailwindcss.com/docs
   - v4 Migration: https://tailwindcss.com/docs/v4-beta

4. **Lucide Icons**
   - Search: https://lucide.dev/icons/
   - React Guide: https://lucide.dev/guide/packages/lucide-react

## File Size Information

### Bundle Size (Approximate)
```
Production Build (~2.5 MB total)
├── React + React DOM: ~140 KB
├── Recharts: ~500 KB
├── Radix UI: ~200 KB
├── Application Code: ~50 KB
└── Other libraries: ~1.6 MB
```

### Optimization Tips
```bash
# Production build (automatically optimized)
npm run build

# Analyze bundle size
npm install -D vite-plugin-visualizer
```

## Browser Compatibility

### Supported Browsers
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 12+, Android 8+

### Required Features
- ES6+ JavaScript
- CSS Grid & Flexbox
- SVG support
- LocalStorage (optional)

## System Requirements

### Development
- **Node.js:** 16.0.0 or higher
- **npm:** 7.0.0 or higher (or yarn 1.22+, pnpm 7+)
- **RAM:** 4 GB minimum, 8 GB recommended
- **Disk Space:** 500 MB for node_modules

### Production
- **Any static web server**
- **HTTPS recommended** (for production)
- **CDN support** (optional, for better performance)

## Package Scripts

```json
{
  "scripts": {
    "dev": "vite",              // Start development server
    "build": "vite build",       // Build for production
    "preview": "vite preview"    // Preview production build
  }
}
```

### Running Scripts

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Alternative Libraries

### If You Want to Replace Recharts

**Option 1: Chart.js + React-Chartjs-2**
```bash
npm install chart.js react-chartjs-2
```
- More lightweight
- Simpler API
- Less React-specific features

**Option 2: Victory Charts**
```bash
npm install victory
```
- More animation options
- Different styling approach
- Larger bundle size

**Option 3: Nivo**
```bash
npm install @nivo/core @nivo/line @nivo/scatterplot
```
- Beautiful defaults
- Great animations
- Larger bundle size

### If You Want to Replace Radix UI

**Option 1: Headless UI**
```bash
npm install @headlessui/react
```
- Simpler API
- Fewer components
- Tailwind-focused

**Option 2: React Aria**
```bash
npm install react-aria
```
- Adobe-maintained
- Excellent accessibility
- More complex API

## Troubleshooting

### Common Issues

**Issue: "Cannot find module 'recharts'"**
```bash
# Solution
npm install recharts
```

**Issue: "Module not found: @radix-ui/react-select"**
```bash
# Solution
npm install @radix-ui/react-select
```

**Issue: TypeScript errors**
```bash
# Install type definitions
npm install -D @types/react @types/react-dom
```

**Issue: Vite build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Performance Issues

**Slow Development Server**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

**Large Bundle Size**
```bash
# Enable compression
npm install -D vite-plugin-compression

# Add to vite.config.ts
import compression from 'vite-plugin-compression';
plugins: [react(), compression()]
```

## Version Compatibility

### Tested Versions
```
✅ Node.js 18.x
✅ Node.js 20.x
✅ Node.js 22.x
⚠️ Node.js 16.x (minimum)
❌ Node.js 14.x (not supported)
```

### React Versions
```
✅ React 18.3.x (current)
✅ React 18.2.x
⚠️ React 17.x (untested)
❌ React 16.x (not supported)
```

## License Information

### Open Source Libraries

- **React:** MIT License
- **Recharts:** MIT License
- **Radix UI:** MIT License
- **Tailwind CSS:** MIT License
- **Lucide:** ISC License

### Your Code
This application code is provided as a demonstration.  
You can freely use, modify, and distribute it.

## Getting Help

### If Dependencies Won't Install

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 16.0.0 or higher
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Delete and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Try different package manager:**
   ```bash
   # Try pnpm
   npm install -g pnpm
   pnpm install
   
   # Or try yarn
   npm install -g yarn
   yarn install
   ```

### If Charts Don't Display

1. Check browser console for errors
2. Verify recharts is installed: `npm list recharts`
3. Clear browser cache
4. Try different browser

### If Build Fails

1. Check for TypeScript errors: `npx tsc --noEmit`
2. Verify all imports are correct
3. Check vite.config.ts configuration
4. Review error messages carefully

## Additional Resources

### Package Managers
- npm: https://www.npmjs.com/
- yarn: https://yarnpkg.com/
- pnpm: https://pnpm.io/

### Build Tools
- Vite: https://vitejs.dev/
- Webpack (alternative): https://webpack.js.org/

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/handbook/
- React with TS: https://react-typescript-cheatsheet.netlify.app/

---

**All dependencies are already installed and configured!**  
You can start using the application immediately.

For issues, check the Troubleshooting section above.
