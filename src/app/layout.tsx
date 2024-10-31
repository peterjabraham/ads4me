import React from 'react';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { LoginButton, LogoutButton } from '@/components/auth/auth-buttons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {session && ( // Only show nav when authenticated
            <nav className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/liked" className="text-sm font-medium transition-colors hover:text-primary">
                  Liked Headlines
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <LoginButton />
                <LogoutButton />
              </div>
            </nav>
          )}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}