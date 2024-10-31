This document covers major known issues and provides workarounds where applicable. 
Known issues from the following set up:

Tech Stack:
Next.js 14.1.0
React 18.2.0
React DOM 18.2.0
TypeScript 5.3.3
NextAuth 5.0.0-beta.3
Firebase Admin 12.0.0
OpenAI API ^4.0.0
Tailwind CSS 3.4.1
Node.js 18.x

UI Components & Utilities
Radix UI Components:
@radix-ui/react-slot ^1.0.2
@radix-ui/react-toast ^1.1.5
class-variance-authority ^0.7.0
lucide-react ^0.309.0
clsx ^2.1.0
tailwind-merge ^2.2.0

Development Dependencies:
@types/node 20.11.0
@types/react 18.2.47
@types/react-dom 18.2.18
autoprefixer 10.4.16
postcss 8.4.33

# Known Issues and Limitations

## Next.js 14.1.0 & React 18.2.0
1. **Server Components Hydration**
   - Issue: Hydration mismatch errors when mixing server and client components
   - Workaround: Use 'use client' directive consistently and verify component boundaries
   ```typescript
   // Always mark client components explicitly
   'use client';

App Router Limitations:
- Dynamic route segments with special characters may cause routing issues
- Some middleware features are not fully compatible with the new app directory

NextAuth 5.0.0-beta.3

Beta Version Stability:
- Known memory leaks in development mode
- Session handling may be inconsistent with certain provider configurations
- Workaround: Consider using stable 4.x version for production

Google OAuth Integration:
// Potential timeout issues with callback
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Add timeout configuration
  httpOptions: { timeout: 10000 }
})

Firebase Admin 12.0.0:
Connection Pooling
- Memory leaks possible in development with hot reload
- Workaround: Initialize Firebase Admin only once:
let adminApp;
if (!getApps().length) {
  adminApp = initializeApp();
}

Type Definitions:
- Some TypeScript types may be missing or incorrect
- Custom type declarations might be needed

OpenAI API Integration:
Rate Limiting

- Default rate limits may cause request failures
- Implement proper error handling:
try {
  const response = await openai.createCompletion({
    // config
  });
} catch (error) {
  if (error.status === 429) {
    // Handle rate limit
  }
}

Token Usage:
- Large requests may exceed token limits unexpectedly
- Implement token counting and splitting logic

Radix UI Components:
React 18 Compatibility
- Some animations may break in strict mode
- Portal rendering issues in development

Toast Component:
- Z-index conflicts with other modals
- Multiple toasts may stack incorrectly
// Ensure proper viewport configuration
<ToastViewport className="z-[100]" />

TypeScript Integration:
Version Conflicts
- Type mismatches between @types packages
- Add resolution in package.json:
{
  "resolutions": {
    "@types/react": "18.2.47"
  }
}

Next.js Types:
- Some app router types may be incomplete
- Custom type augmentation might be needed

Tailwind CSS
Build Performance
- Large CSS bundle in development
- JIT compilation can be slow with many components
- Workaround: Use content configuration:
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}

Class Name Conflicts:
- Potential conflicts with Radix UI default styles
- Use specific prefixes for custom utilities

Development Environment:
Node.js Version
- Requires Node.js 18.x
- Some dependencies may have warnings with Node.js 19+
{
  "engines": {
    "node": ">=18.0.0 <19.0.0"
  }
}

Package Manager Conflicts:
- Peer dependency warnings with npm
- Recommendation: Use yarn or pnpm for better dependency resolution

Performance Issues:
Bundle Size
- Large initial JS bundle
- Implement dynamic imports:
const DynamicComponent = dynamic(() => import('./Component'))

Memory Usage:
- Development server may consume high memory
- Regular next build cache clearing recommended

Monitoring & Debug Points:
- Install React Developer Tools
- Use Chrome Performance tab for bundle analysis
- Monitor Firebase Console for backend issues
- Track OpenAI API usage carefully

Recommended VSCode Extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript + JavaScript


## Recent Firebase Admin SDK Issues
### Firebase Admin Initialization Pattern
Problem: Initial implementation had issues with Promise-based initialization:
```typescript
// Problematic Pattern
const { db } = getFirebaseAdmin(); // Type error: Property 'db' doesn't exist on Promise

Solution: Use singleton pattern with pre-initialized instance:

// Correct Pattern
import { adminDb } from '@/lib/firebase-admin';
const userRef = adminDb.collection('users').doc(userId);

## Best Practices Learned
Always use pre-initialized adminDb instance
Avoid repeated initialization in API routes
Proper error handling in Firebase operations
Session validation before database operations

## Current Limitations
Firebase Admin SDK must be initialized server-side only
Care needed with environment variables for Firebase private key
Batch operations recommended for bulk deletions