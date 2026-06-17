# Troubleshooting Guide

## 🔍 Common Issues and Solutions

This guide helps you resolve common issues you might encounter while using the Traffic Congestion Analysis application.

---

## 📊 Chart Not Displaying

### Symptom
- Blank space where chart should be
- Only axes visible, no data points
- Chart area is completely empty

### Solutions

**1. Check Browser Console**
```javascript
// Open browser console (F12 or Ctrl+Shift+I)
// Look for error messages
```

**2. Verify Data Loading**
```typescript
// Check if data is loading correctly
// In App.tsx, add console.log
console.log('State Data:', stateData);
console.log('Regression:', regression);
```

**3. Check Recharts Installation**
```bash
npm list recharts
# Should show: recharts@2.15.2

# If not installed:
npm install recharts
```

**4. Clear Browser Cache**
- Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Or clear cache in browser settings

**5. Try Different Browser**
- Test in Chrome, Firefox, or Edge
- Ensure browser is up to date

---

## 🎨 Styling Issues

### Symptom
- Components look unstyled
- Layout is broken
- Colors are wrong

### Solutions

**1. Verify Tailwind CSS**
```bash
# Check if Tailwind is installed
npm list tailwindcss

# Reinstall if needed
npm install -D tailwindcss @tailwindcss/vite
```

**2. Check CSS Files**
Ensure these files exist:
- `/src/styles/tailwind.css`
- `/src/styles/index.css`
- `/src/styles/theme.css`

**3. Clear Build Cache**
```bash
# Remove build artifacts
rm -rf dist
rm -rf node_modules/.vite

# Rebuild
npm run dev
```

**4. Check Import Statements**
Verify in App.tsx:
```typescript
import './styles/index.css';
```

---

## 🔢 Incorrect Calculations

### Symptom
- R² value seems wrong
- Predictions don't make sense
- Regression line doesn't fit data

### Solutions

**1. Verify Data Integrity**
```typescript
// Check for data errors in trafficData.ts
// Ensure all values are numbers, not strings
populationDensity: 259,  // ✅ Good
populationDensity: "259", // ❌ Bad
```

**2. Check for NaN Values**
```typescript
// Add validation
if (isNaN(regression.slope)) {
  console.error('Invalid slope calculation');
}
```

**3. Review Regression Logic**
```typescript
// In regression.ts, verify:
// - Arrays are same length
// - No division by zero
// - Denominator is not zero
```

**4. Test with Known Data**
```typescript
// Test with simple data
const testX = [1, 2, 3, 4, 5];
const testY = [2, 4, 6, 8, 10];
// Expected: slope = 2, intercept = 0, R² = 1
```

---

## 📱 Responsive Design Issues

### Symptom
- Layout breaks on mobile
- Text overflows containers
- Charts too small/large

### Solutions

**1. Check Viewport Meta Tag**
Ensure in HTML:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**2. Test Responsive Breakpoints**
```typescript
// In components, use Tailwind responsive classes
className="w-full md:w-1/2 lg:w-1/3"
```

**3. Adjust Chart ResponsiveContainer**
```typescript
<ResponsiveContainer width="100%" height={400}>
  {/* Chart content */}
</ResponsiveContainer>
```

**4. Test on Actual Devices**
- Use browser dev tools (F12 → Toggle device toolbar)
- Test on real mobile devices
- Check various screen sizes

---

## 🐌 Performance Issues

### Symptom
- Slow loading
- Laggy interactions
- High memory usage

### Solutions

**1. Check useMemo Usage**
```typescript
// Ensure expensive calculations use useMemo
const regression = useMemo(() => {
  return calculateLinearRegression(densities, congestions);
}, [stateData]); // Only recalculate when stateData changes
```

**2. Reduce Re-renders**
```typescript
// Use React DevTools Profiler
// Identify components that re-render unnecessarily
```

**3. Optimize Dataset Size**
```typescript
// If adding more data, consider pagination
// Or virtualization for large datasets
```

**4. Check Bundle Size**
```bash
npm run build
# Check dist/ folder size
# Should be < 3 MB
```

**5. Use Production Build**
```bash
# Development mode is slower
npm run build
npm run preview  # Test production build
```

---

## 🔄 State Not Updating

### Symptom
- Selecting state/year doesn't update display
- Charts don't refresh
- Data seems stale

### Solutions

**1. Verify useState**
```typescript
const [selectedState, setSelectedState] = useState<string>('California');

// Check if setState is called
const handleStateChange = (value: string) => {
  console.log('State changed to:', value);
  setSelectedState(value);
};
```

**2. Check useMemo Dependencies**
```typescript
// Ensure dependencies are correct
const stateData = useMemo(() => {
  return getDataByState(selectedState);
}, [selectedState]); // Must include selectedState
```

