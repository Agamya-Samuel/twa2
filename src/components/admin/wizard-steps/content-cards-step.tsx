'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Plus, Trash2, GripVertical, FileText } from 'lucide-react'
import type { ModuleFormData, ModuleCardFormData } from '@/types/module'

interface ContentCardsStepProps {
  data: ModuleFormData
  updateData: (data: Partial<ModuleFormData>) => void
  errors?: Record<string, string>
}

export function ContentCardsStep({ data, updateData, errors }: ContentCardsStepProps) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  const contentCards = data.cards.filter((c) => c.type === 'content')

  const handleAddCard = () => {
    const newCard: ModuleCardFormData = {
      type: 'content',
      title: `New Content Card ${contentCards.length + 1}`,
      content: '',
      icon: 'file-text',
      image: null,
      sortOrder: data.cards.length,
    }
    updateData({ cards: [...data.cards, newCard] })
    setActiveCardIndex(contentCards.length)
  }

  const handleUpdateCard = (index: number, updates: Partial<ModuleCardFormData>) => {
    // We need to map the filtered index back to the full array index
    const activeCard = contentCards[index]
    const fullIndex = data.cards.findIndex(c => c === activeCard)
    
    if (fullIndex !== -1) {
      const newCards = [...data.cards]
      newCards[fullIndex] = { ...newCards[fullIndex], ...updates }
      updateData({ cards: newCards })
    }
  }

  const handleDeleteCard = (index: number) => {
    const activeCard = contentCards[index]
    updateData({
      cards: data.cards.filter(c => c !== activeCard)
    })
    if (activeCardIndex === index) {
      setActiveCardIndex(null)
    } else if (activeCardIndex !== null && activeCardIndex > index) {
      setActiveCardIndex(activeCardIndex - 1)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border-muted overflow-hidden flex flex-col h-[500px]">
        <CardHeader className="bg-muted/30 py-4 border-b">
          <CardTitle className="text-sm font-medium flex justify-between items-center">
            Cards List
            <Button size="sm" variant="outline" className="h-7 px-2" onClick={handleAddCard}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {contentCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <FileText className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No content cards yet.</p>
              <Button variant="link" size="sm" onClick={handleAddCard}>Create your first card</Button>
            </div>
          ) : (
            <ul className="divide-y">
              {contentCards.map((card, idx) => (
                <li 
                  key={idx}
                  className={`group flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeCardIndex === idx ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                  onClick={() => setActiveCardIndex(idx)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground opacity-50 cursor-grab" />
                  <div className="flex-1 truncate text-sm font-medium">
                    {card.title || 'Untitled Card'}
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

      <Card className="md:col-span-2 border-muted h-[500px] overflow-y-auto">
        {activeCardIndex !== null && contentCards[activeCardIndex] ? (() => {
          const activeFullIndex = data.cards.findIndex(c => c === contentCards[activeCardIndex])
          
          return (
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="card-title" className={errors?.[`cards.${activeFullIndex}.title`] ? "text-destructive" : ""}>Card Title</Label>
                <Input 
                  id="card-title"
                  value={contentCards[activeCardIndex].title}
                  onChange={(e) => handleUpdateCard(activeCardIndex, { title: e.target.value })}
                  placeholder="Title of this specific content card"
                  className={errors?.[`cards.${activeFullIndex}.title`] ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors?.[`cards.${activeFullIndex}.title`] && (
                  <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.title`]}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="card-icon">Icon Name (lucide-react)</Label>
                <Input 
                  id="card-icon"
                  value={contentCards[activeCardIndex].icon}
                  onChange={(e) => handleUpdateCard(activeCardIndex, { icon: e.target.value })}
                  placeholder="e.g. book, star, flag"
                />
              </div>

              <div className="grid gap-2">
                <Label className={errors?.[`cards.${activeFullIndex}.content`] ? "text-destructive" : ""}>Content</Label>
                <div className={errors?.[`cards.${activeFullIndex}.content`] ? "border border-destructive rounded-md overflow-hidden" : ""}>
                  <RichTextEditor 
                    value={contentCards[activeCardIndex].content}
                    onChange={(content) => handleUpdateCard(activeCardIndex, { content })}
                    placeholder="Write the learning content here..."
                    className="min-h-[250px]"
                  />
                </div>
                {errors?.[`cards.${activeFullIndex}.content`] && (
                  <p className="text-sm text-destructive">{errors[`cards.${activeFullIndex}.content`]}</p>
                )}
              </div>
            </CardContent>
          )
        })() : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground bg-muted/10">
            <p>Select a card from the list or create a new one to start editing.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
