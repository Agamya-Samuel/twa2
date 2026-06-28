'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { BookOpen, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/modules', label: 'Modules' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/about', label: 'About' },
  { href: '/contribute', label: 'Contribute', requireAuth: true },
]

export function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const userRole = session?.user?.role || 'user'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="hidden font-bold text-foreground sm:inline-block">WikiQuest</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.requireAuth && !session) return null
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-5 text-sm font-medium transition-colors ${
                    active
                      ? 'text-[#36c]'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#36c]"
                      style={{ height: '2px' }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeSwitcher />

          {status === 'loading' ? (
            <div className="hidden h-9 w-20 animate-pulse rounded-lg bg-muted md:block" />
          ) : session ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{session.user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background py-1 shadow-md">
                    <div className="border-b border-border px-3 py-2">
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/contribute"
                      className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <BookOpen className="h-4 w-4" />
                      Contribute
                    </Link>
                    {userRole === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <Settings className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}

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
        </div>

        {isOpen && (
          <nav className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                if (item.requireAuth && !session) return null
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'text-[#36c] bg-[#36c]/5'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {session ? (
                <>
                  {userRole === 'admin' && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive('/admin') ? 'text-[#36c] bg-[#36c]/5' : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/profile') ? 'text-[#36c] bg-[#36c]/5' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    Profile
                  </Link>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/auth/signin"
                    className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-center transition-colors hover:bg-muted"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-center text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