**3. Verify Select Component**
```typescript
<Select value={selectedState} onValueChange={setSelectedState}>
  {/* Ensure value and onValueChange are connected */}
</Select>
```

**4. Check for Stale Closures**
```typescript
// Use functional updates if needed
setSelectedYear(prev => prev + 1);
```

---

## 📦 Installation Errors

### Symptom
- npm install fails
- Dependency conflicts
- Module not found errors

### Solutions

**1. Check Node.js Version**
```bash
node --version
# Should be 16.0.0 or higher

# Update if needed
# Download from nodejs.org
```

**2. Clear npm Cache**
```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

**3. Use Correct Package Manager**
```bash
# If project uses pnpm
npm install -g pnpm
pnpm install

# If project uses yarn
npm install -g yarn
yarn install
```

**4. Check for Peer Dependency Issues**
```bash
npm install --legacy-peer-deps
```

**5. Install Missing Dependencies**
```bash
# Check what's missing
npm list

# Install specific packages
npm install recharts
npm install @radix-ui/react-select
```

---

## 🖥️ TypeScript Errors

### Symptom
- Red squiggly lines in editor
- Type errors in console
- Build fails with type errors

### Solutions

**1. Install Type Definitions**
```bash
npm install -D @types/react @types/react-dom
```

**2. Check Type Imports**
```typescript
// Ensure interfaces are imported
import { StateData } from './data/trafficData';
import { RegressionResult } from './utils/regression';
```

**3. Verify Type Annotations**
```typescript
// Add explicit types where needed
const [selectedYear, setSelectedYear] = useState<number>(2024);
```

**4. Check for Type Mismatches**
```typescript
// Ensure types match
populationDensity: number; // Not string
year: number; // Not string
```

**5. Use Type Assertions When Necessary**
```typescript
const value = someValue as number;
// Only use when you're certain of the type
```

---

## 🌐 Browser Compatibility

### Symptom
- Works in Chrome but not Firefox
- Features missing in Safari
- Errors in older browsers

### Solutions

**1. Check Browser Version**
- Update to latest version
- Minimum: Chrome 90+, Firefox 88+, Safari 14+

**2. Enable JavaScript**
- Ensure JavaScript is enabled in browser settings

**3. Check for Console Errors**
- Open browser console (F12)
- Look for compatibility warnings

**4. Test in Multiple Browsers**
```bash
# Use BrowserStack or similar for testing
# Or install multiple browsers locally
```

**5. Add Polyfills if Needed**
```bash
npm install core-js
```

---

## 📊 Data Import Issues

### Symptom
- "Cannot find module" error
- Data not loading
- Import paths broken

### Solutions

**1. Check Import Paths**
```typescript
// Ensure paths are relative to file location
import { trafficData } from '../data/trafficData'; // ✅
import { trafficData } from 'data/trafficData';    // ❌
```

**2. Verify File Extensions**
```typescript
// Include .ts extension in imports
import { calculateLinearRegression } from './utils/regression';
```

**3. Check Case Sensitivity**
```typescript
// File names are case-sensitive on some systems
import { DataSources } from './components/DataSources'; // ✅
import { DataSources } from './components/datasources'; // ❌
```

**4. Verify Exports**
```typescript
// In trafficData.ts
export const trafficData = [...]; // ✅
const trafficData = [...];        // ❌ (missing export)
```

---

## 🎯 Prediction Errors

### Symptom
- Predictions are NaN
- Predictions are negative
- Predictions are unrealistic

### Solutions

**1. Check Historical Data**
```typescript
// Ensure at least 2 data points
if (historicalData.length < 2) {
  console.error('Insufficient data for predictions');
}
```

**2. Verify Regression Model**
```typescript
// Check if regression is valid
if (regression.rSquared < 0 || isNaN(regression.rSquared)) {
  console.error('Invalid regression model');
}
```

**3. Validate Predictions**
```typescript
predictions.forEach(pred => {
  if (pred.predictedCongestion < 0) {
    console.warn('Negative prediction detected');
  }
});
```

**4. Handle Edge Cases**
```typescript
// Add bounds checking
const predictedValue = Math.max(0, prediction); // No negative values
```

---

## 🔐 Security Warnings

### Symptom
- Console warnings about security
- HTTPS mixed content errors
- CSP violations

### Solutions

**1. Use HTTPS in Production**
```bash
# Deploy to platforms that provide HTTPS
# Vercel, Netlify, GitHub Pages all provide free HTTPS
```

**2. Check External Links**
```typescript
// Always use rel="noopener noreferrer" for external links
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
```

**3. Validate Input**
```typescript
// Sanitize user input if adding custom data entry
const sanitize = (input: string) => {
  return input.replace(/[<>]/g, '');
};
```

---

## 💾 Build Errors

### Symptom
- npm run build fails
- Production build has errors
- Deployment fails

### Solutions

**1. Check for TypeScript Errors**
```bash
npx tsc --noEmit
# Fix all type errors before building
```

**2. Clear Build Cache**
```bash
rm -rf dist
rm -rf node_modules/.vite
npm run build
```

**3. Check for Missing Dependencies**
```bash
# Ensure all imports have corresponding packages
npm install
```

**4. Verify Environment**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

**5. Review Build Output**
```bash
npm run build
# Read error messages carefully
# Check which file is causing the issue
```

---

## 🎨 Chart Rendering Issues

### Symptom
- Chart appears but is distorted
- Axes are cut off
- Labels overlap

### Solutions

**1. Adjust Chart Margins**
```typescript
<ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
```

**2. Set Fixed Height**
```typescript
<ResponsiveContainer width="100%" height={400}>
  {/* Increase if content is cut off */}
