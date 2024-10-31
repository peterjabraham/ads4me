import { NextApiRequest, NextApiResponse } from 'next';

export default function errorHandler(err: any, req: NextApiRequest, res: NextApiResponse) {
  console.error(err.stack);

  // Handle specific error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // Default error
  return res.status(500).json({ message: 'Internal server error' });
}