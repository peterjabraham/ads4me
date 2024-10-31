# Detailed Setup Guide

## Firebase Setup
1. Create a new Firebase project
2. Enable Authentication
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add authorized domains
3. Create Firestore Database
   - Choose production mode
   - Select region
   - Set up initial security rules

### Firebase Admin SDK Setup
1. Generate new private key
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as `firebase-admin-key.json`

## Environment Configuration

### Required Environment Variables
```env
# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key