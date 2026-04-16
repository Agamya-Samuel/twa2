import { relations } from 'drizzle-orm'
import { int, mysqlTable, mysqlEnum, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { users } from './users'
import { learningPaths } from '@/db/schema/learning-paths'
import { modules } from './modules'

export const userLearningPathProgress = mysqlTable('user_learning_path_progress', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('userId', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  learningPathId: int('learningPathId').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  status: mysqlEnum('status', ['not_started', 'in_progress', 'completed']).default('not_started').notNull(),
  completedAt: timestamp('completedAt', { mode: 'date', fsp: 3 }),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const userLearningPathModuleProgress = mysqlTable('user_learning_path_module_progress', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('userId', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  learningPathId: int('learningPathId').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  moduleId: int('moduleId').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  status: mysqlEnum('status', ['not_started', 'in_progress', 'completed']).default('not_started').notNull(),
  currentCardIndex: int('currentCardIndex').default(0).notNull(),
  score: int('score'),
  completedAt: timestamp('completedAt', { mode: 'date', fsp: 3 }),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const userLearningPathProgressRelations = relations(userLearningPathProgress, ({ one }) => ({
  user: one(users, { fields: [userLearningPathProgress.userId], references: [users.id] }),
  learningPath: one(learningPaths, { fields: [userLearningPathProgress.learningPathId], references: [learningPaths.id] }),
}))

export const userLearningPathModuleProgressRelations = relations(userLearningPathModuleProgress, ({ one }) => ({
  user: one(users, { fields: [userLearningPathModuleProgress.userId], references: [users.id] }),
  learningPath: one(learningPaths, { fields: [userLearningPathModuleProgress.learningPathId], references: [learningPaths.id] }),
  module: one(modules, { fields: [userLearningPathModuleProgress.moduleId], references: [modules.id] }),
}))
