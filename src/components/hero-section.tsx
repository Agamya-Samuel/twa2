'use client'

import { Sparkles, Trophy, Users } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 py-12 md:gap-16 lg:grid-cols-2 lg:py-20">
          {/* Left Content */}
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">New way to learn</span>
              </div>

              <h1 className="text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Master Wikipedia Topics Through <span className="text-primary">Gamified Quests</span>
              </h1>

              <p className="text-balance text-lg leading-relaxed text-foreground/70">
                Transform your learning journey. Explore fascinating topics through interactive modules, earn achievements, compete on leaderboards, and join a community of knowledge seekers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95">
                Start Questing
              </button>
              <button className="rounded-lg border border-border bg-background px-8 py-3 font-semibold text-foreground transition-all hover:bg-muted active:scale-95">
                Explore Modules
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">12.5K+ learners</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">500+ modules</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative h-full w-full flex items-center justify-center">
              {/* Floating cards animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-80 w-72">
                  {/* Card 1 */}
                  <div className="absolute top-0 left-0 h-48 w-60 rounded-2xl border border-border bg-card p-6 shadow-xl">
                    <div className="h-4 w-24 rounded bg-primary/20 mb-4" />
                    <div className="h-3 w-40 rounded bg-muted mb-3" />
                    <div className="h-3 w-32 rounded bg-muted" />
                  </div>

                  {/* Card 2 */}
                  <div className="absolute top-20 right-0 h-48 w-60 rounded-2xl border border-border bg-card p-6 shadow-xl" style={{ transform: 'perspective(1000px) rotateY(-10deg)' }}>
                    <div className="h-4 w-24 rounded bg-secondary/20 mb-4" />
                    <div className="h-3 w-40 rounded bg-muted mb-3" />
                    <div className="h-3 w-32 rounded bg-muted" />
                  </div>

                  {/* Card 3 */}
                  <div className="absolute bottom-0 left-12 h-40 w-56 rounded-2xl border border-border bg-card p-6 shadow-xl" style={{ transform: 'perspective(1000px) rotateY(10deg)' }}>
                    <div className="h-4 w-20 rounded bg-accent/20 mb-4" />
                    <div className="h-3 w-36 rounded bg-muted mb-3" />
                    <div className="h-3 w-28 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
