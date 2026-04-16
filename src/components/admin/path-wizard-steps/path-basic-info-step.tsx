'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import type { LearningPathFormData } from '@/types/learning-path'

interface PathBasicInfoStepProps {
  data: LearningPathFormData
  updateData: (data: Partial<LearningPathFormData>) => void
  errors?: Record<string, string>
}

export function PathBasicInfoStep({ data, updateData, errors }: PathBasicInfoStepProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="lp-title" className={errors?.title ? 'text-destructive' : ''}>
              Learning Path Title
            </Label>
            <Input
              id="lp-title"
              placeholder="e.g., Wikipedia Editing Fundamentals"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className={errors?.title ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors?.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lp-description" className={errors?.description ? 'text-destructive' : ''}>
              Description
            </Label>
            <Textarea
              id="lp-description"
              placeholder="Describe what learners will achieve by completing this path..."
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              className={cn('resize-none', errors?.description ? 'border-destructive focus-visible:ring-destructive' : '')}
              rows={4}
            />
            {errors?.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lp-cover">Cover Image URL</Label>
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-lg border flex items-center justify-center bg-muted shrink-0 overflow-hidden">
                {data.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.coverImage} alt="cover preview" className="object-cover w-full h-full" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <Input
                id="lp-cover"
                placeholder="https://example.com/image.png"
                value={data.coverImage || ''}
                onChange={(e) => updateData({ coverImage: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lp-difficulty">Difficulty</Label>
              <Select
                value={data.difficulty}
                onValueChange={(val: any) => updateData({ difficulty: val })}
              >
                <SelectTrigger id="lp-difficulty">
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
              <Label htmlFor="lp-time">Estimated Time to Complete</Label>
              <Input
                id="lp-time"
                placeholder="e.g., 3 hours, 2 weeks"
                value={data.estimatedTime}
                onChange={(e) => updateData({ estimatedTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lp-prerequisites">Prerequisites</Label>
            <Textarea
              id="lp-prerequisites"
              placeholder="What should learners know before starting? (optional)"
              value={data.prerequisites}
              onChange={(e) => updateData({ prerequisites: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
