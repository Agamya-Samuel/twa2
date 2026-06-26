'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Users, Star, ChevronRight, BookOpen, FlaskConical, Palette, ScrollText, Loader2 } from 'lucide-react'

const CATEGORIES = ['All', 'History', 'Science', 'Art & Culture', 'General']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

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

export function ModuleCatalog() {
  const [modules, setModules] = useState<ModuleData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')

  useEffect(() => {
    fetch('/api/modules')
      .then((res) => res.json())
      .then((data) => {
        setModules(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || module.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (loading) {
    return (
      <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">All Modules</h1>
          <p className="text-lg text-foreground/60">
            Explore {modules.length} learning modules across multiple subjects
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-4 rounded-lg border border-border bg-card p-4 sm:space-y-0 sm:flex sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-foreground/60">
          Showing {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'}
        </p>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => {
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
                      <CardDescription className="line-clamp-2">{module.category}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      <p className="text-sm text-foreground/70 line-clamp-3">{module.description}</p>

                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-foreground/60">
                            <Users className="h-3 w-3" />
                            <span>{module.participants.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-foreground/60">
                            <Star className="h-3 w-3" />
                            <span>{module.rating ?? 'N/A'}</span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-foreground/60">{module.badges} badges available</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 group-hover:gap-2">
                        <span>View Module</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12">
            <p className="text-lg font-semibold text-foreground">No modules found</p>
            <p className="text-sm text-foreground/60 mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </section>
  )
}
