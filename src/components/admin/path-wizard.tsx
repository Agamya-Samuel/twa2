'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Stepper, Step } from '@/components/ui/stepper'
import { Loader2 } from 'lucide-react'
import type { LearningPathFormData } from '@/types/learning-path'

// Placeholders for steps
import { PathBasicInfoStep } from '@/components/admin/path-wizard-steps/path-basic-info-step'
import { PathSettingsStep } from '@/components/admin/path-wizard-steps/path-settings-step'
import { PathModulesStep } from '@/components/admin/path-wizard-steps/path-modules-step'
import { PathCertificateStep } from '@/components/admin/path-wizard-steps/path-certificate-step'
import { PathReviewStep } from '@/components/admin/path-wizard-steps/path-review-step'

const steps: Step[] = [
  { id: 'basic', title: 'Basic Info', description: 'Title, cover, etc.' },
  { id: 'settings', title: 'Settings', description: 'Sequence & status' },
  { id: 'modules', title: 'Modules', description: 'Select & order' },
  { id: 'certificate', title: 'Certificate', description: 'Rewards validation' },
  { id: 'review', title: 'Review & Publish', description: 'Final check' },
]

const initialData: LearningPathFormData = {
  title: '',
  description: '',
  difficulty: 'Beginner',
  estimatedTime: '2 hours',
  prerequisites: '',
  isSequential: false,
  status: 'draft',
  modules: [],
  certificate: {
    title: '',
    description: ''
  }
}

interface PathWizardProps {
  initialPath?: LearningPathFormData & { id?: number }
  onComplete?: () => void
  onCancel?: () => void
}

export function PathWizard({ initialPath, onComplete, onCancel }: PathWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<LearningPathFormData>(initialPath || initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = (updates: Partial<LearningPathFormData>) => {
    setData((prev) => ({ ...prev, ...updates }))
    setErrors({})
  }

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepIndex === 0) {
      if (!data.title || data.title.trim().length < 3) {
        newErrors['title'] = 'Title must be at least 3 characters.'
      }
      if (!data.description || data.description.trim().length < 10) {
        newErrors['description'] = 'Description must be at least 10 characters.'
      }
    }

    if (stepIndex === 2) {
      if (!data.modules || data.modules.length === 0) {
        newErrors['modules'] = 'You must select at least one module.'
      }
    }

    if (stepIndex === 3) {
      // Basic certificate validation
      if (!data.certificate.title || data.certificate.title.trim().length < 3) {
        newErrors['certificate.title'] = 'Certificate title must be at least 3 characters.'
      }
      if (!data.certificate.description || data.certificate.description.trim().length < 10) {
        newErrors['certificate.description'] = 'Certificate description must be at least 10 characters.'
      }
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted errors before continuing.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    try {
      // Create Certificate
      const certRes = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.certificate)
      })
      if (!certRes.ok) throw new Error('Failed to create certificate')
      const certData = await certRes.json()

      // Create Path
      const pathRes = await fetch('/api/admin/learning-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          estimatedTime: data.estimatedTime,
          prerequisites: data.prerequisites,
          isSequential: data.isSequential,
          status: 'published', // Publish immediately on finalize
          certificateId: certData.id,
          modules: data.modules.map((m, idx) => ({ moduleId: m.moduleId, sortOrder: idx }))
        })
      })

      if (!pathRes.ok) throw new Error('Failed to create learning path')

      toast.success('Learning path created successfully!')
      
      if (onComplete) {
        onComplete()
      } else {
        router.refresh()
        router.push('/admin/paths') // redirect admin to listing
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Check console for details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PathBasicInfoStep data={data} updateData={updateData} errors={errors} />
      case 1: return <PathSettingsStep data={data} updateData={updateData} errors={errors} />
      case 2: return <PathModulesStep data={data} updateData={updateData} errors={errors} />
      case 3: return <PathCertificateStep data={data} updateData={updateData} errors={errors} />
      case 4: return <PathReviewStep data={data} />
      default: return null
    }
  }

  return (
    <div className="space-y-8 flex items-center justify-center pt-10 h-full w-full mx-auto">
      <div className="w-[100%]">
        <Stepper 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={(i) => {
            if (i < currentStep) {
              setCurrentStep(i)
            } else if (i > currentStep) {
              toast.info('Please use the Continue button to validate this step first.')
            }
          }} 
          className="mb-8 hidden md:block w-3/4 mx-auto" 
        />
        
        <div className="min-h-[500px]">
          {renderStep()}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t mt-auto text-xl">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : handleBack}
            disabled={isSubmitting}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : 'Publish Learning Path'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Continue to {steps[currentStep + 1]?.title}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
