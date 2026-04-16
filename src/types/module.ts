// Module type definitions for the admin module creation flow

export type ModuleDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type ModuleCategory = 'History' | 'Science' | 'Art & Culture' | 'General'
export type ModuleStatus = 'published' | 'draft' | 'pending'
export type CardType = 'content' | 'question' | 'achievement'
export type QuestionType = 'multiple-choice' | 'true-false' | 'text'

export interface Module {
  id: number
  title: string
  description: string
  difficulty: ModuleDifficulty
  category: ModuleCategory
  status: ModuleStatus
  authorId: string
  author?: ModuleAuthor
  estimatedTime: string
  participants: number
  avgScore: number
  views: number
  rating: number
  badges: number
  color: string
  accentColor: string
  createdAt: Date
  updatedAt: Date
  cards?: ModuleCard[]
}

export interface ModuleAuthor {
  id: string
  name: string
  email: string
  image?: string | null
}

export interface ModuleCard {
  id: number
  moduleId: number
  type: CardType
  title: string
  content: string
  icon: string
  image: string | null
  sortOrder: number
  createdAt: Date
  questions?: Question[]
}

export interface Question {
  id: number
  cardId: number
  question: string
  type: QuestionType
  correctAnswer: string
  explanation: string
  hint: string
  sortOrder: number
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: number
  questionId: number
  optionText: string
  sortOrder: number
}

// Form data types for module creation
export interface ModuleFormData {
  // Basic info
  title: string
  description: string
  difficulty: ModuleDifficulty
  category: ModuleCategory
  estimatedTime: string
  color: string
  accentColor: string

  // Cards
  cards: ModuleCardFormData[]
}

export interface ModuleCardFormData {
  type: CardType
  title: string
  content: string
  icon: string
  image: string | null
  sortOrder: number
  questions?: QuestionFormData[]
}

export interface QuestionFormData {
  question: string
  type: QuestionType
  correctAnswer: string
  explanation: string
  hint: string
  sortOrder: number
  options?: QuestionOptionFormData[]
}

export interface QuestionOptionFormData {
  optionText: string
  sortOrder: number
}

// API request/response types
export interface CreateModuleRequest {
  title: string
  description: string
  difficulty: ModuleDifficulty
  category: ModuleCategory
  estimatedTime: string
  color: string
  accentColor: string
  status?: ModuleStatus
}

export interface UpdateModuleRequest {
  title?: string
  description?: string
  difficulty?: ModuleDifficulty
  category?: ModuleCategory
  estimatedTime?: string
  color?: string
  accentColor?: string
  status?: ModuleStatus
}

export interface CreateCardRequest {
  moduleId: number
  type: CardType
  title: string
  content: string
  icon: string
  image: string | null
  sortOrder: number
}

export interface UpdateCardRequest {
  title?: string
  content?: string
  icon?: string
  image?: string | null
  sortOrder?: number
}

export interface CreateQuestionRequest {
  cardId: number
  question: string
  type: QuestionType
  correctAnswer: string
  explanation: string
  hint: string
  sortOrder: number
  options?: CreateQuestionOptionRequest[]
}

export interface CreateQuestionOptionRequest {
  optionText: string
  sortOrder: number
}

export interface PublishModuleRequest {
  status: 'published'
}

// Module filter types
export interface ModuleFilters {
  status?: ModuleStatus | 'all'
  category?: ModuleCategory
  difficulty?: ModuleDifficulty
  search?: string
}
