'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  disabled?: boolean
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, disabled, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between gap-4 relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-muted/50 -z-10" />
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-primary transition-all duration-300 ease-in-out -z-10" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > index
          const isCurrent = currentStep === index
          const isClickable = onStepClick && (isCompleted || isCurrent) && !disabled

          return (
            <div 
              key={step.id}
              className={cn(
                "flex flex-col items-center group",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background transition-colors shadow-sm",
                  isCompleted ? "border-primary bg-primary text-primary-foreground" :
                  isCurrent ? "border-primary text-primary" : 
                  "border-muted text-muted-foreground",
                  isClickable && !isCurrent && "group-hover:border-primary/50 group-hover:bg-primary/10"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className={cn("font-medium", isCurrent ? "" : "text-muted-foreground")}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="absolute top-12 mt-2 flex flex-col items-center">
                <span className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
