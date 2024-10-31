# Architecture Documentation

## System Overview
```mermaid
graph TD
    A[Client/Next.js Frontend] --> B[Next.js API Routes]
    B --> C[OpenAI API]
    B --> D[Firebase Admin SDK]
    D --> E[Firestore Database]
    A --> F[NextAuth.js]
    F --> G[Google OAuth]

Core Components:
    Frontend Layer
    Next.js 14 App Router for routing and SSR
    React Components using TypeScript
    Tailwind CSS for styling
    NextAuth.js for authentication
Firebase Admin Layer
Typescript:
// Single Instance Pattern
import { adminDb } from '@/lib/firebase-admin';
// Usage in API routes
const userRef = adminDb.collection('users').doc(userId);

Authentication Layer
Typescript:
// NextAuth with Google Provider
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
// Protected API Route Pattern
const session = await getServerSession(req, res, authOptions);
if (!session?.user?.id) {
  return res.status(401).json({ message: 'Unauthorized' });
}

    
API Layer:
    Next.js API Routes
    OpenAI API Integration
    Firebase Admin SDK
    Rate Limiting Middleware
    
Data Layer:
    Firestore for data persistence
    Client-side caching
    Server-side caching

Firestore Collections Structure:
users/
    {userId}/
        liked_headlines/
            {headlineId}/

    
Key Design Patterns:
    
1. Server Components
    // app/page.tsx
    async function HomePage() {
      const ads = await getAds();
      return <AdList ads={ads} />;
    }

2. Client Components:
    'use client';
    // components/LikeButton.tsx
    export function LikeButton({ adId }) {
      const [isLiked, setIsLiked] = useState(false);
      // Implementation
    }

3. API Routes:
    // api/generate-ads.ts
    export default async function handler(req, res) {
      // Implementation
    }

Data Flow:
    User Authentication Flow
    Ad Generation Flow
    Data Persistence Flow
    Caching Strategy

Performance Optimizations:
    React Server Components
    Dynamic Imports
    Image Optimization
    API Route Caching