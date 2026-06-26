'use client';

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ModulePlayScreen } from '@/components/module-play-screen'
import { useSearchParams, useParams } from 'next/navigation'

export default function ModulePlayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const pathId = searchParams.get('pathId') || undefined

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ModulePlayScreen moduleId={params.id as string} pathId={pathId} />
      <Footer />
    </main>
  );
}
