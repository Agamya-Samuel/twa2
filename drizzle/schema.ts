import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, varchar, text, int, unique, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const accounts = mysqlTable("accounts", {
	id: varchar({ length: 36 }).notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	type: varchar({ length: 50 }).notNull(),
	provider: varchar({ length: 50 }).notNull(),
	providerAccountId: varchar({ length: 255 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: int("expires_at"),
	tokenType: varchar("token_type", { length: 50 }),
	scope: text(),
	idToken: text("id_token"),
	sessionState: varchar("session_state", { length: 100 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "accounts_id"}),
]);

export const achievements = mysqlTable("achievements", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 256 }).notNull(),
	description: text().notNull(),
	icon: varchar({ length: 100 }).notNull(),
	requirementType: mysqlEnum(['modules_completed','perfect_quizzes','streak_days','friends_count','points_total','learning_paths_completed']).notNull(),
	requirementValue: int().notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "achievements_id"}),
	unique("achievements_name_unique").on(table.name),
]);

export const activityLogs = mysqlTable("activity_logs", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	activityType: mysqlEnum(['module_started','module_completed','quiz_answered','achievement_unlocked']).notNull(),
	moduleId: int().references(() => modules.id, { onDelete: "set null" } ),
	pointsEarned: int().default(0).notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "activity_logs_id"}),
]);

export const certificates = mysqlTable("certificates", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 256 }).notNull(),
	description: text().notNull(),
	image: text(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "certificates_id"}),
]);

export const friendships = mysqlTable("friendships", {
	id: int().autoincrement().notNull(),
	requesterId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	receiverId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	status: mysqlEnum(['pending','accepted']).default('pending').notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "friendships_id"}),
]);

export const learningPathModules = mysqlTable("learning_path_modules", {
	id: int().autoincrement().notNull(),
	learningPathId: int().notNull().references(() => learningPaths.id, { onDelete: "cascade" } ),
	moduleId: int().notNull().references(() => modules.id, { onDelete: "cascade" } ),
	sortOrder: int().default(0).notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "learning_path_modules_id"}),
]);

export const learningPaths = mysqlTable("learning_paths", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 256 }).notNull(),
	description: text().notNull(),
	coverImage: text(),
	difficulty: mysqlEnum(['Beginner','Intermediate','Advanced']).notNull(),
	estimatedTime: varchar({ length: 50 }),
	prerequisites: text(),
	isSequential: tinyint().default(0).notNull(),
	status: mysqlEnum(['published','draft','pending']).default('draft').notNull(),
	authorId: varchar({ length: 36 }).notNull().references(() => users.id),
	certificateId: int(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "learning_paths_id"}),
]);

export const moduleCards = mysqlTable("module_cards", {
	id: int().autoincrement().notNull(),
	moduleId: int().notNull().references(() => modules.id, { onDelete: "cascade" } ),
	type: mysqlEnum(['content','question','achievement']).notNull(),
	title: varchar({ length: 256 }).notNull(),
	content: text(),
	icon: varchar({ length: 100 }),
	image: text(),
	sortOrder: int().default(0).notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "module_cards_id"}),
]);

export const moduleProposals = mysqlTable("module_proposals", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 256 }).notNull(),
	description: text(),
	proposerId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	category: mysqlEnum(['History','Science','Art & Culture','General']).notNull(),
	votes: int().default(0).notNull(),
	status: mysqlEnum(['pending','approved','rejected']).default('pending').notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "module_proposals_id"}),
]);

export const modules = mysqlTable("modules", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 256 }).notNull(),
	description: text(),
	difficulty: mysqlEnum(['Beginner','Intermediate','Advanced']).notNull(),
	category: mysqlEnum(['History','Science','Art & Culture','General']).notNull(),
	status: mysqlEnum(['published','draft','pending']).default('draft').notNull(),
	authorId: varchar({ length: 36 }).references(() => users.id),
	estimatedTime: varchar({ length: 50 }),
	participants: int().default(0).notNull(),
	avgScore: int().default(0).notNull(),
	views: int().default(0).notNull(),
	rating: int(),
	badges: int().default(0).notNull(),
	color: varchar({ length: 50 }),
	accentColor: varchar({ length: 50 }),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "modules_id"}),
]);

