import { initializeApp, getApps, cert, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

interface FirebaseAdminSDK {
  db: Firestore;
  auth: Auth;
}

let adminInstance: FirebaseAdminSDK | null = null;

async function initializeFirebaseAdmin(): Promise<FirebaseAdminSDK> {
  if (adminInstance) {
    return adminInstance;
  }

  try {
    // Debug: Log environment variables presence
    console.log('Environment variables check:', {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    if (!process.env.FIREBASE_PRIVATE_KEY || 
        !process.env.FIREBASE_CLIENT_EMAIL || 
        !process.env.FIREBASE_PROJECT_ID) {
      throw new Error('Missing Firebase Admin SDK credentials');
    }

    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    privateKey = privateKey.replace(/^["']|["']$/g, '');

    if (privateKey.includes('\\n')) {
      privateKey = privateKey.split('\\n').join('\n');
    }

    // Debug: Log credential object structure
    const credentials = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: `${privateKey.slice(0, 27)}...${privateKey.slice(-25)}`
    };
    console.log('Initializing Firebase Admin with credentials:', credentials);

    let app: App;

    // Get existing app or initialize a new one
    if (getApps().length) {
      console.log('Using existing Firebase app instance');
      app = getApp();
    } else {
      console.log('Creating new Firebase app instance');
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey
        })
      });
    }

    console.log('Firebase Admin app initialized successfully');

    const db = getFirestore(app);
    const auth = getAuth(app);

    adminInstance = { db, auth };
    return adminInstance;

  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw error;
  }
}

export const getFirebaseAdmin = async (): Promise<FirebaseAdminSDK> => {
  if (!adminInstance) {
    return await initializeFirebaseAdmin();
  }
  return adminInstance;
};

export async function verifyFirebaseConfig() {
  try {
    console.log('Starting Firebase verification...');
    const admin = await getFirebaseAdmin();

    // Test Firestore connection
    console.log('Testing Firestore connection...');
    const collections = await admin.db.listCollections();
    console.log('Firestore connection successful');

    // Test Auth connection
    console.log('Testing Auth connection...');
    await admin.auth.listUsers(1);
    console.log('Auth connection successful');

    return { success: true, message: 'Firebase Admin SDK initialized successfully' };
  } catch (error) {
    console.error('Firebase verification error:', error);
    return {
      success: false,
      message: `Firebase Admin SDK verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Initialize the admin instance immediately
let adminDb: Firestore;
let adminAuth: Auth;

// Initialize the admin instance and export the db and auth
getFirebaseAdmin().then(admin => {
  adminDb = admin.db;
  adminAuth = admin.auth;
}).catch(error => {
  console.error('Failed to initialize Firebase Admin:', error);
});

export { adminDb, adminAuth };