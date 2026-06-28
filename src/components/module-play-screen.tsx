'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Award,
  Clock,
  Loader2,
  CheckCircle2,
  BookOpen,
  Bookmark,
  Lightbulb,
  X,
  Sparkles,
  Trophy,
  PartyPopper,
} from 'lucide-react'
import { toast } from 'sonner'

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
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }))
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

    if (achievementCards.length > 0) {
      setEarnedAchievements(achievementCards)
      setShowAchievements(true)
      setIsFinishing(false)
      return
    }

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'Advanced':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#36c]" />
      </div>
    )
  }

  if (!module || !currentCard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-base text-foreground/60">Module content not found.</p>
      </div>
    )
  }

  return (
    <section className="w-full bg-[#f8f9fa] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight" style={{ fontWeight: 700 }}>
              {module.title}
            </h1>
            <p className="text-sm text-foreground/50">
              Card {currentCardIndex + 1} of {totalCards}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-medium">
              <Award className="h-3.5 w-3.5" />
              +50 XP
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 text-xs font-medium">
              <Clock className="h-3.5 w-3.5" />
              {module.estimatedTime || '15 min'}
            </span>
          </div>
        </div>

        {/* Lesson Card */}
        <Card className="mb-10 overflow-hidden border border-[#eaecf0] bg-white" style={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' }}>
          <CardContent className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            {/* Card Badge + Bookmark */}
            <div className="mb-8 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#36c]/5 text-[#36c] px-3.5 py-1.5 text-xs font-semibold border border-[#36c]/15">
                {currentCard.type === 'content' && <BookOpen className="h-3.5 w-3.5" />}
                {currentCard.type === 'question' && <HelpCircle className="h-3.5 w-3.5" />}
                {currentCard.type === 'achievement' && <Award className="h-3.5 w-3.5" />}
                {currentCard.type === 'practical' && <Lightbulb className="h-3.5 w-3.5" />}
                {currentCard.type === 'content' ? 'Lesson' : currentCard.type === 'question' ? 'Quiz' : currentCard.type === 'achievement' ? 'Achievement' : 'Activity'}
              </span>
              <button className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#eaecf0] text-foreground/40 hover:text-foreground hover:border-[#c9ccd1] transition-colors">
                <Bookmark className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Side-by-side Layout: Illustration Left + Content Right (content cards only) */}
            <div className={`flex flex-col gap-10 ${currentCard.icon && currentCard.type === 'content' ? 'lg:flex-row lg:gap-16' : ''}`}>

              {/* Illustration - Left (content cards only) */}
              {currentCard.icon && currentCard.type === 'content' && (
                <div className="lg:w-2/5 flex-shrink-0">
                  <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#36c]/5 to-[#36c]/10 border border-[#36c]/10 p-10 sm:p-14 lg:p-20" style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    {(() => {
                      const iconName = currentCard.icon
                        .split('-')
                        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join('')
                      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>
                      return IconComponent ? (
                        <IconComponent className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 text-[#36c]/70" strokeWidth={1.2} />
                      ) : (
                        <span className="text-6xl sm:text-7xl">{currentCard.icon}</span>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Content - Right */}
              <div className={currentCard.icon && currentCard.type === 'content' ? 'lg:w-3/5' : 'w-full'}>
                {/* Lesson Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10 tracking-tight" style={{ fontWeight: 700 }}>
                  {currentCard.title}
                </h2>

                {/* Content Rendering */}
                {currentCard.type === 'content' && (
                  <div className="space-y-6">
                    <div
                      className="text-foreground/85 leading-relaxed text-lg sm:text-xl"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: currentCard.content }}
                    />
                  </div>
                )}

                {/* Question Rendering */}
                {currentCard.type === 'question' && currentCard.questions?.length > 0 && (
                  <div className="space-y-8">
                    {currentCard.questions.map((q: any) => {
                      const isAnswered = answeredQuestions[q.id]
                      const selectedAnswer = selectedAnswers[q.id]
                      return (
                        <div key={q.id} className="space-y-8">
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
                            {q.question}
                          </h3>

                          <div className="grid gap-3">
                            {q.options?.map((opt: any) => {
                              const isSelected = selectedAnswer === opt.optionText
                              const isCorrect = q.correctAnswer === opt.optionText
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleAnswerQuestion(q.id, opt.optionText)}
                                  disabled={isAnswered}
                                  className={`w-full rounded-xl border p-5 text-left transition-all ${
                                    isSelected
                                      ? 'border-[#36c] bg-[#36c]/5 ring-1 ring-[#36c]/20'
                                      : 'border-[#eaecf0] hover:border-[#c9ccd1] bg-white'
                                  } ${isAnswered ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  style={{ borderRadius: '12px' }}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'border-[#36c]'
                                        : 'border-[#d0d5dd]'
                                    }`}>
                                      {isSelected && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#36c]" />
                                      )}
                                    </div>
                                    <span className="font-medium text-base flex-1">{opt.optionText}</span>
                                    {isAnswered && isCorrect && (
                                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>

                          {/* Check My Answer Button */}
                          {!isAnswered && (
                            <div className="flex flex-col gap-4">
                              <Button
                                onClick={() => handleSubmitAnswer(q)}
                                disabled={!selectedAnswer}
                                className={`w-full py-5 text-base font-semibold ${
                                  selectedAnswer
                                    ? 'bg-[#36c] text-white hover:bg-[#3056a9] cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                style={{ borderRadius: '10px' }}
                              >
                                Check My Answer
                              </Button>
                              {q.hint && !showHint && (
                                <button
                                  onClick={() => setShowHint(true)}
                                  className="text-sm text-foreground/50 hover:text-foreground/70 flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <HelpCircle className="h-4 w-4" />
                                  Need a hint?
                                </button>
                              )}
                              {showHint && q.hint && (
                                <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 text-amber-800 text-sm">
                                  <span className="font-medium">Hint:</span> {q.hint}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Explanation */}
                          {isAnswered && (
                            <div className={`rounded-xl p-6 border ${
                              selectedAnswer === q.correctAnswer
                                ? 'border-emerald-200 bg-emerald-50'
                                : 'border-red-200 bg-red-50'
                            }`} style={{ borderRadius: '12px' }}>
                              <p className="font-semibold mb-2 flex items-center gap-2">
                                {selectedAnswer === q.correctAnswer ? '✅ Correct!' : '❌ Not quite right'}
                              </p>
                              <p className="text-sm text-foreground/60 mb-3">
                                Your answer: <span className="font-medium text-foreground/80">{selectedAnswer}</span>
                              </p>
                              {q.explanation && (
                                <p className="text-foreground/70 leading-relaxed">{q.explanation}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Key Takeaway - Below both columns */}
            {currentCard.type === 'content' && currentCard.content && (
              <div className="mt-10 rounded-xl bg-[#36c]/5 border-l-4 border-[#36c] p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <Lightbulb className="h-5 w-5 text-[#36c]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#36c] mb-2">Key Takeaway</p>
                    <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                      Review the lesson above and reflect on the key concepts before continuing.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className={`px-6 py-5 text-sm font-medium border-[#eaecf0] hover:text-foreground hover:border-[#c9ccd1] ${
              currentCardIndex === 0
                ? 'text-foreground/30 cursor-not-allowed'
                : 'text-foreground/70 bg-white'
            }`}
            style={{ borderRadius: '10px' }}
          >
            <ChevronLeft className="mr-1.5 h-4 w-4" />
            Previous
          </Button>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-200 ${
                  i === currentCardIndex
                    ? 'w-8 h-2.5 rounded-full bg-[#36c]'
                    : i < currentCardIndex
                    ? 'w-2.5 h-2.5 rounded-full bg-[#36c]/30'
                    : 'w-2.5 h-2.5 rounded-full bg-[#eaecf0]'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNextCard}
            disabled={currentCard.type === 'question' && !answeredQuestions[currentCard.questions?.[0]?.id] && !showExplanation}
            className="px-7 py-5 text-sm font-semibold bg-[#36c] text-white hover:bg-[#3056a9] min-w-[130px]"
            style={{ borderRadius: '10px' }}
          >
            {currentCardIndex === totalCards - 1 ? 'Finish' : 'Continue'}
            {isFinishing ? (
              <Loader2 className="ml-1.5 h-4 w-4 animate-spin" />
            ) : (
              <ChevronRight className="ml-1.5 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Achievement Overlay */}
      {showAchievements && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {/* Floating Sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + (i * 7) % 80}%`,
                  top: `${5 + (i * 13) % 85}%`,
                  animation: `sparkle ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.6,
                }}
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
            ))}
          </div>

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => {
              const colors = ['#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444', '#10b981', '#ec4899']
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${5 + (i * 5) % 90}%`,
                    top: '-5%',
                    width: `${6 + (i % 4) * 2}px`,
                    height: `${6 + (i % 4) * 2}px`,
                    backgroundColor: colors[i % colors.length],
                    borderRadius: i % 3 === 0 ? '50%' : '2px',
                    animation: `confettiFall ${2 + (i % 3) * 0.5}s ease-in forwards`,
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${i * 30}deg)`,
                  }}
                />
              )
            })}
          </div>

          {/* Modal */}
          <div
            className="relative bg-white max-w-lg w-full mx-4 overflow-hidden"
            style={{
              borderRadius: '24px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.1)',
              animation: 'modalScaleIn 0.4s ease-out',
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleDismissAchievements}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white text-foreground/50 hover:text-foreground transition-all"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Trophy Section */}
            <div className="relative pt-12 pb-8 px-8 text-center">
              {/* Radial Light Burst */}
              <div
                className="absolute left-1/2 top-8 -translate-x-1/2 w-48 h-48 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.08) 40%, transparent 70%)',
                  animation: 'glowPulse 2s ease-in-out infinite',
                }}
              />

              {/* Trophy with Glow */}
              <div
                className="relative inline-block"
                style={{ animation: 'trophyBounce 0.6s ease-out' }}
              >
                <div
                  className="text-8xl sm:text-9xl relative z-10"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(245,158,11,0.4))' }}
                >
                  🏆
                </div>
                {/* Soft glow ring */}
                <div
                  className="absolute inset-0 -m-4 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
                    animation: 'glowPulse 2s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Typography */}
              <div className="mt-6 space-y-2 relative z-10">
                <h2
                  className="text-3xl sm:text-4xl text-foreground tracking-tight"
                  style={{ fontWeight: 800, lineHeight: 1.2 }}
                >
                  Module Complete!
                </h2>
                <p className="text-base text-foreground/50" style={{ lineHeight: 1.6 }}>
                  You&apos;ve earned the following achievements
                </p>
              </div>
            </div>

            {/* Achievement Cards */}
            <div className="px-8 pb-8 space-y-4">
              {earnedAchievements.map((achievement: any, index: number) => (
                <div
                  key={achievement.id || index}
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(139,92,246,0.2)',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(245,158,11,0.04) 100%)',
                    boxShadow: '0 2px 12px rgba(139,92,246,0.08), 0 1px 3px rgba(0,0,0,0.04)',
                    padding: '20px',
                    animation: `slideUp 0.5s ease-out forwards`,
                    animationDelay: `${0.3 + index * 0.15}s`,
                    opacity: 0,
                    transform: 'translateY(10px)',
                  }}
                >
                  {/* Subtle gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.03) 0%, transparent 50%)',
                    }}
                  />
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                        boxShadow: '0 4px 12px rgba(139,92,246,0.3), 0 0 20px rgba(139,92,246,0.15)',
                      }}
                    >
                      <Trophy className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base text-foreground truncate"
                        style={{ fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-foreground/50 mt-1" style={{ lineHeight: 1.5 }}>
                        {achievement.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="px-8 pb-8">
              <button
                onClick={handleDismissAchievements}
                className="w-full flex items-center justify-center gap-2.5 text-white font-semibold text-base transition-all"
                style={{
                  borderRadius: '14px',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #36c 0%, #4f7bd6 100%)',
                  boxShadow: '0 4px 16px rgba(54,108,204,0.3), 0 1px 3px rgba(0,0,0,0.1)',
                  animation: 'buttonPulse 0.5s ease-out 1s forwards',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(54,108,204,0.3)'
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(54,108,204,0.3), 0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(54,108,204,0.3), 0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <PartyPopper className="h-5 w-5" />
                Continue
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modalScaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes trophyBounce {
              0% { transform: scale(0.85); opacity: 0; }
              60% { transform: scale(1.05); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes glowPulse {
              0%, 100% { opacity: 0.6; transform: translate(-50%, 0) scale(1); }
              50% { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
            }
            @keyframes sparkle {
              0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
              50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
            }
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            @keyframes slideUp {
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes buttonPulse {
              0% { box-shadow: 0 4px 16px rgba(54,108,204,0.3), 0 1px 3px rgba(0,0,0,0.1); }
              50% { box-shadow: 0 4px 24px rgba(54,108,204,0.5), 0 1px 3px rgba(0,0,0,0.1); }
              100% { box-shadow: 0 4px 16px rgba(54,108,204,0.3), 0 1px 3px rgba(0,0,0,0.1); }
            }
          `}</style>
        </div>
      )}
    </section>
  )
}
