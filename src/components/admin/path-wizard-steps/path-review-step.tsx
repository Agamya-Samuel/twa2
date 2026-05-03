'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Award, Clock, Lock, Shuffle, CheckCircle2 } from 'lucide-react'
import type { LearningPathFormData } from '@/types/learning-path'

interface PathReviewStepProps {
  data: LearningPathFormData
}

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
}

const statusColor: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-orange-100 text-orange-800',
}

export function PathReviewStep({ data }: PathReviewStepProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Learning Path</h2>
        <p className="text-muted-foreground text-sm">
          Everything looks good? Click <strong>Publish Learning Path</strong> to make it live.
        </p>
      </div>

      {/* Header Summary */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-4">
            {data.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.coverImage}
                alt="cover"
                className="w-20 h-20 rounded-lg object-cover border shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-primary/10 border flex items-center justify-center shrink-0">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">{data.title || '(No title)'}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{data.description || '(No description)'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={difficultyColor[data.difficulty]}>{data.difficulty}</Badge>
                <Badge className={statusColor[data.status]}>{data.status}</Badge>
                {data.estimatedTime && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {data.estimatedTime}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {data.prerequisites && (
            <div className="border-t pt-4">
              <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Prerequisites</p>
              <p className="text-sm">{data.prerequisites}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            {data.isSequential ? (
              <Lock className="h-5 w-5 text-primary" />
            ) : (
              <Shuffle className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">{data.isSequential ? 'Sequential Mode' : 'Free-form Mode'}</p>
              <p className="text-sm text-muted-foreground">
                {data.isSequential
                  ? 'Learners must complete modules in order.'
                  : 'Learners can complete modules in any order.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">Modules ({data.modules.length})</p>
          </div>
          {data.modules.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No modules selected.</p>
          ) : (
            <ol className="space-y-2">
              {data.modules.map((m, i) => (
                <li key={m.moduleId} className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground w-5 text-xs">{i + 1}.</span>
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">{m.module?.title ?? `Module #${m.moduleId}`}</span>
                  {m.module?.difficulty && (
                    <Badge variant="outline" className="text-xs ml-auto">{m.module.difficulty}</Badge>
                  )}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Certificate */}
      <Card className="border-primary/20">
        <CardContent className="pt-6 flex items-start gap-4">
          <Award className="h-8 w-8 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{data.certificate.title || '(No certificate title)'}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.certificate.description || '(No certificate description)'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
