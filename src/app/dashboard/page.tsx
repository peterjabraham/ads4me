'use client'

import { AdMaker } from '@/components/AdMaker'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <AdMaker />
}
