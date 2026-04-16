'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Plus, X, Search, BookOpen, AlertCircle } from 'lucide-react'
import type { LearningPathFormData } from '@/types/learning-path'
import type { Module } from '@/types/module'

interface PathModulesStepProps {
  data: LearningPathFormData
  updateData: (data: Partial<LearningPathFormData>) => void
  errors?: Record<string, string>
}

export function PathModulesStep({ data, updateData, errors }: PathModulesStepProps) {
  const [allModules, setAllModules] = useState<Module[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/modules?status=published&limit=100')
      .then((r) => r.json())
      .then((d) => {
        setAllModules(Array.isArray(d) ? d : d.modules ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const selectedIds = new Set(data.modules.map((m) => m.moduleId))

  const filteredModules = allModules.filter(
    (m) =>
      !selectedIds.has(m.id) &&
      (m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.category?.toLowerCase().includes(search.toLowerCase()))
  )

  const addModule = (module: Module) => {
    updateData({
      modules: [
        ...data.modules,
        { moduleId: module.id, sortOrder: data.modules.length, module },
      ],
    })
  }

  const removeModule = (moduleId: number) => {
    updateData({
      modules: data.modules
        .filter((m) => m.moduleId !== moduleId)
        .map((m, i) => ({ ...m, sortOrder: i })),
    })
  }

  // Drag and drop reordering
  const handleDragStart = (index: number) => setDragIndex(index)

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    const reordered = [...data.modules]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    updateData({ modules: reordered.map((m, i) => ({ ...m, sortOrder: i })) })
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Select Modules</h2>
        <p className="text-muted-foreground text-sm">
          Add modules to this learning path. Drag to reorder.
        </p>
      </div>

      {errors?.modules && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {errors.modules}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available modules pool */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Available Modules
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Loading modules...</p>
            ) : filteredModules.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                {search ? 'No modules match your search.' : 'All modules have been added.'}
              </p>
            ) : (
              filteredModules.map((module) => (
                <Card key={module.id} className="cursor-default">
                  <CardContent className="p-3 flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{module.title}</p>
                      <div className="flex gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs py-0">{module.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs py-0">{module.category}</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => addModule(module)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Selected modules (orderable) */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Path Modules ({data.modules.length})
          </h3>
          <div className="space-y-2 min-h-[120px]">
            {data.modules.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-muted-foreground text-sm">
                Add modules from the left panel
              </div>
            ) : (
              data.modules.map((m, index) => (
                <Card
                  key={m.moduleId}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab active:cursor-grabbing transition-opacity ${
                    dragIndex === index ? 'opacity-40' : ''
                  } ${dragOverIndex === index ? 'ring-2 ring-primary' : ''}`}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground w-5 shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {m.module?.title ?? `Module #${m.moduleId}`}
                      </p>
                      {m.module && (
                        <div className="flex gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs py-0">{m.module.difficulty}</Badge>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeModule(m.moduleId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
