import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { handleFirebaseError } from '@/lib/firebase-admin-errors';

interface LikedHeadline {
  id: string;
  headline: string;
  timestamp: Date;
  userId: string;
}

export async function saveLikedHeadline(headline: string, userId: string): Promise<void> {
  try {
    const { db } = getFirebaseAdmin();
    const userRef = db.collection('users').doc(userId);
    const headlinesRef = userRef.collection('liked_headlines');

    // Check for duplicate
    const existingDoc = await headlinesRef
      .where('headline', '==', headline)
      .limit(1)
      .get();

    if (!existingDoc.empty) {
      return; // Headline already exists
    }

    await headlinesRef.add({
      headline,
      timestamp: new Date(),
      userId
    });
  } catch (error) {
    handleFirebaseError(error);
  }
}

export async function removeLikedHeadline(headline: string, userId: string): Promise<void> {
  try {
    const { db } = getFirebaseAdmin();
    const userRef = db.collection('users').doc(userId);
    const headlinesRef = userRef.collection('liked_headlines');

    const querySnapshot = await headlinesRef
      .where('headline', '==', headline)
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    handleFirebaseError(error);
  }
}

export async function getLikedHeadlines(userId: string): Promise<LikedHeadline[]> {
  try {
    const { db } = getFirebaseAdmin();
    const userRef = db.collection('users').doc(userId);
    const headlinesRef = userRef.collection('liked_headlines');

    const snapshot = await headlinesRef
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LikedHeadline[];
  } catch (error) {
    handleFirebaseError(error);
    return [];
  }
}