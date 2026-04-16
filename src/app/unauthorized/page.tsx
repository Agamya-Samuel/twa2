'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Lock } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
          <p className="mb-6 text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go Home
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
