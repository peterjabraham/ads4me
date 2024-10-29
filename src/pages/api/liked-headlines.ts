import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { adminDb } from '@/lib/firebase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userRef = adminDb.collection('users').doc(session.user.id)
  const headlinesRef = userRef.collection('liked_headlines')

  if (req.method === 'GET') {
    try {
      const snapshot = await headlinesRef.orderBy('timestamp', 'desc').get()
      const headlines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      res.status(200).json(headlines)
    } catch (error) {
      console.error('Error fetching headlines:', error)
      res.status(500).json({ message: 'Error fetching headlines' })
    }
  } else if (req.method === 'POST') {
    try {
      const { headline, primaryText } = req.body

      // Check for existing headline with the same content
      const existingSnapshot = await headlinesRef
        .where('headline', '==', headline)
        .where('primaryText', '==', primaryText)
        .get()

      if (!existingSnapshot.empty) {
        // Headline already exists, return success but don't add duplicate
        return res.status(200).json({ 
          message: 'Headline already saved',
          duplicate: true 
        })
      }

      // Add new headline if it doesn't exist
      await headlinesRef.add({
        headline,
        primaryText,
        timestamp: new Date().toISOString(),
        userId: session.user.id
      })

      res.status(200).json({ 
        message: 'Headline saved successfully',
        duplicate: false
      })
    } catch (error) {
      console.error('Error saving headline:', error)
      res.status(500).json({ message: 'Error saving headline' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const snapshot = await headlinesRef.get()
      const batch = adminDb.batch()
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
      res.status(200).json({ message: 'All headlines deleted successfully' })
    } catch (error) {
      console.error('Error deleting headlines:', error)
      res.status(500).json({ message: 'Error deleting headlines' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
