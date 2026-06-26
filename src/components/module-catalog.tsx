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
import { Search, Users, Star, ChevronRight, BookOpen, FlaskConical, Palette, ScrollText, Loader2, Award, ArrowUpDown } from 'lucide-react'

const CATEGORIES = ['All', 'History', 'Science', 'Art & Culture', 'General']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']
const SORT_OPTIONS = ['Newest', 'Oldest', 'Most Popular', 'Highest Rated']

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'History': ScrollText,
  'Science': FlaskConical,
  'Art & Culture': Palette,
  'General': BookOpen,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  'Beginner': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Intermediate': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Advanced': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
  const [sortBy, setSortBy] = useState('Newest')

  useEffect(() => {
    fetch('/api/modules')
      .then((res) => res.json())
      .then((data) => {
        setModules(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredModules = modules
    .filter((module) => {
      const matchesSearch =
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'All' || module.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'Oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'Most Popular':
          return b.participants - a.participants
        case 'Highest Rated':
          return (b.rating ?? 0) - (a.rating ?? 0)
        default:
          return 0
      }
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
        <div className="mb-8 space-y-2">
          <h1 className="text-[1.75rem] font-bold text-foreground sm:text-4xl" style={{ fontWeight: 700 }}>
            All Modules
          </h1>
          <p className="text-base text-foreground/60">
            Explore {modules.length} learning modules across multiple subjects
          </p>
        </div>

        {/* Unified Toolbar */}
        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-[#eaecf0] bg-card p-4 sm:flex-row sm:items-center">
          {/* Search Input - Left */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* Filters - Right */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40 h-10">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent className="border-[#eaecf0] rounded-[2px]">
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="focus:bg-[#36c] focus:text-white data-[state=checked]:bg-[#36c] data-[state=checked]:text-white"
                  >
                    {category === 'All' ? 'All Subjects' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-35 h-10">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="border-[#eaecf0] rounded-[2px]">
                {DIFFICULTIES.map((difficulty) => (
                  <SelectItem
                    key={difficulty}
                    value={difficulty}
                    className="focus:bg-[#36c] focus:text-white data-[state=checked]:bg-[#36c] data-[state=checked]:text-white"
                  >
                    {difficulty === 'All' ? 'All Levels' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Section Title + Sort */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            Showing {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'}
          </p>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-foreground/50" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent align="end" className="border-[#eaecf0] rounded-[2px]">
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="focus:bg-[#36c] focus:text-white data-[state=checked]:bg-[#36c] data-[state=checked]:text-white"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => {
              const IconComponent = CATEGORY_ICONS[module.category] || BookOpen
              const difficultyColor = DIFFICULTY_COLORS[module.difficulty] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              return (
                <Link href={`/modules/${module.id}`} key={module.id}>
                  <Card
                    className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary cursor-pointer"
                    style={{
                      boxShadow: '0 4px 4px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.08)',
                      border: '1px solid #eaecf0',
                      borderRadius: '8px',
                    }}
                  >
                    <CardHeader className={`${module.color || 'bg-primary/10'} pb-3`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className={`rounded-lg p-2 ${module.accentColor || 'bg-primary/20'} bg-background/50`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        {/* Status Chip */}
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColor}`}
                        >
                          {module.difficulty}
                        </span>
                      </div>
                      <CardTitle className="text-xl" style={{ fontWeight: 600 }}>{module.title}</CardTitle>
                      <CardDescription className="text-sm">{module.category}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed">{module.description}</p>

                      {/* Stats with Labels */}
                      <div className="grid grid-cols-3 gap-4 py-3 border-t border-[#eaecf0]">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-foreground/80">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-sm font-semibold">{module.participants.toLocaleString()}</span>
                          </div>
                          <span className="text-xs text-foreground/50 mt-0.5 block">Learners</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-foreground/80">
                            <Award className="h-3.5 w-3.5" />
                            <span className="text-sm font-semibold">{module.badges}</span>
                          </div>
                          <span className="text-xs text-foreground/50 mt-0.5 block">Badges available</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-foreground/80">
                            <Star className="h-3.5 w-3.5" />
                            <span className="text-sm font-semibold">{module.rating ?? 'N/A'}</span>
                          </div>
                          <span className="text-xs text-foreground/50 mt-0.5 block">Ratings</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full bg-[#36c] text-white transition-all hover:bg-[#36c]/90 group-hover:gap-2" style={{ borderRadius: '6px' }}>
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
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#eaecf0] bg-card py-16 px-6">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-semibold text-foreground">Start your learning journey!</p>
            <p className="text-sm text-foreground/60 mt-2 text-center max-w-md">
              No modules match your current filters. Try adjusting your search or explore all available modules.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedDifficulty('All')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
