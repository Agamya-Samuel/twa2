'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, BarChart3, ChevronRight, Award } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export function FeaturedPaths() {
  const [paths, setPaths] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/learning-paths') // Using existing admin fetch for now, can be optimized later
      .then(res => res.json())
      .then(data => {
        setPaths(data.slice(0, 3)) // Show only top 3 on homepage
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading && paths.length === 0) return null
  if (!loading && paths.length === 0) return null

  return (
    <section id="paths" className="w-full bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-y">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl tracking-tight">
              Curated Learning Paths
            </h2>
            <p className="text-lg text-foreground/60 max-w-7xl">
              Master complex topics with structured journeys designed by Wikipedia experts.
            </p>
          </div>
          <Link href="/paths">
            <Button variant="outline" className="hidden md:flex">
              View All Paths <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Paths Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <Card key={path.id} className="group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all hover:shadow-2xl bg-card">
              <div className="relative h-48 w-full bg-muted">
                {path.coverImage ? (
                  <img src={path.coverImage} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/5">
                    <BookOpen className="h-12 w-12 text-primary/20" />
                  </div>
                )}
                <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground">
                  {path.difficulty}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-1">{path.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {path.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{path.estimatedTime || 'Self-paced'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>{path.modules?.length || 0} Modules</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/paths/${path.id}`} className="block">
                    <Button className="w-full py-6 text-md font-bold shadow-lg shadow-primary/10">
                      Start Journey
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link href="/paths" className="w-full">
            <Button variant="outline" className="w-full">
              Explore All Paths
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
