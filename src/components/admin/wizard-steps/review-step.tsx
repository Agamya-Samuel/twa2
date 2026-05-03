'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, HelpCircle, Award, Clock, Users, Star } from 'lucide-react'
import type { ModuleFormData } from '@/types/module'

interface ReviewStepProps {
  data: ModuleFormData
}

export function ReviewStep({ data }: ReviewStepProps) {
  const contentCount = data.cards.filter(c => c.type === 'content').length
  const quizCount = data.cards.filter(c => c.type === 'question').length
  const totalQuestions = data.cards
    .filter(c => c.type === 'question')
    .reduce((acc, card) => acc + (card.questions?.length || 0), 0)
  const achievementCount = data.cards.filter(c => c.type === 'achievement').length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">Review your module structure before publishing to the live database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2 bg-background">
                  {data.category}
                </Badge>
                <CardTitle className="text-2xl">{data.title || 'Untitled Module'}</CardTitle>
                <CardDescription className="mt-2 text-base text-foreground/80 line-clamp-3">
                  {data.description || 'No description provided.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                <Star className="h-4 w-4" /> {data.difficulty}
              </div>
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                <Clock className="h-4 w-4" /> {data.estimatedTime || 'N/A'}
              </div>
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                <div 
                  className="w-4 h-4 rounded-full border border-border" 
                  style={{ backgroundColor: data.color }} 
                /> Theme
              </div>
            </div>

            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Module Structure</h4>
            
            <div className="space-y-4">
              {data.cards.map((card, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border rounded-md bg-card">
                  <div className="bg-muted p-2 rounded-md shrink-0">
                    {card.type === 'content' && <FileText className="h-5 w-5 text-blue-500" />}
                    {card.type === 'question' && <HelpCircle className="h-5 w-5 text-orange-500" />}
                    {card.type === 'achievement' && <Award className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div>
                    <h5 className="font-medium text-sm leading-none pt-1">
                      {idx + 1}. {card.title}
                    </h5>
                    {card.type === 'question' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {(card.questions || []).length} questions
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-auto capitalize text-xs">
                    {card.type}
                  </Badge>
                </div>
              ))}
              
              {data.cards.length === 0 && (
                <p className="text-center py-4 text-muted-foreground text-sm border border-dashed rounded-md">
                  No cards added to this module yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Content Cards</span>
                <span className="font-semibold text-lg">{contentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quiz Sets</span>
                <span className="font-semibold text-lg">{quizCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-semibold text-lg">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Achievements</span>
                <span className="font-semibold text-lg">{achievementCount}</span>
              </div>
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Steps</span>
                  <span className="font-bold text-2xl text-primary">{data.cards.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg border border-blue-200 dark:border-blue-900 text-sm">
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Award className="h-4 w-4" /> Ready to go live
            </h4>
            <p>Publishing this module will make it immediately available to all users in the application.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
