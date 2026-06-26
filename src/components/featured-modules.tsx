'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Star, BookOpen, FlaskConical, Palette, ScrollText, Loader2 } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'History': ScrollText,
  'Science': FlaskConical,
  'Art & Culture': Palette,
  'General': BookOpen,
}

interface ModuleData {
  id: number
  title: string
  description: string
  difficulty: string
  category: string
  status: string
  authorId: string
  estimatedTime: string | null
  participants: number
  avgScore: number
  views: number
  rating: number | null
  badges: number
  color: string | null
  accentColor: string | null
  createdAt: string
  updatedAt: string
}

export function FeaturedModules() {
  const [modules, setModules] = useState<ModuleData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/modules?limit=4')
      .then((res) => res.json())
      .then((data) => {
        setModules(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="modules" className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  return (
    <section id="modules" className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 space-y-4">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Featured Learning Modules
          </h2>
          <p className="text-lg text-foreground/60">
            Start your adventure with our most popular and engaging topics
          </p>
        </div>

        {/* Modules Grid */}
        {modules.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => {
                const IconComponent = CATEGORY_ICONS[module.category] || BookOpen
                return (
                  <Link href={`/modules/${module.id}`} key={module.id}>
                    <Card
                      className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary cursor-pointer"
                    >
                      <CardHeader className={`${module.color || 'bg-primary/10'} pb-3`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className={`rounded-lg p-2 ${module.accentColor || 'bg-primary/20'} bg-background/50`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-semibold text-foreground/60">{module.difficulty}</span>
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-4">
                        <CardDescription className="line-clamp-2">{module.description}</CardDescription>

                        {/* Stats */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-foreground/60">
                              <Users className="h-3 w-3" />
                              <span>{module.participants.toLocaleString()} learners</span>
                            </div>
                            <div className="flex items-center gap-1 text-foreground/60">
                              <Star className="h-3 w-3" />
                              <span>{module.rating ?? 'N/A'}</span>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-foreground/60">{module.badges} badges to earn</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button className="mt-4 w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90">
                          Start Module
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {/* See All Link */}
            <div className="mt-10 flex justify-center">
              <Link href="/modules">
                <Button variant="outline" size="lg">
                  Explore All Modules
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-semibold text-foreground">No modules available yet</p>
            <p className="text-sm text-foreground/60 mt-2">Check back soon for new learning content</p>
          </div>
        )}
      </div>
    </section>
  )
}
