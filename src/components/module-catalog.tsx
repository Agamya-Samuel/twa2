'use client'

import { useState } from 'react'
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
import { Search, Globe, Zap, TrendingUp, Star, Lock, Users, ChevronRight } from 'lucide-react'

const ALL_MODULES = [
  {
    id: 1,
    title: 'Ancient Egypt',
    description: 'Discover the mysteries of pharaohs, pyramids, and hieroglyphics in one of history\'s greatest civilizations.',
    icon: Globe,
    difficulty: 'Beginner',
    participants: 2543,
    rating: 4.8,
    badges: 5,
    category: 'History',
    color: 'bg-amber-100 dark:bg-amber-950',
    accentColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    id: 2,
    title: 'Renaissance Art',
    description: 'Explore the creative explosion that shaped modern culture and artistic expression.',
    icon: Zap,
    difficulty: 'Intermediate',
    participants: 1892,
    rating: 4.9,
    badges: 8,
    category: 'Art & Culture',
    color: 'bg-red-100 dark:bg-red-950',
    accentColor: 'text-red-700 dark:text-red-300',
  },
  {
    id: 3,
    title: 'Climate Science',
    description: 'Understand Earth\'s climate systems, environmental change, and solutions for a sustainable future.',
    icon: TrendingUp,
    difficulty: 'Advanced',
    participants: 3201,
    rating: 4.7,
    badges: 6,
    category: 'Science',
    color: 'bg-green-100 dark:bg-green-950',
    accentColor: 'text-green-700 dark:text-green-300',
  },
  {
    id: 4,
    title: 'Space Exploration',
    description: 'Journey through the cosmos and discover our place in the universe through space missions and discovery.',
    icon: Star,
    difficulty: 'Intermediate',
    participants: 2876,
    rating: 4.9,
    badges: 7,
    category: 'Science',
    color: 'bg-blue-100 dark:bg-blue-950',
    accentColor: 'text-blue-700 dark:text-blue-300',
  },
  {
    id: 5,
    title: 'Medieval History',
    description: 'Travel back to the Middle Ages and explore kingdoms, crusades, and cultural transformations.',
    icon: Globe,
    difficulty: 'Beginner',
    participants: 1654,
    rating: 4.6,
    badges: 4,
    category: 'History',
    color: 'bg-purple-100 dark:bg-purple-950',
    accentColor: 'text-purple-700 dark:text-purple-300',
  },
  {
    id: 6,
    title: 'Industrial Revolution',
    description: 'Discover how technology and innovation transformed society and the global economy.',
    icon: Zap,
    difficulty: 'Intermediate',
    participants: 2107,
    rating: 4.7,
    badges: 5,
    category: 'History',
    color: 'bg-gray-100 dark:bg-gray-950',
    accentColor: 'text-gray-700 dark:text-gray-300',
  },
  {
    id: 7,
    title: 'Quantum Physics',
    description: 'Dive deep into the quantum world and understand the fundamental nature of reality.',
    icon: TrendingUp,
    difficulty: 'Advanced',
    participants: 1243,
    rating: 4.8,
    badges: 9,
    category: 'Science',
    color: 'bg-cyan-100 dark:bg-cyan-950',
    accentColor: 'text-cyan-700 dark:text-cyan-300',
  },
  {
    id: 8,
    title: 'Ancient Rome',
    description: 'Explore the rise and fall of one of history\'s most influential empires.',
    icon: Globe,
    difficulty: 'Intermediate',
    participants: 2934,
    rating: 4.8,
    badges: 6,
    category: 'History',
    color: 'bg-orange-100 dark:bg-orange-950',
    accentColor: 'text-orange-700 dark:text-orange-300',
  },
]

const CATEGORIES = ['All', 'History', 'Science', 'Art & Culture']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

export function ModuleCatalog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')

  const filteredModules = ALL_MODULES.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || module.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">All Modules</h1>
          <p className="text-lg text-foreground/60">
            Explore {ALL_MODULES.length} learning modules across multiple subjects
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
                          <span>{module.rating}</span>
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
