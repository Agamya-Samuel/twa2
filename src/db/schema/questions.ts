import { relations } from 'drizzle-orm'
import { int, mysqlTable, mysqlEnum, text, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { moduleCards } from './modules'

export const questions = mysqlTable('questions', {
  id: int('id').primaryKey().autoincrement(),
  cardId: int('cardId').notNull().references(() => moduleCards.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  type: mysqlEnum('type', ['multiple-choice', 'true-false', 'text']).notNull(),
  correctAnswer: varchar('correctAnswer', { length: 500 }).notNull(),
  explanation: text('explanation').notNull(),
  hint: text('hint'),
  sortOrder: int('sortOrder').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const questionOptions = mysqlTable('question_options', {
  id: int('id').primaryKey().autoincrement(),
  questionId: int('questionId').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  optionText: varchar('optionText', { length: 256 }).notNull(),
  sortOrder: int('sortOrder').default(0).notNull(),
})

export const questionsRelations = relations(questions, ({ one, many }) => ({
  card: one(moduleCards, {
    fields: [questions.cardId],
    references: [moduleCards.id],
  }),
  options: many(questionOptions),
}))

export const questionOptionsRelations = relations(questionOptions, ({ one }) => ({
  question: one(questions, {
    fields: [questionOptions.questionId],
    references: [questions.id],
  }),
}))
