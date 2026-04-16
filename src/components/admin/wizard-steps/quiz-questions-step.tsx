'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ModuleFormData, ModuleCardFormData, QuestionFormData } from '@/types/module'

interface QuizQuestionsStepProps {
  data: ModuleFormData
  updateData: (data: Partial<ModuleFormData>) => void
  errors?: Record<string, string>
}

export function QuizQuestionsStep({ data, updateData, errors }: QuizQuestionsStepProps) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  const quizCards = data.cards.filter((c) => c.type === 'question')

  const handleAddCard = () => {
    const newCard: ModuleCardFormData = {
      type: 'question',
      title: `Quiz Set ${quizCards.length + 1}`,
      content: 'Answer the following questions to test your knowledge.',
      icon: 'help-circle',
      image: null,
      sortOrder: data.cards.length,
      questions: []
    }
    updateData({ cards: [...data.cards, newCard] })
    setActiveCardIndex(quizCards.length)
  }

  const handleUpdateCard = (index: number, updates: Partial<ModuleCardFormData>) => {
    const activeCard = quizCards[index]
    const fullIndex = data.cards.findIndex(c => c === activeCard)
    
    if (fullIndex !== -1) {
      const newCards = [...data.cards]
      newCards[fullIndex] = { ...newCards[fullIndex], ...updates }
      updateData({ cards: newCards })
    }
  }

  const handleDeleteCard = (index: number) => {
    const activeCard = quizCards[index]
    updateData({
      cards: data.cards.filter(c => c !== activeCard)
    })
    if (activeCardIndex === index) {
      setActiveCardIndex(null)
    } else if (activeCardIndex !== null && activeCardIndex > index) {
      setActiveCardIndex(activeCardIndex - 1)
    }
  }

  const handleAddQuestion = (cardIndex: number) => {
    const card = quizCards[cardIndex]
    const questions = card.questions || []
    const newQuestion: QuestionFormData = {
      question: 'New Question',
      type: 'multiple-choice',
      correctAnswer: '',
      explanation: '',
      hint: '',
      sortOrder: questions.length,
      options: [
        { optionText: 'Option A', sortOrder: 0 },
        { optionText: 'Option B', sortOrder: 1 },
      ]
    }
    
    handleUpdateCard(cardIndex, { questions: [...questions, newQuestion] })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border-muted overflow-hidden flex flex-col h-[600px]">
        <CardHeader className="bg-muted/30 py-4 border-b">
          <CardTitle className="text-sm font-medium flex justify-between items-center">
            Quiz Sets
            <Button size="sm" variant="outline" className="h-7 px-2" onClick={handleAddCard}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {quizCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <HelpCircle className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No quiz questions yet.</p>
              <Button variant="link" size="sm" onClick={handleAddCard}>Create a quiz set</Button>
            </div>
          ) : (
            <ul className="divide-y">
              {quizCards.map((card, idx) => (
                <li 
                  key={idx}
                  className={`group flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeCardIndex === idx ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                  onClick={() => setActiveCardIndex(idx)}
                >
                  <div className="truncate text-sm font-medium">
                    {card.title || 'Untitled Quiz'}
                    <div className="text-xs text-muted-foreground font-normal">
                      {(card.questions || []).length} questions
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCard(idx)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-muted h-[600px] overflow-y-auto">
        {activeCardIndex !== null && quizCards[activeCardIndex] ? (() => {
          const activeFullIndex = data.cards.findIndex(c => c === quizCards[activeCardIndex])
          const hasGeneralError = errors?.[`cards.${activeFullIndex}.general`]
          
          return (
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-2 mb-6">
                <Label htmlFor="quiz-title" className={errors?.[`cards.${activeFullIndex}.title`] ? "text-destructive" : ""}>Quiz Set Title</Label>
                <Input 
                  id="quiz-title"
                  value={quizCards[activeCardIndex].title}
                  onChange={(e) => handleUpdateCard(activeCardIndex, { title: e.target.value })}
                  className={errors?.[`cards.${activeFullIndex}.title`] ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors?.[`cards.${activeFullIndex}.title`] && (
                  <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.title`]}</p>
                )}
              </div>

            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
              <h3 className={cn("font-semibold text-sm", hasGeneralError ? "text-destructive" : "")}>
                Questions
              </h3>
              <div className="flex gap-2 items-center">
                {hasGeneralError && <span className="text-sm text-destructive font-medium">{errors?.[`cards.${activeFullIndex}.general`]}</span>}
                <Button size="sm" onClick={() => handleAddQuestion(activeCardIndex)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              {(quizCards[activeCardIndex].questions || []).map((q, qIdx) => (
                <div key={qIdx} className="border rounded-md p-4 space-y-4 bg-background">
                  <div className="flex justify-between items-start gap-4">
                    <div className="grid gap-2 flex-1">
                      <Label className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.question`] ? "text-destructive" : ""}>Question {qIdx + 1}</Label>
                      <Input 
                        value={q.question}
                        onChange={(e) => {
                          const newQs = [...(quizCards[activeCardIndex].questions || [])]
                          newQs[qIdx] = { ...q, question: e.target.value }
                          handleUpdateCard(activeCardIndex, { questions: newQs })
                        }}
                        className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.question`] ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors?.[`cards.${activeFullIndex}.questions.${qIdx}.question`] && (
                        <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.questions.${qIdx}.question`]}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive mt-6"
                      onClick={() => {
                        const newQs = [...(quizCards[activeCardIndex].questions || [])]
                        newQs.splice(qIdx, 1)
                        handleUpdateCard(activeCardIndex, { questions: newQs })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    <Label>Question Type</Label>
                    <Select 
                      value={q.type} 
                      onValueChange={(val: any) => {
                        const newQs = [...(quizCards[activeCardIndex].questions || [])]
                        newQs[qIdx] = { ...q, type: val }
                        handleUpdateCard(activeCardIndex, { questions: newQs })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True / False</SelectItem>
                        <SelectItem value="text">Short Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {q.type === 'multiple-choice' && (
                    <div className="space-y-3 bg-muted/20 p-3 rounded-md">
                      <Label className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.options`] ? "text-destructive" : ""}>Options</Label>
                      {errors?.[`cards.${activeFullIndex}.questions.${qIdx}.options`] && (
                        <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.questions.${qIdx}.options`]}</p>
                      )}
                      {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex flex-col gap-1 w-full">
                          <div className="flex items-center gap-2">
                            <Input 
                              value={opt.optionText}
                              onChange={(e) => {
                                const newQs = [...(quizCards[activeCardIndex].questions || [])]
                                const newOpts = [...(q.options || [])]
                                newOpts[optIdx] = { ...opt, optionText: e.target.value }
                                newQs[qIdx] = { ...q, options: newOpts }
                                handleUpdateCard(activeCardIndex, { questions: newQs })
                              }}
                              className={cn("flex-1", errors?.[`cards.${activeFullIndex}.questions.${qIdx}.options.${optIdx}`] ? "border-destructive focus-visible:ring-destructive" : "")}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const newQs = [...(quizCards[activeCardIndex].questions || [])]
                                const newOpts = [...(q.options || [])]
                                newOpts.splice(optIdx, 1)
                                newQs[qIdx] = { ...q, options: newOpts }
                                handleUpdateCard(activeCardIndex, { questions: newQs })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {errors?.[`cards.${activeFullIndex}.questions.${qIdx}.options.${optIdx}`] && (
                            <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.questions.${qIdx}.options.${optIdx}`]}</p>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const newQs = [...(quizCards[activeCardIndex].questions || [])]
                          const newOpts = [...(q.options || [])]
                          newOpts.push({ optionText: `Option ${newOpts.length + 1}`, sortOrder: newOpts.length })
                          newQs[qIdx] = { ...q, options: newOpts }
                          handleUpdateCard(activeCardIndex, { questions: newQs })
                        }}
                      >
                        Add Option
                      </Button>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.correctAnswer`] ? "text-destructive" : ""}>Correct Answer</Label>
                    {q.type === 'multiple-choice' ? (
                      <Select
                        value={q.correctAnswer}
                        onValueChange={(val: string) => {
                          const newQs = [...(quizCards[activeCardIndex].questions || [])]
                          newQs[qIdx] = { ...q, correctAnswer: val }
                          handleUpdateCard(activeCardIndex, { questions: newQs })
                        }}
                      >
                        <SelectTrigger className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.correctAnswer`] ? "border-destructive focus:ring-destructive" : ""}>
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          {(q.options || []).map((opt, optIdx) => {
                            const val = opt.optionText || `Option ${optIdx + 1}`
                            return (
                              <SelectItem key={optIdx} value={val}>
                                {val}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    ) : q.type === 'true-false' ? (
                      <Select
                        value={q.correctAnswer}
                        onValueChange={(val: string) => {
                          const newQs = [...(quizCards[activeCardIndex].questions || [])]
                          newQs[qIdx] = { ...q, correctAnswer: val }
                          handleUpdateCard(activeCardIndex, { questions: newQs })
                        }}
                      >
                        <SelectTrigger className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.correctAnswer`] ? "border-destructive focus:ring-destructive" : ""}>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="True">True</SelectItem>
                          <SelectItem value="False">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        placeholder="Enter exact correct answer"
                        value={q.correctAnswer}
                        onChange={(e) => {
                          const newQs = [...(quizCards[activeCardIndex].questions || [])]
                          newQs[qIdx] = { ...q, correctAnswer: e.target.value }
                          handleUpdateCard(activeCardIndex, { questions: newQs })
                        }}
                        className={errors?.[`cards.${activeFullIndex}.questions.${qIdx}.correctAnswer`] ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                    )}
                    {errors?.[`cards.${activeFullIndex}.questions.${qIdx}.correctAnswer`] && (
                      <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.questions.${qIdx}.correctAnswer`]}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Explanation (shown after answering)</Label>
                    <Textarea 
                      value={q.explanation}
                      onChange={(e) => {
                        const newQs = [...(quizCards[activeCardIndex].questions || [])]
                        newQs[qIdx] = { ...q, explanation: e.target.value }
                        handleUpdateCard(activeCardIndex, { questions: newQs })
                      }}
                      className="resize-none"
                    />
                  </div>
                </div>
              ))}
              
              {(quizCards[activeCardIndex].questions || []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                  Click 'Add Question' to build this quiz
                </div>
              )}
            </div>
            </CardContent>
          )
        })() : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground bg-muted/10">
            <p>Select a quiz set or create a new one to start adding questions.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
