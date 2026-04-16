'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-4 md:gap-4 lg:gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-bold">WikiQuest</span>
            </div>
            <p className="text-sm text-foreground/60">
              Learn Wikipedia topics through gamified quests and earn achievements.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Modules
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-foreground/60">
            © {currentYear} WikiQuest. All rights reserved. Made with ♥ in partnership with Wikimedia Foundation.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
              GitHub
            </Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
