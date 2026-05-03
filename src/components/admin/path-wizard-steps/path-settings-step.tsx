'use client'

import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lock, Shuffle, Info } from 'lucide-react'
import type { LearningPathFormData } from '@/types/learning-path'

interface PathSettingsStepProps {
  data: LearningPathFormData
  updateData: (data: Partial<LearningPathFormData>) => void
  errors?: Record<string, string>
}

export function PathSettingsStep({ data, updateData, errors }: PathSettingsStepProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Path Settings</h2>
        <p className="text-muted-foreground text-sm">Configure how learners will progress through this path.</p>
      </div>

      {/* Sequential / Free-form toggle */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="mt-0.5">
                {data.isSequential ? (
                  <Lock className="h-5 w-5 text-primary" />
                ) : (
                  <Shuffle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label htmlFor="sequential-toggle" className="text-base font-medium">
                  {data.isSequential ? 'Sequential Mode' : 'Free-form Mode'}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.isSequential
                    ? 'Learners must complete each module in order. The next module is locked until the previous one is finished.'
                    : 'Learners can complete modules in any order they choose.'}
                </p>
              </div>
            </div>
            <Switch
              id="sequential-toggle"
              checked={data.isSequential}
              onCheckedChange={(val) => updateData({ isSequential: val })}
            />
          </div>

          {data.isSequential && (
            <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4">
              <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-primary/80">
                In sequential mode, the module order you set in the <strong>Modules</strong> step determines the required progression. Learners cannot skip ahead.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publication Status */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-medium">Publication Status</h3>
            <p className="text-sm text-muted-foreground">
              Choose the initial status of this learning path.
            </p>
          </div>
          <Select
            value={data.status}
            onValueChange={(val: any) => updateData({ status: val })}
          >
            <SelectTrigger id="lp-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                  Draft — only visible to admins
                </div>
              </SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-400 inline-block" />
                  Pending — under review
                </div>
              </SelectItem>
              <SelectItem value="published">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                  Published — visible to all learners
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
