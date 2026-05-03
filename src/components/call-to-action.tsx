'use client'

import { ArrowRight, Zap } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="w-full bg-primary py-20 px-4 sm:px-6 lg:px-8 text-primary-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-8 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary-foreground/20 p-3">
              <Zap className="h-8 w-8" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-balance text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ready to Start Your Learning Adventure?
            </h2>
            <p className="text-balance text-lg opacity-90">
              Join thousands of learners who are already mastering Wikipedia topics through gamified quests
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center sm:flex-row">
            <button className="rounded-lg bg-primary-foreground text-primary px-8 py-3 font-semibold transition-all hover:shadow-lg active:scale-95 inline-flex items-center justify-center gap-2">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-primary-foreground/30 bg-transparent px-8 py-3 font-semibold transition-all hover:bg-primary-foreground/10 active:scale-95">
              Learn More
            </button>
          </div>

          {/* Trust indicators */}
          {/* <div className="flex flex-col gap-4 justify-center items-center text-sm opacity-80">
            <div className="space-y-2">
              <p>✓ No credit card required</p>
              <p>✓ Free to start, premium upgrades available</p>
              <p>✓ Certified by Wikimedia Foundation</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
