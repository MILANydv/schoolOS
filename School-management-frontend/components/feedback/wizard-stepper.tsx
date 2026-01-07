"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepProps<T> {
  stepKey: string
  title: string
  description: string
  component: React.ComponentType<{
    initialData?: T
    onNext: (data: T) => void
    onBack: () => void
    isLastStep: boolean
    isFirstStep: boolean
  }>
}

interface WizardStepperProps<T> {
  steps: StepProps<T>[]
  onFinish: (data: T) => void
  initialData?: T
}

export function WizardStepper<T extends Record<string, any>>({ steps, onFinish, initialData }: WizardStepperProps<T>) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [formData, setFormData] = React.useState<T>(initialData || ({} as T))

  const CurrentStepComponent = steps[currentStepIndex].component

  const handleNext = (stepData: T) => {
    setFormData((prevData) => ({ ...prevData, ...stepData }))
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1)
    } else {
      onFinish({ ...formData, ...stepData })
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prevIndex) => prevIndex - 1)
    }
  }

  const isLastStep = currentStepIndex === steps.length - 1
  const isFirstStep = currentStepIndex === 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.stepKey}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  index === currentStepIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : index < currentStepIndex
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-muted-foreground text-muted-foreground",
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm",
                  index === currentStepIndex ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5 bg-border mx-2", index < currentStepIndex && "bg-primary")} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-bold">{steps[currentStepIndex].title}</h2>
        <p className="text-muted-foreground">{steps[currentStepIndex].description}</p>
        <div className="mt-6">
          <CurrentStepComponent
            initialData={formData}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={isLastStep}
            isFirstStep={isFirstStep}
          />
        </div>
      </div>
    </div>
  )
}
