import { relations } from 'drizzle-orm'
import { int, mysqlTable, mysqlEnum, text, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { randomUUID } from 'crypto'
import { users } from './users'
import { questions } from './questions'

export const modules = mysqlTable('modules', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  difficulty: mysqlEnum('difficulty', ['Beginner', 'Intermediate', 'Advanced']).notNull(),
  category: mysqlEnum('category', ['History', 'Science', 'Art & Culture', 'General']).notNull(),
  status: mysqlEnum('status', ['published', 'draft', 'pending']).default('draft').notNull(),
  authorId: varchar('authorId', { length: 36 }).references(() => users.id),
  estimatedTime: varchar('estimatedTime', { length: 50 }),
  participants: int('participants').default(0).notNull(),
  avgScore: int('avgScore').default(0).notNull(),
  views: int('views').default(0).notNull(),
  rating: int('rating'),
  badges: int('badges').default(0).notNull(),
  color: varchar('color', { length: 50 }),
  accentColor: varchar('accentColor', { length: 50 }),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const moduleCards = mysqlTable('module_cards', {
  id: int('id').primaryKey().autoincrement(),
  moduleId: int('moduleId').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  type: mysqlEnum('type', ['content', 'question', 'achievement']).notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  content: text('content'),
  icon: varchar('icon', { length: 100 }),
  image: text('image'),
  sortOrder: int('sortOrder').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const modulesRelations = relations(modules, ({ many, one }) => ({
  author: one(users, {
    fields: [modules.authorId],
    references: [users.id],
  }),
  cards: many(moduleCards),
}))

export const moduleCardsRelations = relations(moduleCards, ({ one, many }) => ({
  module: one(modules, {
    fields: [moduleCards.moduleId],
    references: [modules.id],
  }),
  questions: many(questions),
}))
