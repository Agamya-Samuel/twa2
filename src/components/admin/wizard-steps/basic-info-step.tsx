'use client'

import { Input } from '@/components/ui/input'
import { Label, RequiredLabel } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ModuleFormData } from '@/types/module'

interface BasicInfoStepProps {
  data: ModuleFormData
  updateData: (data: Partial<ModuleFormData>) => void
  errors?: Record<string, string>
}

export function BasicInfoStep({ data, updateData, errors }: BasicInfoStepProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <RequiredLabel htmlFor="title" required className={errors?.title ? "text-destructive" : ""}>Module Title</RequiredLabel>
            <Input 
              id="title" 
              placeholder="e.g., Introduction to Ancient History"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className={errors?.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors?.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          
          <div className="grid gap-2">
            <RequiredLabel htmlFor="description" required className={errors?.description ? "text-destructive" : ""}>Description</RequiredLabel>
            <Textarea 
              id="description" 
              placeholder="Provide a brief overview of what users will learn..."
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              className={cn("resize-none", errors?.description ? "border-destructive focus-visible:ring-destructive" : "")}
              rows={4}
            />
            {errors?.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select 
                value={data.difficulty} 
                onValueChange={(val: any) => updateData({ difficulty: val })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={data.category} 
                onValueChange={(val: any) => updateData({ category: val })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Art & Culture">Art & Culture</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <RequiredLabel htmlFor="time" required className={errors?.estimatedTime ? "text-destructive" : ""}>Estimated Time</RequiredLabel>
              <Input 
                id="time" 
                placeholder="e.g., 30 min"
                value={data.estimatedTime}
                onChange={(e) => updateData({ estimatedTime: e.target.value })}
                className={errors?.estimatedTime ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors?.estimatedTime && <p className="text-sm text-destructive">{errors.estimatedTime}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Theme Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="color" 
                  type="color"
                  value={data.color || '#3b82f6'}
                  onChange={(e) => updateData({ color: e.target.value })}
                  className="w-12 p-1"
                />
                <Input 
                  value={data.color || '#3b82f6'}
                  onChange={(e) => updateData({ color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="accentColor" 
                  type="color"
                  value={data.accentColor || '#1d4ed8'}
                  onChange={(e) => updateData({ accentColor: e.target.value })}
                  className="w-12 p-1"
                />
                <Input 
                  value={data.accentColor || '#1d4ed8'}
                  onChange={(e) => updateData({ accentColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
