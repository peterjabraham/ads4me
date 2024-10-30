'use client'

import { signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function LoginButton() {
  const handleSignIn = () => {
    signIn('google', {
      callbackUrl: '/dashboard',
      redirect: true
    })
  }

  return (
    <Button
      onClick={handleSignIn}
      className="bg-white text-black hover:bg-zinc-200"
    >
      Sign in with Google
    </Button>
  )
}

export function LogoutButton() {
  const handleSignOut = () => {
    signOut({
      callbackUrl: '/',
      redirect: true
    })
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="border-zinc-700 text-zinc-300 hover:bg-zinc-900"
    >
      Sign Out
    </Button>
  )
}
