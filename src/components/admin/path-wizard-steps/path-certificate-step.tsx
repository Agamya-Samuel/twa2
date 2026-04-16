'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Award, ImageIcon } from 'lucide-react'
import type { LearningPathFormData } from '@/types/learning-path'

interface PathCertificateStepProps {
  data: LearningPathFormData
  updateData: (data: Partial<LearningPathFormData>) => void
  errors?: Record<string, string>
}

export function PathCertificateStep({ data, updateData, errors }: PathCertificateStepProps) {
  const updateCertificate = (updates: Partial<LearningPathFormData['certificate']>) => {
    updateData({ certificate: { ...data.certificate, ...updates } })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Completion Certificate</h2>
        <p className="text-muted-foreground text-sm">
          Learners who complete this entire path will be awarded this certificate.
        </p>
      </div>

      {/* Preview */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-4 py-10">
          {data.certificate.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.certificate.image}
              alt="certificate preview"
              className="w-32 h-32 object-contain rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="h-10 w-10 text-primary" />
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">
              {data.certificate.title || 'Certificate Title'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {data.certificate.description || 'Certificate description will appear here.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="cert-title" className={errors?.['certificate.title'] ? 'text-destructive' : ''}>
              Certificate Title
            </Label>
            <Input
              id="cert-title"
              placeholder="e.g., Wikipedia Editing Fundamentals — Certificate of Completion"
              value={data.certificate.title}
              onChange={(e) => updateCertificate({ title: e.target.value })}
              className={errors?.['certificate.title'] ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors?.['certificate.title'] && (
              <p className="text-sm text-destructive">{errors['certificate.title']}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="cert-description"
              className={errors?.['certificate.description'] ? 'text-destructive' : ''}
            >
              Certificate Description
            </Label>
            <Textarea
              id="cert-description"
              placeholder="Awarded for successfully completing all modules in this learning path."
              value={data.certificate.description}
              onChange={(e) => updateCertificate({ description: e.target.value })}
              className={cn(
                'resize-none',
                errors?.['certificate.description'] ? 'border-destructive focus-visible:ring-destructive' : ''
              )}
              rows={3}
            />
            {errors?.['certificate.description'] && (
              <p className="text-sm text-destructive">{errors['certificate.description']}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cert-image">Certificate Image URL (optional)</Label>
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-lg border flex items-center justify-center bg-muted shrink-0 overflow-hidden">
                {data.certificate.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.certificate.image} alt="preview" className="object-contain w-full h-full" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <Input
                id="cert-image"
                placeholder="https://example.com/certificate-badge.png"
                value={data.certificate.image || ''}
                onChange={(e) => updateCertificate({ image: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
