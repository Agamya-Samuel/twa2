'use client'

import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturedModules } from '@/components/featured-modules'
import { StatsSection } from '@/components/stats-section'
import { CallToAction } from '@/components/call-to-action'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedModules />
      {/* <StatsSection /> */}
      <CallToAction />
      <Footer />
    </main>
  )
}
