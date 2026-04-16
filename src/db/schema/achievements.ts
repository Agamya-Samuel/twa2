import { relations } from 'drizzle-orm'
import { int, mysqlTable, mysqlEnum, text, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { randomUUID } from 'crypto'
import { users } from './users'

export const achievements = mysqlTable('achievements', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  requirementType: mysqlEnum('requirementType', ['modules_completed', 'perfect_quizzes', 'streak_days', 'friends_count', 'points_total', 'learning_paths_completed']).notNull(),
  requirementValue: int('requirementValue').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const userAchievements = mysqlTable('user_achievements', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('userId', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: int('achievementId').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlockedAt', { mode: 'date', fsp: 3 }).defaultNow().notNull(),
})

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}))

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}))
