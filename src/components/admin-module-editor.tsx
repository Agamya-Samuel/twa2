'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
} from 'lucide-react'

const MOCK_MODULES = [
  {
    id: 1,
    title: 'Ancient Egypt',
    status: 'published',
    author: 'Admin',
    created: '2024-01-15',
    participants: 2543,
    avgScore: 87,
    views: 12450,
  },
  {
    id: 2,
    title: 'Renaissance Art',
    status: 'draft',
    author: 'Contributor',
    created: '2024-02-20',
    participants: 1892,
    avgScore: 85,
    views: 9876,
  },
  {
    id: 3,
    title: 'Climate Science',
    status: 'pending',
    author: 'Expert',
    created: '2024-03-10',
    participants: 3201,
    avgScore: 82,
    views: 15643,
  },
]

type ModuleStatus = 'published' | 'draft' | 'pending'

export function AdminModuleEditor() {
  const [modules, setModules] = useState(MOCK_MODULES)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | ModuleStatus>('all')
  const [showNewModuleDialog, setShowNewModuleDialog] = useState(false)
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    category: 'General',
  })

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

  const handleDeleteModule = (id: number) => {
    setModules(modules.filter((m) => m.id !== id))
  }

  const handleAddModule = () => {
    const newId = Math.max(...modules.map((m) => m.id), 0) + 1
    setModules([
      ...modules,
      {
        id: newId,
        title: newModule.title,
        status: 'draft',
        author: 'Admin',
        created: new Date().toISOString().split('T')[0],
        participants: 0,
        avgScore: 0,
        views: 0,
      },
    ])
    setShowNewModuleDialog(false)
    setNewModule({ title: '', description: '', difficulty: 'Beginner', category: 'General' })
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
            <Dialog open={showNewModuleDialog} onOpenChange={setShowNewModuleDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-5 w-5" />
                  New Module
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Module</DialogTitle>
                  <DialogDescription>Fill in the details to create a new learning module</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Module Title</label>
                    <Input
                      placeholder="e.g., Ancient Rome"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                      placeholder="Describe the module..."
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Difficulty</label>
                      <select
                        value={newModule.difficulty}
                        onChange={(e) => setNewModule({ ...newModule, difficulty: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <select
                        value={newModule.category}
                        onChange={(e) => setNewModule({ ...newModule, category: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      >
                        <option>General</option>
                        <option>History</option>
                        <option>Science</option>
                        <option>Art & Culture</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddModule}
                      disabled={!newModule.title}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Create Module
                    </Button>
                    <Button
                      onClick={() => setShowNewModuleDialog(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <p className="text-sm font-medium text-foreground/60">Pending Review</p>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {modules.filter((m) => m.status === 'pending').length}
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
            <div className="space-y-3">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground truncate">{module.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusColor(module.status)}`}>
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
                          {module.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="gap-2">
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-foreground/40 mb-2" />
                  <p className="text-foreground/60">No modules found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Community Proposals */}
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Community Proposals</CardTitle>
            <CardDescription>Review and approve module proposals from the community</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Medieval Japan', author: 'Scholar_123', votes: 45 },
                { title: 'Modern Physics', author: 'Expert_Contributor', votes: 32 },
                { title: 'World Religions', author: 'Cultural_Expert', votes: 28 },
              ].map((proposal, index) => (
                <div key={index} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-foreground">{proposal.title}</h4>
                    <p className="text-xs text-foreground/60 mt-1">
                      Proposed by {proposal.author} · {proposal.votes} community votes
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm">
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
