'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import * as LucideIcons from 'lucide-react'
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Award,
  Star,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ModulePlayScreenProps {
  moduleId: string
  pathId?: string
}

export function ModulePlayScreen({ moduleId, pathId }: ModulePlayScreenProps) {
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState<any>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: number]: boolean }>({})
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [earnedAchievements, setEarnedAchievements] = useState<any[]>([])

  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await fetch(`/api/modules/${moduleId}`)
        if (!res.ok) {
          const body = await res.text()
          console.error(`Failed to fetch module ${moduleId}: HTTP ${res.status}`, body)
          throw new Error(`Failed to fetch module: HTTP ${res.status}`)
        }
        const data = await res.json()
        setModule(data)
      } catch (error) {
        console.error('Module fetch error:', error)
        toast.error('Failed to load module')
      } finally {
        setLoading(false)
      }
    }
    if (moduleId) {
      fetchModule()
    }
  }, [moduleId])

  const regularCards = module?.cards?.filter((c: any) => c.type !== 'achievement') || []
  const achievementCards = module?.cards?.filter((c: any) => c.type === 'achievement') || []
  const currentCard = regularCards?.[currentCardIndex]
  const totalCards = regularCards?.length || 0
  const progressPercentage = totalCards > 0 ? ((currentCardIndex + 1) / totalCards) * 100 : 0

  const saveProgress = async (status: 'in_progress' | 'completed') => {
    try {
      await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          pathId,
          status,
          currentCardIndex,
        }),
      })
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      const nextIndex = currentCardIndex + 1
      setCurrentCardIndex(nextIndex)
      setShowHint(false)
      setShowExplanation(false)
      saveProgress('in_progress')
    } else {
      handleFinish()
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowHint(false)
      setShowExplanation(false)
    }
  }

  const handleAnswerQuestion = (questionId: number, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer })
  }

  const handleSubmitAnswer = (question: any) => {
    const isCorrect = selectedAnswers[question.id] === question.correctAnswer
    if (isCorrect) {
      setAnsweredQuestions({ ...answeredQuestions, [question.id]: true })
    }
    setShowExplanation(true)
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    await saveProgress('completed')
    toast.success('Module completed!')
    
    // Show achievements before redirect
    if (achievementCards.length > 0) {
      setEarnedAchievements(achievementCards)
      setShowAchievements(true)
      setIsFinishing(false)
      return
    }
    
    // Redirect if no achievements
    redirectAfterCompletion()
  }

  const redirectAfterCompletion = () => {
    if (pathId) {
      window.location.href = `/paths/${pathId}`
    } else {
      window.location.href = '/dashboard'
    }
  }

  const handleDismissAchievements = () => {
    setShowAchievements(false)
    redirectAfterCompletion()
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!module || !currentCard) {
    return <div className="p-8 text-center text-foreground/60">Module content not found.</div>
  }

  return (
    <section className="w-full bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground">{module.title}</h1>
              <p className="text-foreground/60">Card {currentCardIndex + 1} of {totalCards}</p>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span>{module.estimatedTime || '15 mins'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-foreground/60">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="mb-8 overflow-hidden border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">
                {currentCard.type === 'content' && '📖'}
                {currentCard.type === 'question' && '❓'}
                {currentCard.type === 'achievement' && '🏆'}
                {currentCard.type === 'practical' && '📝'}
              </span>
              {currentCard.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8 space-y-6">
            {/* Content Style Rendering */}
            {currentCard.type === 'content' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {currentCard.icon && (
                  <div className="text-6xl mb-6">
                    {(() => {
                      const iconName = currentCard.icon
                        .split('-')
                        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                        .join('')
                      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>
                      return IconComponent ? <IconComponent className="w-24 h-24" /> : currentCard.icon
                    })()}
                  </div>
                )}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div 
                    className="text-xl leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: currentCard.content }}
                  />
                </div>
              </div>
            )}

            {/* Question Style Rendering */}
            {currentCard.type === 'question' && currentCard.questions?.map((q: any) => (
              <div key={q.id} className="space-y-6">
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {q.question}
                </h3>

                <div className="grid gap-3">
                  {q.options?.map((opt: any) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerQuestion(q.id, opt.optionText)}
                      disabled={answeredQuestions[q.id]}
                      className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                        selectedAnswers[q.id] === opt.optionText
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 bg-card'
                      } ${answeredQuestions[q.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-lg">{opt.optionText}</span>
                        {answeredQuestions[q.id] && q.correctAnswer === opt.optionText && (
                          <CheckCircle2 className="h-6 w-6 text-secondary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {!answeredQuestions[q.id] && (
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => handleSubmitAnswer(q)}
                      disabled={!selectedAnswers[q.id]}
                      className="w-full py-6 text-lg font-bold shadow-lg"
                    >
                      Check My Answer
                    </Button>
                    {!showHint && q.hint && (
                      <button 
                        onClick={() => setShowHint(true)}
                        className="text-sm text-secondary hover:underline flex justify-center items-center gap-1"
                      >
                         <HelpCircle className="h-4 w-4" /> Need a hint?
                      </button>
                    )}
                    {showHint && (
                      <div className="rounded-lg bg-secondary/10 border border-secondary/20 p-4 text-secondary text-sm">
                        💡 <strong>Hint:</strong> {q.hint}
                      </div>
                    )}
                  </div>
                )}

                {showExplanation && (
                  <div className={`rounded-xl p-6 border-2 ${
                    answeredQuestions[q.id] 
                      ? 'border-secondary/30 bg-secondary/5' 
                      : 'border-destructive/30 bg-destructive/5'
                  }`}>
                    <p className="font-bold mb-2 flex items-center gap-2">
                       {answeredQuestions[q.id] ? '✨ Correct!' : '❌ Let\'s try that again'}
                    </p>
                    <p className="text-foreground/80">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievement Overlay - Shows after module completion */}
        {showAchievements && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl border border-border p-8 max-w-lg w-full mx-4 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="text-center space-y-4">
                <div className="text-8xl">🏆</div>
                <h2 className="text-3xl font-extrabold text-foreground">Module Complete!</h2>
                <p className="text-foreground/60">You've earned the following achievements</p>
              </div>

              <div className="space-y-4">
                {earnedAchievements.map((achievement: any, index: number) => (
                  <div 
                    key={achievement.id || index}
                    className="flex items-center gap-4 rounded-xl border border-secondary/30 bg-secondary/5 p-4 animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-5xl">{achievement.icon || '🏅'}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">{achievement.title}</h3>
                      <p className="text-foreground/60">{achievement.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleDismissAchievements}
                className="w-full py-6 text-lg font-bold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-6">
          <Button
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            variant="ghost"
            size="lg"
            className="px-6"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i === currentCardIndex ? 'bg-primary w-10' : 'bg-muted'
                }`} 
              />
            ))}
          </div>

          <Button
            onClick={handleNextCard}
            disabled={currentCard.type === 'question' && !answeredQuestions[currentCard.questions?.[0]?.id] && !showExplanation}
            className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg py-6 min-w-[140px]"
            size="lg"
          >
            {currentCardIndex === totalCards - 1 ? 'Finish Module' : 'Continue'}
            {isFinishing ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ChevronRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </section>
  )
}