export const proposalVotes = mysqlTable("proposal_votes", {
	id: int().autoincrement().notNull(),
	proposalId: int().notNull().references(() => moduleProposals.id, { onDelete: "cascade" } ),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "proposal_votes_id"}),
]);

export const questionOptions = mysqlTable("question_options", {
	id: int().autoincrement().notNull(),
	questionId: int().notNull().references(() => questions.id, { onDelete: "cascade" } ),
	optionText: varchar({ length: 256 }).notNull(),
	sortOrder: int().default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "question_options_id"}),
]);

export const questions = mysqlTable("questions", {
	id: int().autoincrement().notNull(),
	cardId: int().notNull().references(() => moduleCards.id, { onDelete: "cascade" } ),
	question: text().notNull(),
	type: mysqlEnum(['multiple-choice','true-false','text']).notNull(),
	correctAnswer: varchar({ length: 500 }).notNull(),
	explanation: text().notNull(),
	hint: text(),
	sortOrder: int().default(0).notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "questions_id"}),
]);

export const sessions = mysqlTable("sessions", {
	sessionToken: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	expires: timestamp({ fsp: 3, mode: 'string' }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.sessionToken], name: "sessions_sessionToken"}),
]);

export const userAchievements = mysqlTable("user_achievements", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	achievementId: int().notNull().references(() => achievements.id, { onDelete: "cascade" } ),
	unlockedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_achievements_id"}),
]);

export const userAnswers = mysqlTable("user_answers", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	questionId: int().notNull().references(() => questions.id, { onDelete: "cascade" } ),
	answer: varchar({ length: 500 }).notNull(),
	isCorrect: tinyint().default(0).notNull(),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_answers_id"}),
]);

export const userCertificates = mysqlTable("user_certificates", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	certificateId: int().notNull().references(() => certificates.id, { onDelete: "cascade" } ),
	awardedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_certificates_id"}),
]);

export const userLearningPathModuleProgress = mysqlTable("user_learning_path_module_progress", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	learningPathId: int().notNull(),
	moduleId: int().notNull(),
	status: mysqlEnum(['not_started','in_progress','completed']).default('not_started').notNull(),
	currentCardIndex: int().default(0).notNull(),
	score: int(),
	completedAt: timestamp({ fsp: 3, mode: 'string' }),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_learning_path_module_progress_id"}),
]);

export const userLearningPathProgress = mysqlTable("user_learning_path_progress", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull(),
	learningPathId: int().notNull(),
	status: mysqlEnum(['not_started','in_progress','completed']).default('not_started').notNull(),
	completedAt: timestamp({ fsp: 3, mode: 'string' }),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_learning_path_progress_id"}),
]);

export const userModuleProgress = mysqlTable("user_module_progress", {
	id: int().autoincrement().notNull(),
	userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	moduleId: int().notNull().references(() => modules.id, { onDelete: "cascade" } ),
	status: mysqlEnum(['not_started','in_progress','completed']).default('not_started').notNull(),
	currentCardIndex: int().default(0).notNull(),
	score: int(),
	completedAt: timestamp({ fsp: 3, mode: 'string' }),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_module_progress_id"}),
]);

export const users = mysqlTable("users", {
	id: varchar({ length: 36 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }),
	image: varchar({ length: 500 }),
	bio: text(),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	totalPoints: int().default(0).notNull(),
	rank: int(),
	currentStreak: int().default(0).notNull(),
	longestStreak: int().default(0).notNull(),
	emailVerified: timestamp({ fsp: 3, mode: 'string' }),
	createdAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp({ fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("users_email_unique").on(table.email),
]);
