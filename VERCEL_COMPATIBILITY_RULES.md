# Vercel Deployment Compatibility Rules
*Created: 2025-09-27*
*Last Updated: 2025-09-27*

## 🚨 CRITICAL RULES - NEVER VIOLATE

### 1. Next.js Version Compatibility
- ✅ **Use:** Next.js 15.x with React 19.x (stable versions only)
- ❌ **Avoid:** Experimental flags like `--turbopack` in production builds
- ❌ **Avoid:** Beta/canary versions in production

### 2. Node.js Runtime Constraints
```json
// package.json - REQUIRED
"engines": {
  "node": ">=18.0.0 <23.0.0"
}
```

```json
// vercel.json - REQUIRED
{
  "functions": {
    "**": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 3. TypeScript Compatibility (Next.js 15)
```typescript
// ✅ CORRECT: Async params pattern
interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  // ...
}

// ❌ WRONG: Old sync params pattern
interface PageProps {
  params: { slug: string }
}
```

### 4. Build Script Rules
```json
// package.json scripts - REQUIRED format
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

## 📦 DEPENDENCY MANAGEMENT

### 5. Core Dependencies (Approved List)
```json
{
  "dependencies": {
    "next": "15.5.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "typescript": "^5",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/node": "^20"
  }
}
```

### 6. Safe Additional Dependencies
- ✅ `lucide-react` (icons)
- ✅ `gray-matter` (markdown frontmatter)
- ✅ `tailwindcss` (CSS framework)
- ✅ `@next/mdx` (MDX support)
- ✅ `next-mdx-remote` (remote MDX)

### 7. Dangerous Dependencies (Avoid)
- ❌ Experimental CSS-in-JS libraries
- ❌ Webpack plugins (use Next.js built-ins)
- ❌ Custom Babel configurations
- ❌ Experimental state management libraries

## 🏗️ PROJECT STRUCTURE RULES

### 8. Directory Structure (Enforced)
```
frontend/
├── src/
│   ├── app/                    # App Router (REQUIRED)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── blog/
│   │   │   ├── page.tsx       # Blog list
│   │   │   └── [slug]/page.tsx # Blog detail
│   │   └── calculator/page.tsx # Calculator
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities
│   └── styles/               # Global styles
├── public/                   # Static assets
├── content/                  # MDX content (root level)
└── package.json
```

### 9. Configuration Files (Required)
- ✅ `next.config.ts` (TypeScript config, not .js)
- ✅ `tsconfig.json` (strict TypeScript)
- ✅ `tailwind.config.ts` (if using Tailwind)
- ✅ `eslint.config.mjs` (flat config format)

## 🔧 ESLINT RULES

### 10. ESLint Configuration (Vercel-Safe)
```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "react/no-unescaped-entities": "error"
    },
  },
];

export default eslintConfig;
```

### 11. Code Quality Rules
- ✅ No unused variables (will break build)
- ✅ No `any` types (will break build)
- ✅ Escape all HTML entities (`&apos;` not `'`)
- ✅ All imports must resolve

## 🚀 DEPLOYMENT RULES

### 12. Vercel Configuration
```json
// vercel.json - MINIMAL and SAFE
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "**": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 13. Environment Variables
```bash
# .env.local (local development)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Vercel Dashboard (production)
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 14. Git Workflow
```bash
# ALWAYS test locally before pushing
npm run build  # Must succeed
npm run lint   # Must have 0 errors
npm run start  # Must start without errors

# Only then push to main
git add .
git commit -m "Description"
git push origin main
```

## 🧪 TESTING CHECKLIST

### 15. Pre-Deployment Testing (MANDATORY)
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` shows 0 errors
- [ ] `npm run start` serves the application
- [ ] All pages load in production build
- [ ] No console errors in browser
- [ ] Static generation works for all blog posts

### 16. Post-Deployment Verification
- [ ] Vercel build completes successfully
- [ ] All routes are accessible
- [ ] Static assets load correctly
- [ ] No runtime errors in Vercel logs

## 🔍 DEBUGGING RULES

### 17. When Builds Fail
1. **First:** Check Node.js version compatibility
2. **Second:** Verify ESLint has 0 errors locally
3. **Third:** Ensure no experimental features are enabled
4. **Fourth:** Check TypeScript compilation
5. **Last Resort:** Nuclear rebuild with this rulebook

### 18. Common Vercel Issues & Solutions
- **"Command failed"** → Check build script in package.json
- **"Module not found"** → Verify all imports and dependencies
- **"Type error"** → Fix TypeScript errors locally first
- **"ESLint error"** → Run `npm run lint` and fix all issues

## 📋 EMERGENCY REBUILD CHECKLIST

### 19. Nuclear Rebuild Protocol
```bash
# 1. Backup content
mkdir ../backup
cp -r content ../backup/
cp -r public ../backup/

# 2. Fresh install
rm -rf frontend
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir

# 3. Apply this rulebook
# 4. Restore content
# 5. Test locally
# 6. Deploy
```

## 🎯 SUCCESS METRICS

### 20. Deployment Success Indicators
- ✅ Vercel build time < 3 minutes
- ✅ Zero build warnings
- ✅ All static pages generated successfully
- ✅ Lighthouse score > 90
- ✅ No runtime errors in first 24 hours

---

## 🔒 FINAL RULE: When in Doubt, Simplify

**If any feature causes deployment issues:**
1. Can it be simplified? → Simplify it
2. Can it be removed temporarily? → Remove it
3. Is it experimental? → Replace with stable alternative
4. Does it violate this rulebook? → Fix or remove

**Remember: A working simple site > A broken complex site**

---

*This rulebook is living documentation. Update it whenever you encounter new compatibility issues or solutions.*