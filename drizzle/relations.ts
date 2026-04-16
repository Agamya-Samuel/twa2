import { relations } from "drizzle-orm/relations";
import { users, accounts, modules, activityLogs, friendships, learningPaths, learningPathModules, moduleCards, moduleProposals, proposalVotes, questions, questionOptions, sessions, achievements, userAchievements, userAnswers, certificates, userCertificates, userLearningPathModuleProgress, userModuleProgress } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	activityLogs: many(activityLogs),
	friendships_receiverId: many(friendships, {
		relationName: "friendships_receiverId_users_id"
	}),
	friendships_requesterId: many(friendships, {
		relationName: "friendships_requesterId_users_id"
	}),
	learningPaths: many(learningPaths),
	moduleProposals: many(moduleProposals),
	modules: many(modules),
	proposalVotes: many(proposalVotes),
	sessions: many(sessions),
	userAchievements: many(userAchievements),
	userAnswers: many(userAnswers),
	userCertificates: many(userCertificates),
	userLearningPathModuleProgresses: many(userLearningPathModuleProgress),
	userModuleProgresses: many(userModuleProgress),
}));

export const activityLogsRelations = relations(activityLogs, ({one}) => ({
	module: one(modules, {
		fields: [activityLogs.moduleId],
		references: [modules.id]
	}),
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id]
	}),
}));

export const modulesRelations = relations(modules, ({one, many}) => ({
	activityLogs: many(activityLogs),
	learningPathModules: many(learningPathModules),
	moduleCards: many(moduleCards),
	user: one(users, {
		fields: [modules.authorId],
		references: [users.id]
	}),
	userModuleProgresses: many(userModuleProgress),
}));

export const friendshipsRelations = relations(friendships, ({one}) => ({
	user_receiverId: one(users, {
		fields: [friendships.receiverId],
		references: [users.id],
		relationName: "friendships_receiverId_users_id"
	}),
	user_requesterId: one(users, {
		fields: [friendships.requesterId],
		references: [users.id],
		relationName: "friendships_requesterId_users_id"
	}),
}));

export const learningPathModulesRelations = relations(learningPathModules, ({one}) => ({
	learningPath: one(learningPaths, {
		fields: [learningPathModules.learningPathId],
		references: [learningPaths.id]
	}),
	module: one(modules, {
		fields: [learningPathModules.moduleId],
		references: [modules.id]
	}),
}));

export const learningPathsRelations = relations(learningPaths, ({one, many}) => ({
	learningPathModules: many(learningPathModules),
	user: one(users, {
		fields: [learningPaths.authorId],
		references: [users.id]
	}),
}));

export const moduleCardsRelations = relations(moduleCards, ({one, many}) => ({
	module: one(modules, {
		fields: [moduleCards.moduleId],
		references: [modules.id]
	}),
	questions: many(questions),
}));

export const moduleProposalsRelations = relations(moduleProposals, ({one, many}) => ({
	user: one(users, {
		fields: [moduleProposals.proposerId],
		references: [users.id]
	}),
	proposalVotes: many(proposalVotes),
}));

export const proposalVotesRelations = relations(proposalVotes, ({one}) => ({
	moduleProposal: one(moduleProposals, {
		fields: [proposalVotes.proposalId],
		references: [moduleProposals.id]
	}),
	user: one(users, {
		fields: [proposalVotes.userId],
		references: [users.id]
	}),
}));

export const questionOptionsRelations = relations(questionOptions, ({one}) => ({
	question: one(questions, {
		fields: [questionOptions.questionId],
		references: [questions.id]
	}),
}));

export const questionsRelations = relations(questions, ({one, many}) => ({
	questionOptions: many(questionOptions),
	moduleCard: one(moduleCards, {
		fields: [questions.cardId],
		references: [moduleCards.id]
	}),
	userAnswers: many(userAnswers),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const userAchievementsRelations = relations(userAchievements, ({one}) => ({
	achievement: one(achievements, {
		fields: [userAchievements.achievementId],
		references: [achievements.id]
	}),
	user: one(users, {
		fields: [userAchievements.userId],
		references: [users.id]
	}),
}));

export const achievementsRelations = relations(achievements, ({many}) => ({
	userAchievements: many(userAchievements),
}));

export const userAnswersRelations = relations(userAnswers, ({one}) => ({
	question: one(questions, {
		fields: [userAnswers.questionId],
		references: [questions.id]
	}),
	user: one(users, {
		fields: [userAnswers.userId],
		references: [users.id]
	}),
}));

export const userCertificatesRelations = relations(userCertificates, ({one}) => ({
	certificate: one(certificates, {
		fields: [userCertificates.certificateId],
		references: [certificates.id]
	}),
	user: one(users, {
		fields: [userCertificates.userId],
		references: [users.id]
	}),
}));

export const certificatesRelations = relations(certificates, ({many}) => ({
	userCertificates: many(userCertificates),
}));

export const userLearningPathModuleProgressRelations = relations(userLearningPathModuleProgress, ({one}) => ({
	user: one(users, {
		fields: [userLearningPathModuleProgress.userId],
		references: [users.id]
	}),
}));

export const userModuleProgressRelations = relations(userModuleProgress, ({one}) => ({
	module: one(modules, {
		fields: [userModuleProgress.moduleId],
		references: [modules.id]
	}),
	user: one(users, {
		fields: [userModuleProgress.userId],
		references: [users.id]
	}),
}));