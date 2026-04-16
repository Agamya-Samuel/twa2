'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { ModuleWizard } from './admin/module-wizard'
import type { Module, ModuleStatus } from '@/types/module'

export function AdminModuleEditor() {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | ModuleStatus>('all')
  
  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [moduleToEdit, setModuleToEdit] = useState<any>(null)

  const fetchModules = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/modules')
      if (!res.ok) throw new Error('Failed to fetch modules')
      const data = await res.json()
      setModules(data)
    } catch (error) {
      console.error(error)
      toast.error('Could not load modules.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  const filteredModules =
    filterStatus === 'all' ? modules : modules.filter((m) => m.status === filterStatus)

  const getStatusColor = (status: ModuleStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteModule = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this module? This cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/modules/${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) throw new Error('Failed to delete')
      
      setModules(modules.filter((m) => m.id !== id))
      toast.success('Module deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete module')
    }
  }

  const handleEditModule = async (id: number) => {
    try {
      toast.info('Loading module details...')
      const res = await fetch(`/api/admin/modules/${id}`)
      if (!res.ok) throw new Error('Failed to fetch module details')
      const fullModule = await res.json()
      
      setModuleToEdit(fullModule)
      setIsWizardOpen(true)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load module for editing')
    }
  }

  const openNewModuleWizard = () => {
    setModuleToEdit(null)
    setIsWizardOpen(true)
  }

  const closeWizard = () => {
    setIsWizardOpen(false)
    setModuleToEdit(null)
  }

  const handleWizardComplete = () => {
    closeWizard()
    fetchModules()
  }

  if (isWizardOpen) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <ModuleWizard 
            initialModule={moduleToEdit} 
            onCancel={closeWizard} 
            onComplete={handleWizardComplete} 
          />
        </div>
      </div>
    )
  }

  return (
    <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-foreground/60 mt-1">Create, edit, and manage learning modules</p>
            </div>
            <Button onClick={openNewModuleWizard} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5" />
              New Module
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-10">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-foreground/60">Total Modules</p>
                </div>
                <p className="text-3xl font-bold text-foreground">{modules.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-foreground/60">Published</p>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {modules.filter((m) => m.status === 'published').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm font-medium text-foreground/60">Drafts</p>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {modules.filter((m) => m.status === 'draft').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  <p className="text-sm font-medium text-foreground/60">Total Learners</p>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {modules.reduce((sum, m) => sum + m.participants, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Modules</CardTitle>
                <CardDescription>Manage all learning modules</CardDescription>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                {(['all', 'published', 'draft', 'pending'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              </div>
            ) : (
              <div className="space-y-3">
                {filteredModules.length > 0 ? (
                  filteredModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground truncate">{module.title}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(module.status)}`}>
                            {module.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-foreground/60">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {module.participants} learners
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {module.avgScore}% avg score
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {module.views?.toLocaleString() || 0} views
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleEditModule(module.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteModule(module.id)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed">
                    <AlertCircle className="h-8 w-8 text-foreground/40 mb-2" />
                    <p className="text-foreground/60">No modules found</p>
                    {filterStatus !== 'all' && (
                      <Button variant="link" onClick={() => setFilterStatus('all')} className="mt-2 text-primary">
                        Clear filter
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
