CREATE TABLE `accounts` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`type` varchar(50) NOT NULL,
	`provider` varchar(50) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(50),
	`scope` text,
	`id_token` text,
	`session_state` varchar(100),
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`expires` timestamp(3) NOT NULL,
	CONSTRAINT `sessions_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`password` varchar(255),
	`image` varchar(500),
	`bio` text,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`totalPoints` int NOT NULL DEFAULT 0,
	`rank` int,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`emailVerified` timestamp(3),
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	`updatedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `module_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`type` enum('content','question','achievement') NOT NULL,
	`title` varchar(256) NOT NULL,
	`content` text,
	`icon` varchar(100),
	`image` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `module_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`difficulty` enum('Beginner','Intermediate','Advanced') NOT NULL,
	`category` enum('History','Science','Art & Culture','General') NOT NULL,
	`status` enum('published','draft','pending') NOT NULL DEFAULT 'draft',
	`authorId` varchar(36),
	`estimatedTime` varchar(50),
	`participants` int NOT NULL DEFAULT 0,
	`avgScore` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`rating` int,
	`badges` int NOT NULL DEFAULT 0,
	`color` varchar(50),
	`accentColor` varchar(50),
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	`updatedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`optionText` varchar(256) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `question_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cardId` int NOT NULL,
	`question` text NOT NULL,
	`type` enum('multiple-choice','true-false','text') NOT NULL,
	`correctAnswer` varchar(500) NOT NULL,
	`explanation` text NOT NULL,
	`hint` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`questionId` int NOT NULL,
	`answer` varchar(500) NOT NULL,
	`isCorrect` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_module_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`moduleId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`currentCardIndex` int NOT NULL DEFAULT 0,
	`score` int,
	`completedAt` timestamp(3),
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	`updatedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_module_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(100) NOT NULL,
	`requirementType` enum('modules_completed','perfect_quizzes','streak_days','friends_count','points_total','learning_paths_completed') NOT NULL,
	`requirementValue` int NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `achievements_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `friendships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requesterId` varchar(36) NOT NULL,
	`receiverId` varchar(36) NOT NULL,
	`status` enum('pending','accepted') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `friendships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`proposerId` varchar(36) NOT NULL,
	`category` enum('History','Science','Art & Culture','General') NOT NULL,
	`votes` int NOT NULL DEFAULT 0,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `module_proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposal_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `proposal_votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`activityType` enum('module_started','module_completed','quiz_answered','achievement_unlocked') NOT NULL,
	`moduleId` int,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`image` text,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`certificateId` int NOT NULL,
	`awardedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_path_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`learningPathId` int NOT NULL,
	`moduleId` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `learning_path_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_paths` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`coverImage` text,
	`difficulty` enum('Beginner','Intermediate','Advanced') NOT NULL,
	`estimatedTime` varchar(50),
	`prerequisites` text,
	`isSequential` boolean NOT NULL DEFAULT false,
	`status` enum('published','draft','pending') NOT NULL DEFAULT 'draft',
	`authorId` varchar(36) NOT NULL,
	`certificateId` int,
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	`updatedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `learning_paths_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_learning_path_module_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`learningPathId` int NOT NULL,
	`moduleId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`currentCardIndex` int NOT NULL DEFAULT 0,
	`score` int,
	`completedAt` timestamp(3),
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	`updatedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_learning_path_module_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_learning_path_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(36) NOT NULL,
	`learningPathId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`completedAt` timestamp(3),
	`createdAt` timestamp(3) NOT NULL DEFAULT (now()),
	`updatedAt` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_learning_path_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `module_cards` ADD CONSTRAINT `module_cards_moduleId_modules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modules` ADD CONSTRAINT `modules_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_options` ADD CONSTRAINT `question_options_questionId_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_cardId_module_cards_id_fk` FOREIGN KEY (`cardId`) REFERENCES `module_cards`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_questionId_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_module_progress` ADD CONSTRAINT `user_module_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_module_progress` ADD CONSTRAINT `user_module_progress_moduleId_modules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_achievementId_achievements_id_fk` FOREIGN KEY (`achievementId`) REFERENCES `achievements`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `friendships` ADD CONSTRAINT `friendships_requesterId_users_id_fk` FOREIGN KEY (`requesterId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `friendships` ADD CONSTRAINT `friendships_receiverId_users_id_fk` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `module_proposals` ADD CONSTRAINT `module_proposals_proposerId_users_id_fk` FOREIGN KEY (`proposerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposal_votes` ADD CONSTRAINT `proposal_votes_proposalId_module_proposals_id_fk` FOREIGN KEY (`proposalId`) REFERENCES `module_proposals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposal_votes` ADD CONSTRAINT `proposal_votes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_moduleId_modules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_certificates` ADD CONSTRAINT `user_certificates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_certificates` ADD CONSTRAINT `user_certificates_certificateId_certificates_id_fk` FOREIGN KEY (`certificateId`) REFERENCES `certificates`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learning_path_modules` ADD CONSTRAINT `learning_path_modules_learningPathId_learning_paths_id_fk` FOREIGN KEY (`learningPathId`) REFERENCES `learning_paths`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learning_path_modules` ADD CONSTRAINT `learning_path_modules_moduleId_modules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learning_paths` ADD CONSTRAINT `learning_paths_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_learning_path_module_progress` ADD CONSTRAINT `user_lp_mp_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_learning_path_module_progress` ADD CONSTRAINT `user_lp_mp_lp_fk` FOREIGN KEY (`learningPathId`) REFERENCES `learning_paths`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_learning_path_module_progress` ADD CONSTRAINT `user_lp_mp_module_fk` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_learning_path_progress` ADD CONSTRAINT `user_lp_prog_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_learning_path_progress` ADD CONSTRAINT `user_lp_prog_lp_fk` FOREIGN KEY (`learningPathId`) REFERENCES `learning_paths`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `accounts_provider_providerAccountId_idx` ON `accounts` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE INDEX `sessions_sessionToken_idx` ON `sessions` (`sessionToken`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);
