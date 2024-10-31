# Ads-4-Me: AI-Powered Ad Generation Platform

# Next.js AI Application
## Overview
A Next.js application using Firebase Admin SDK for data storage, NextAuth for authentication, and OpenAI API integration.
## Key Features
- Google Authentication
- Firebase Admin SDK Integration
- Protected API Routes
- Headline Management System
## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see SETUP.md)
4. Run development server: `npm run dev`
## Architecture
See [ARCHITECTURE.md](./instructions/ARCHITECTURE.md) for detailed system design.
## Deployment
See [DEPLOYMENT.md](./instructions/DEPLOYMENT.md) for deployment instructions.
## Known Issues
See [KNOWN ISSUES.md](./instructions/KNOWN ISSUES.md) for current limitations and workarounds.

## Features Overview
- 🤖 AI-Powered Ad Generation using OpenAI GPT
- 🔐 Secure Authentication via Google Auth
- 💾 Firebase Integration for Data Storage
- ❤️ Ad Headline Favoriting System
- 📊 Performance Analytics
- 🎯 Custom Ad Targeting Options

## Project Structure
├── src/
│ ├── app/ # Next.js 14 App Router
│ ├── components/ # Reusable UI Components
│ ├── lib/ # Utility Functions
│ ├── types/ # TypeScript Definitions
│ └── utils/ # Helper Functions
├── public/ # Static Assets
└── instructions/ # Documentation


## Quick Start Guide
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Configure environment variables
5. Run development server: `npm run dev`

## Tech Stack
- Next.js 14.1.0
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.3.3
- NextAuth 5.0.0-beta.3
- Firebase Admin 12.0.0
- OpenAI API ^4.0.0
- Tailwind CSS 3.4.1
- Node.js 18.x

### UI Components & Utilities
- Radix UI Components:
  - @radix-ui/react-slot ^1.0.2
  - @radix-ui/react-toast ^1.1.5
- class-variance-authority ^0.7.0
- lucide-react ^0.309.0
- clsx ^2.1.0
- tailwind-merge ^2.2.0

### Development Dependencies
- @types/node 20.11.0
- @types/react 18.2.47
- @types/react-dom 18.2.18
- autoprefixer 10.4.16
- postcss 8.4.33

### Required environment variables:
NEXTAUTH_URL=your-auth-url
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-key

### Scripts
JSON
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}

### Documentation
Refer to the /instructions directory for detailed documentation