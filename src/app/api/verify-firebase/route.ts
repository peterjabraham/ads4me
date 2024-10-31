import { verifyFirebaseConfig } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const { success, message } = await verifyFirebaseConfig();

    if (!success) {
      console.error('Firebase verification failed:', message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error('Error during Firebase verification:', error);
    return NextResponse.json(
      { error: 'Failed to verify Firebase configuration' },
      { status: 500 }
    );
  }
}