'use client'

import Link from 'next/link'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="hidden font-bold text-foreground sm:inline-block">WikiQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden gap-8 md:flex">
            <Link
              href="#modules"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Modules
            </Link>
            <Link
              href="#leaderboard"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Leaderboard
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Sign In
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link href="#modules" className="text-sm font-medium">
                Modules
              </Link>
              <Link href="#leaderboard" className="text-sm font-medium">
                Leaderboard
              </Link>
              <Link href="#about" className="text-sm font-medium">
                About
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                  Sign In
                </button>
                <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Get Started
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
