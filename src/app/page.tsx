import { LoginButton } from '@/components/auth/auth-buttons'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth";
import { signOut } from 'next-auth/react'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // If user is already signed in, sign them out first
  if (session) {
    await signOut({ redirect: false })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-white">The Headline Lab</h1>
        <p className="text-xl text-zinc-400">
          Generate high-converting ad copy using AI. Perfect for marketers, business owners, and advertising professionals.
        </p>
        <div className="space-y-4">
          <p className="text-zinc-300">
            ✓ Generate multiple ad variations<br />
            ✓ Save your favorite headlines<br />
            ✓ Learn from high-performing ads<br />
            ✓ Export selected headlines
          </p>
          <div className="pt-4">
            <LoginButton />
          </div>
        </div>
      </div>
    </main>
  )
}
