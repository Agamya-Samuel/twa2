'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, RequiredLabel } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Award } from 'lucide-react'
import type { ModuleFormData, ModuleCardFormData } from '@/types/module'

interface AchievementsStepProps {
  data: ModuleFormData
  updateData: (data: Partial<ModuleFormData>) => void
  errors?: Record<string, string>
}

export function AchievementsStep({ data, updateData, errors }: AchievementsStepProps) {
  const achievementCards = data.cards.filter((c) => c.type === 'achievement')

  const handleAddAchievement = () => {
    const newCard: ModuleCardFormData = {
      type: 'achievement',
      title: 'Module Completion Badge',
      content: 'Congratulations on completing this module!',
      icon: 'award',
      image: null,
      sortOrder: data.cards.length,
    }
    updateData({ cards: [...data.cards, newCard] })
  }

  const handleUpdateAchievement = (index: number, updates: Partial<ModuleCardFormData>) => {
    const activeCard = achievementCards[index]
    const fullIndex = data.cards.findIndex(c => c === activeCard)
    
    if (fullIndex !== -1) {
      const newCards = [...data.cards]
      newCards[fullIndex] = { ...newCards[fullIndex], ...updates }
      updateData({ cards: newCards })
    }
  }

  const handleDeleteAchievement = (index: number) => {
    const activeCard = achievementCards[index]
    updateData({
      cards: data.cards.filter(c => c !== activeCard)
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Achievements & Milestones</h2>
          <p className="text-muted-foreground text-sm">Reward learners when they reach the end of the module.</p>
        </div>
        <Button onClick={handleAddAchievement}>
          <Plus className="h-4 w-4 mr-2" /> Add Achievement
        </Button>
      </div>

      {achievementCards.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Award className="h-12 w-12 mb-4 opacity-20" />
            <p>No achievements added yet.</p>
            <p className="text-sm">Adding an achievement card will give users a shiny badge upon completion.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {achievementCards.map((card, index) => {
            const fullIndex = data.cards.findIndex(c => c === card)
            return (
              <Card key={index} className="overflow-hidden border-2 border-primary/20">
                <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
                  <div className="font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Achievement #{index + 1}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteAchievement(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid gap-2">
                    <RequiredLabel required className={errors?.[`cards.${fullIndex}.title`] ? "text-destructive" : ""}>Badge Title</RequiredLabel>
                    <Input 
                      value={card.title}
                      onChange={(e) => handleUpdateAchievement(index, { title: e.target.value })}
                      placeholder="e.g. Master Historian"
                      className={errors?.[`cards.${fullIndex}.title`] ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors?.[`cards.${fullIndex}.title`] && (
                      <p className="text-sm text-destructive">{errors[`cards.${fullIndex}.title`]}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Congratulatory Message</Label>
                    <Textarea 
                      value={card.content}
                      onChange={(e) => handleUpdateAchievement(index, { content: e.target.value })}
                      placeholder="Message shown when they earn this badge..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <RequiredLabel required className={errors?.[`cards.${fullIndex}.icon`] ? "text-destructive" : ""}>Icon Name (lucide-react)</RequiredLabel>
                    <Input 
                      value={card.icon}
                      onChange={(e) => handleUpdateAchievement(index, { icon: e.target.value })}
                      placeholder="e.g. award, star, trohpy"
                      className={errors?.[`cards.${fullIndex}.icon`] ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors?.[`cards.${fullIndex}.icon`] && (
                      <p className="text-sm text-destructive">{errors[`cards.${fullIndex}.icon`]}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
