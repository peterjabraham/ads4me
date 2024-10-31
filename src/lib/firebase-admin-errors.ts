export class FirebaseAdminError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'FirebaseAdminError';
  }
}

export function handleFirebaseError(error: unknown): never {
  if (error instanceof FirebaseAdminError) {
    throw error;
  }

  // Handle Firebase Admin specific errors
  const fbError = error as { code?: string; message?: string };

  switch (fbError.code) {
    case 'auth/id-token-expired':
      throw new FirebaseAdminError('Authentication token expired', fbError.code, error);
    case 'auth/id-token-revoked':
      throw new FirebaseAdminError('Authentication token revoked', fbError.code, error);
    case 'auth/invalid-argument':
      throw new FirebaseAdminError('Invalid authentication argument', fbError.code, error);
    case 'auth/user-not-found':
      throw new FirebaseAdminError('User not found', fbError.code, error);
    default:
      throw new FirebaseAdminError(
        fbError.message || 'An unknown error occurred',
        fbError.code,
        error
      );
  }
}