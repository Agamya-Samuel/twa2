'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Award,
  Star,
  Users,
  Lock,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface ModuleQuestion {
  id: number
  question: string
  type: 'multiple-choice' | 'true-false' | 'text'
  options?: string[]
  correctAnswer: string | number
  explanation: string
  hint: string
}

interface ModuleCard {
  id: number
  type: 'content' | 'question' | 'achievement'
  title: string
  content: string
  icon?: string
  image?: string
  questions?: ModuleQuestion[]
}

const MOCK_MODULE = {
  id: '1',
  title: 'Ancient Egypt',
  description: 'Discover the mysteries of pharaohs, pyramids, and hieroglyphics',
  totalCards: 8,
  userProgress: 3,
  difficulty: 'Beginner',
  estimatedTime: '15 mins',
  participants: 2543,
  rating: 4.8,
  badges: 5,
  cards: [
    {
      id: 1,
      type: 'content' as const,
      title: 'The Rise of Egypt',
      content: 'Ancient Egypt emerged around 3100 BCE with the unification of Upper and Lower Egypt under Pharaoh Narmer. This marked the beginning of the Early Dynastic Period and the formation of one of the world\'s greatest civilizations.',
      icon: '🏛️',
    },
    {
      id: 2,
      type: 'question' as const,
      title: 'Knowledge Check',
      content: 'Test your understanding of Egyptian history',
      questions: [
        {
          id: 1,
          question: 'In what year was Upper and Lower Egypt unified?',
          type: 'multiple-choice',
          options: ['2000 BCE', '3100 BCE', '1500 BCE', '4000 BCE'],
          correctAnswer: 1,
          explanation: 'Upper and Lower Egypt were unified around 3100 BCE under Pharaoh Narmer, marking the beginning of the Early Dynastic Period.',
          hint: 'Think about the earliest dynasty of Egypt',
        },
        {
          id: 2,
          question: 'Pharaohs were considered divine rulers.',
          type: 'true-false',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'Yes, Pharaohs were viewed as divine or semi-divine figures, which reinforced their authority and justified their power.',
          hint: 'Consider how Egyptian society viewed their rulers',
        },
      ],
    },
    {
      id: 3,
      type: 'content' as const,
      title: 'The Pyramids of Giza',
      content: 'The Great Pyramid of Khufu is one of the Seven Wonders of the Ancient World. Built as a tomb for the pharaoh, it contains approximately 2.3 million limestone blocks, each weighing 2.5 tons on average. The pyramid stood as the world\'s tallest structure for 3,800 years.',
      icon: '🔺',
    },
    {
      id: 4,
      type: 'achievement' as const,
      title: 'Pyramid Builder',
      content: 'Congratulations! You\'ve completed the first half of this module. You\'re on your way to becoming an Egyptian history expert!',
      icon: '🏆',
    },
  ],
}

