'use client'

import { signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

export function LoginButton() {
  const { data: session } = useSession()

  if (session) return null

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
  const { data: session } = useSession()

  if (!session) return null

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