</ResponsiveContainer>
```

**3. Adjust Label Positions**
```typescript
<XAxis
  label={{ value: 'Label', position: 'bottom', offset: 10 }}
/>
```

**4. Check Data Range**
```typescript
// Ensure data values are reasonable
const maxValue = Math.max(...data);
const minValue = Math.min(...data);
console.log('Data range:', minValue, '-', maxValue);
```

---

## 🔧 Development Server Issues

### Symptom
- npm run dev doesn't start
- Port already in use
- Hot reload not working

### Solutions

**1. Check Port Availability**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

**2. Restart Development Server**
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

**3. Check Firewall**
- Ensure firewall allows Node.js
- Allow port 5173 (or your chosen port)

**4. Check for Syntax Errors**
```bash
# Vite will show syntax errors in console
# Fix errors in indicated files
```

---

## 📱 Mobile-Specific Issues

### Symptom
- Touch events don't work
- Dropdowns won't open
- Charts not interactive on mobile

### Solutions

**1. Test with Real Device**
- Emulators may not perfectly replicate mobile behavior
- Test on actual iPhone/Android device

**2. Check Touch Events**
```typescript
// Ensure components support touch
// Radix UI components should work out of the box
```

**3. Adjust for Mobile Viewport**
```typescript
// Use mobile-friendly sizes
<ResponsiveContainer width="100%" height={300}> {/* Shorter on mobile */}
```

**4. Test Dropdown Behavior**
```typescript
// Ensure Select component works on mobile
// May need different positioning on small screens
```

---

## 🆘 Still Having Issues?

### Diagnostic Checklist

Run through this checklist:

```bash
# 1. Check Node.js version
node --version  # Should be 16+

# 2. Check for errors
npm run dev
# Read console output carefully

# 3. Check browser console
# Open DevTools (F12)
# Look for red error messages

# 4. Verify file structure
ls -R src/
# Ensure all files exist

# 5. Test with clean install
rm -rf node_modules package-lock.json
npm install
npm run dev

# 6. Check for uncommitted changes
git status
# Ensure no conflicts

# 7. Try production build
npm run build
npm run preview
```

### Getting More Help

If none of these solutions work:

1. **Document the Issue**
   - What exactly happens?
   - What did you expect?
   - When did it start?
   - What have you tried?

2. **Check Browser Console**
   - Take screenshot of errors
   - Note error messages

3. **Verify Environment**
   - OS and version
   - Node.js version
   - Browser and version
   - Package manager (npm/yarn/pnpm)

4. **Review Recent Changes**
   - What was the last thing you changed?
   - Can you revert and test?

5. **Test in Isolation**
   - Does issue occur in fresh browser window?
   - Does it occur in incognito/private mode?
   - Does it occur on different computer?

---

## 🔍 Debugging Tips

### Enable Debug Mode

```typescript
// Add to App.tsx
const DEBUG = true;

if (DEBUG) {
  console.log('Selected State:', selectedState);
  console.log('State Data:', stateData);
  console.log('Regression:', regression);
  console.log('Predictions:', predictions);
}
```

### Use React DevTools

1. Install React DevTools browser extension
2. Open DevTools (F12) → React tab
3. Inspect component props and state
4. Use Profiler to identify performance issues

### Check Network Tab

1. Open DevTools → Network tab
2. Reload page
3. Check for failed requests (red)
4. Verify all assets load

### Use Debugger

```typescript
// Add breakpoints in code
debugger; // Execution will pause here

// Or use console.log strategically
console.log('Checkpoint 1', variable);
```

---

**Most issues can be resolved by:**
1. ✅ Clearing cache and rebuilding
2. ✅ Checking console for errors
3. ✅ Verifying Node.js and dependency versions
4. ✅ Testing in different browser
5. ✅ Following solutions in this guide

---

*For additional help, refer to:*
- README.md - General documentation
- INSTALLATION.md - Setup instructions
- ARCHITECTURE.md - Technical details
