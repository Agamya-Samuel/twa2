'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Zap, Star, Lock, Users, TrendingUp } from 'lucide-react'

const FEATURED_MODULES = [
  {
    id: 1,
    title: 'Ancient Egypt',
    description: 'Discover the mysteries of pharaohs, pyramids, and hieroglyphics',
    icon: Globe,
    difficulty: 'Beginner',
    participants: 2543,
    rating: 4.8,
    badges: 5,
    color: 'bg-amber-100 dark:bg-amber-950',
    accentColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    id: 2,
    title: 'Renaissance Art',
    description: 'Explore the creative explosion that shaped modern culture',
    icon: Zap,
    difficulty: 'Intermediate',
    participants: 1892,
    rating: 4.9,
    badges: 8,
    color: 'bg-red-100 dark:bg-red-950',
    accentColor: 'text-red-700 dark:text-red-300',
  },
  {
    id: 3,
    title: 'Climate Science',
    description: 'Understand Earth&apos;s climate systems and environmental change',
    icon: TrendingUp,
    difficulty: 'Advanced',
    participants: 3201,
    rating: 4.7,
    badges: 6,
    color: 'bg-green-100 dark:bg-green-950',
    accentColor: 'text-green-700 dark:text-green-300',
  },
  {
    id: 4,
    title: 'Space Exploration',
    description: 'Journey through the cosmos and discover our place in the universe',
    icon: Star,
    difficulty: 'Intermediate',
    participants: 2876,
    rating: 4.9,
    badges: 7,
    color: 'bg-blue-100 dark:bg-blue-950',
    accentColor: 'text-blue-700 dark:text-blue-300',
  },
]

export function FeaturedModules() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURED_MODULES.map((module) => {
            const IconComponent = module.icon
            return (
              <Card
                key={module.id}
                className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary"
              >
                <CardHeader className={`${module.color} pb-3`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-lg p-2 ${module.accentColor} bg-background/50`}>
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
                        <span>{module.rating}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-foreground/60">{module.badges} badges to earn</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Completion</span>
                      <span className="font-semibold">32%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: '32%' }}
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="mt-4 w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90">
                    Start Module
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* See All Link */}
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg">
            Explore All Modules
          </Button>
        </div>
      </div>
    </section>
  )
}
