CREATE TABLE `admin_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`targetType` varchar(50),
	`targetId` int,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`userId` int NOT NULL,
	`employerId` int NOT NULL,
	`cvId` int,
	`coverLetter` text,
	`status` enum('applied','reviewing','shortlisted','rejected','accepted') NOT NULL DEFAULT 'applied',
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`rejectedAt` timestamp,
	`rejectionReason` text,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_job_user` UNIQUE(`jobId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_bookmark_user_job` UNIQUE(`userId`,`jobId`)
);
--> statement-breakpoint
CREATE TABLE `cv_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cvId` int NOT NULL,
	`sectionType` enum('personal','summary','workHistory','education','skills','languages','certifications','projects') NOT NULL,
	`data` json NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cv_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cvs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`fileUrl` varchar(512),
	`fileKey` varchar(512),
	`isUploaded` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cvs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employer_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyLogo` varchar(512),
	`companyWebsite` varchar(255),
	`companyDescription` text,
	`industry` varchar(100),
	`companySize` enum('1-10','11-50','51-200','201-500','500+'),
	`location` varchar(255),
	`subscriptionTier` enum('free','premium') NOT NULL DEFAULT 'free',
	`subscriptionExpiry` timestamp,
	`jobPostingsUsed` int NOT NULL DEFAULT 0,
	`jobPostingsLimit` int NOT NULL DEFAULT 3,
	`featuredJobsUsed` int NOT NULL DEFAULT 0,
	`featuredJobsLimit` int NOT NULL DEFAULT 0,
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employer_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `employer_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`requirements` text,
	`responsibilities` text,
	`salary` varchar(100),
	`salaryMin` int,
	`salaryMax` int,
	`currency` varchar(10) DEFAULT 'USD',
	`jobType` enum('full-time','part-time','contract','freelance','internship') NOT NULL,
	`experience` enum('entry','mid','senior'),
	`location` varchar(255) NOT NULL,
	`region` varchar(100),
	`remote` enum('on-site','hybrid','remote') DEFAULT 'on-site',
	`profession` varchar(100) NOT NULL,
	`skills` text,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`featuredExpiry` timestamp,
	`status` enum('draft','published','closed','archived') NOT NULL DEFAULT 'draft',
	`applicationCount` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('application_status','job_match','message','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`relatedId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','employer','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `profilePhoto` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationToken` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationExpiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordResetToken` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordResetExpiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `adminLog_adminId_idx` ON `admin_logs` (`adminId`);--> statement-breakpoint
CREATE INDEX `adminLog_createdAt_idx` ON `admin_logs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `app_jobId_idx` ON `applications` (`jobId`);--> statement-breakpoint
CREATE INDEX `app_userId_idx` ON `applications` (`userId`);--> statement-breakpoint
CREATE INDEX `app_employerId_idx` ON `applications` (`employerId`);--> statement-breakpoint
CREATE INDEX `app_status_idx` ON `applications` (`status`);--> statement-breakpoint
CREATE INDEX `bookmark_userId_idx` ON `bookmarks` (`userId`);--> statement-breakpoint
CREATE INDEX `bookmark_jobId_idx` ON `bookmarks` (`jobId`);--> statement-breakpoint
CREATE INDEX `cvSection_cvId_idx` ON `cv_sections` (`cvId`);--> statement-breakpoint
CREATE INDEX `cv_userId_idx` ON `cvs` (`userId`);--> statement-breakpoint
CREATE INDEX `cv_isPrimary_idx` ON `cvs` (`isPrimary`);--> statement-breakpoint
CREATE INDEX `employer_userId_idx` ON `employer_profiles` (`userId`);--> statement-breakpoint
CREATE INDEX `job_employerId_idx` ON `jobs` (`employerId`);--> statement-breakpoint
CREATE INDEX `job_status_idx` ON `jobs` (`status`);--> statement-breakpoint
CREATE INDEX `job_profession_idx` ON `jobs` (`profession`);--> statement-breakpoint
CREATE INDEX `job_region_idx` ON `jobs` (`region`);--> statement-breakpoint
CREATE INDEX `job_createdAt_idx` ON `jobs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `notification_userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notification_isRead_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);