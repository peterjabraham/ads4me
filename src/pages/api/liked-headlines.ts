import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch the user session
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the Firebase Admin SDK instance
    const adminDb = await getFirebaseAdmin();

    // Create references to the user's document and liked headlines collection
    const userRef = admin.firestore().collection('users').doc(session.user.id);
    const headlinesRef = userRef.collection('liked_headlines');

    switch (req.method) {
      case 'GET':
        await handleGet(headlinesRef, res);
        break;
      case 'POST':
        await handlePost(req, headlinesRef, res, session.user.id);
        break;
      case 'DELETE':
        await handleDelete(headlinesRef, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ message: 'Method not allowed' });
        break;
    }
  } catch (error) {
    console.error('Error in request handler:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

// Handle GET request: Fetch all liked headlines
async function handleGet(headlinesRef: FirebaseFirestore.CollectionReference, res: NextApiResponse) {
  try {
    const snapshot = await headlinesRef.orderBy('timestamp', 'desc').get();
    const headlines = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(headlines);
  } catch (error) {
    console.error('Error fetching headlines:', error);
    res.status(500).json({ message: 'Error fetching headlines' });
  }
}

// Handle POST request: Add a new liked headline
async function handlePost(req: NextApiRequest, headlinesRef: FirebaseFirestore.CollectionReference, res: NextApiResponse, userId: string) {
  try {
    const { headline, primaryText } = req.body;

    if (!headline || !primaryText) {
      return res.status(400).json({ message: 'Headline and primaryText are required' });
    }

    // Check for existing headline
    const existingSnapshot = await headlinesRef
      .where('headline', '==', headline)
      .where('primaryText', '==', primaryText)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(200).json({
        message: 'Headline already saved',
        duplicate: true
      });
    }

    // Add the new headline
    await headlinesRef.add({
      headline,
      primaryText,
      timestamp: new Date().toISOString(),
      userId
    });

    res.status(200).json({
      message: 'Headline saved successfully',
      duplicate: false
    });
  } catch (error) {
    console.error('Error saving headline:', error);
    res.status(500).json({ message: 'Error saving headline' });
  }
}

// Handle DELETE request: Delete all liked headlines
async function handleDelete(headlinesRef: FirebaseFirestore.CollectionReference, res: NextApiResponse) {
  try {
    const snapshot = await headlinesRef.get();
    if (snapshot.empty) {
      return res.status(200).json({ message: 'No headlines to delete' });
    }

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.status(200).json({ message: 'All headlines deleted successfully' });
  } catch (error) {
    console.error('Error deleting headlines:', error);
    res.status(500).json({ message: 'Error deleting headlines' });
  }
}