export function ModulePlayScreen({ moduleId }: { moduleId: string }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: number]: number | string }>({})
  const [showHint, setShowHint] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | string }>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const module = MOCK_MODULE
  const currentCard = module.cards[currentCardIndex]
  const progressPercentage = ((currentCardIndex + 1) / module.totalCards) * 100

  const handleNextCard = () => {
    if (currentCardIndex < module.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowHint(false)
      setShowExplanation(false)
      setCurrentQuestionIndex(0)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowHint(false)
      setShowExplanation(false)
    }
  }

  const handleAnswerQuestion = (questionId: number, answer: number | string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer })
  }

  const handleSubmitAnswer = (question: ModuleQuestion) => {
    if (selectedAnswers[question.id] === question.correctAnswer) {
      setAnsweredQuestions({ ...answeredQuestions, [question.id]: 1 })
    }
    setShowExplanation(true)
  }

  const isAnswerCorrect = (question: ModuleQuestion) => {
    return answeredQuestions[question.id] === 1
  }

  return (
    <section className="w-full bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground">{module.title}</h1>
              <p className="text-foreground/60">Card {currentCardIndex + 1} of {module.totalCards}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">{module.estimatedTime}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-foreground/60">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Module Stats */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-foreground/60">Difficulty</p>
              <p className="text-sm font-semibold">{module.difficulty}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-secondary" />
                <p className="text-xs text-foreground/60">Learners</p>
              </div>
              <p className="text-sm font-semibold">{module.participants}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                <p className="text-xs text-foreground/60">Rating</p>
              </div>
              <p className="text-sm font-semibold">{module.rating}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-secondary" />
                <p className="text-xs text-foreground/60">Badges</p>
              </div>
              <p className="text-sm font-semibold">{module.badges}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="mb-8 overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2">
              {currentCard.type === 'content' && '📖'}
              {currentCard.type === 'question' && '❓'}
              {currentCard.type === 'achievement' && '🏆'}
              {currentCard.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Content Card */}
            {currentCard.type === 'content' && (
              <div className="space-y-4">
                {currentCard.icon && (
                  <div className="text-6xl">{currentCard.icon}</div>
                )}
                <p className="text-lg leading-relaxed text-foreground/80">
                  {currentCard.content}
                </p>
              </div>
            )}

            {/* Question Card */}
            {currentCard.type === 'question' && currentCard.questions && (
              <div className="space-y-6">
                {currentCard.questions.map((question, index) => (
                  <div key={question.id} className="space-y-4 border-b border-border pb-6 last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Question {index + 1}: {question.question}
                      </h3>
                      {isAnswerCorrect(question) && (
                        <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0" />
                      )}
                    </div>

                    {/* Multiple Choice Options */}
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerQuestion(question.id, optionIndex)}
                            disabled={answeredQuestions[question.id] === 1}
                            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                              selectedAnswers[question.id] === optionIndex
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            } ${
                              answeredQuestions[question.id] === 1
                                ? 'opacity-60 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <p className="font-medium">{option}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* True/False Options */}
                    {question.type === 'true-false' && (
                      <div className="grid gap-2 grid-cols-2">
                        {['True', 'False'].map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerQuestion(question.id, optionIndex)}
                            disabled={answeredQuestions[question.id] === 1}
                            className={`rounded-lg border-2 p-4 font-semibold transition-all ${
                              selectedAnswers[question.id] === optionIndex
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border hover:border-primary/50'
                            } ${
                              answeredQuestions[question.id] === 1
                                ? 'opacity-60 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Hint Button */}
                    {!answeredQuestions[question.id] && !showHint && (
                      <button
                        onClick={() => setShowHint(true)}
                        className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Need a hint?
                      </button>
                    )}

                    {/* Hint Display */}
                    {showHint && !answeredQuestions[question.id] && (
                      <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-4">
                        <p className="text-sm font-medium text-secondary">💡 Hint: {question.hint}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    {!answeredQuestions[question.id] && selectedAnswers[question.id] !== undefined && (
                      <Button
                        onClick={() => handleSubmitAnswer(question)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Check Answer
                      </Button>
                    )}

                    {/* Explanation */}
                    {answeredQuestions[question.id] !== undefined && (
                      <div className={`rounded-lg p-4 ${
                        isAnswerCorrect(question)
                          ? 'border border-secondary/30 bg-secondary/10'
                          : 'border border-primary/30 bg-primary/10'
                      }`}>
                        <p className="text-sm font-medium mb-2">
                          {isAnswerCorrect(question) ? '✓ Correct!' : '✗ Incorrect'}
                        </p>
                        <p className="text-sm text-foreground/80">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Achievement Card */}
            {currentCard.type === 'achievement' && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="text-8xl">{currentCard.icon}</div>
                <h3 className="text-2xl font-bold text-foreground">{currentCard.title}</h3>
                <p className="text-lg text-foreground/70">{currentCard.content}</p>
                <Button className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Keep Learning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>

          <div className="text-sm text-foreground/60 text-center">
            {currentCardIndex + 1} / {module.totalCards}
          </div>

          <Button
            onClick={handleNextCard}
            disabled={currentCardIndex === module.cards.length - 1}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
