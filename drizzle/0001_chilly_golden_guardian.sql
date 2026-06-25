CREATE TABLE `coalitionMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coalitionId` int NOT NULL,
	`nonprofitId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`role` enum('creator','member') NOT NULL DEFAULT 'member',
	`status` enum('active','invited','declined') NOT NULL DEFAULT 'active',
	CONSTRAINT `coalitionMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coalitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`mission` longtext,
	`sectors` json NOT NULL DEFAULT ('[]'),
	`sharedGoals` json NOT NULL DEFAULT ('[]'),
	`memberCount` int NOT NULL DEFAULT 1,
	`status` enum('active','inactive','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coalitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donorProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyWebsite` varchar(255),
	`companyLogo` varchar(255),
	`industry` varchar(100),
	`description` longtext,
	`resourceTypes` json NOT NULL DEFAULT ('[]'),
	`verificationStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`verificationNotes` text,
	`contactName` varchar(255),
	`contactEmail` varchar(255),
	`contactPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donorProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `donorProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `grantWritingSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nonprofitId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`grantType` varchar(100),
	`fundingAmount` decimal(12,2),
	`deadline` timestamp,
	`context` json NOT NULL DEFAULT ('{}'),
	`draftContent` longtext,
	`status` enum('draft','in_progress','completed','submitted') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grantWritingSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `impactMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`nonprofitId` int NOT NULL,
	`donorId` int NOT NULL,
	`resourcesReceived` int NOT NULL DEFAULT 0,
	`hoursContributed` decimal(10,2) NOT NULL DEFAULT 0,
	`projectsEnabled` int NOT NULL DEFAULT 0,
	`peopleImpacted` int NOT NULL DEFAULT 0,
	`outcomesReported` json NOT NULL DEFAULT ('[]'),
	`successStory` longtext,
	`metrics` json NOT NULL DEFAULT ('{}'),
	`reportedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `impactMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceId` int NOT NULL,
	`nonprofitId` int NOT NULL,
	`matchScore` decimal(5,2) NOT NULL,
	`matchReasons` json NOT NULL DEFAULT ('[]'),
	`status` enum('suggested','viewed','requested','active','completed') NOT NULL DEFAULT 'suggested',
	`viewedAt` timestamp,
	`requestedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`content` longtext NOT NULL,
	`attachmentUrl` varchar(255),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderationQueue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemType` enum('resource','profile','coalition','message','impact_report') NOT NULL,
	`itemId` int NOT NULL,
	`userId` int NOT NULL,
	`reason` varchar(255),
	`status` enum('pending','approved','rejected','flagged') NOT NULL DEFAULT 'pending',
	`notes` longtext,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moderationQueue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nonprofitProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`organizationName` varchar(255) NOT NULL,
	`organizationWebsite` varchar(255),
	`organizationLogo` varchar(255),
	`sector` varchar(100),
	`mission` longtext,
	`description` longtext,
	`yearFounded` int,
	`teamSize` int,
	`annualBudget` decimal(12,2),
	`technicalProficiency` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`primaryNeeds` json NOT NULL DEFAULT ('[]'),
	`verificationStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`nonprofitStatus` varchar(50),
	`verificationNotes` text,
	`contactName` varchar(255),
	`contactEmail` varchar(255),
	`contactPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nonprofitProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `nonprofitProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('new_match','request_submitted','request_approved','request_rejected','coalition_invitation','message_received','impact_milestone','resource_available','admin_alert') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` longtext,
	`relatedResourceId` int,
	`relatedRequestId` int,
	`relatedCoalitionId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`totalUsers` int NOT NULL DEFAULT 0,
	`totalDonors` int NOT NULL DEFAULT 0,
	`totalNonprofits` int NOT NULL DEFAULT 0,
	`totalResources` int NOT NULL DEFAULT 0,
	`totalRequests` int NOT NULL DEFAULT 0,
	`approvedRequests` int NOT NULL DEFAULT 0,
	`totalCoalitions` int NOT NULL DEFAULT 0,
	`totalMatches` int NOT NULL DEFAULT 0,
	`totalHoursContributed` decimal(12,2) NOT NULL DEFAULT 0,
	`totalPeopleImpacted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `platformStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `platformStats_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `resourceRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceId` int NOT NULL,
	`requesterId` int NOT NULL,
	`coalitionId` int,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`requestedCapacity` decimal(10,2),
	`intendedUse` longtext,
	`expectedOutcome` longtext,
	`status` enum('draft','submitted','under_review','approved','rejected','active','completed','cancelled') NOT NULL DEFAULT 'draft',
	`approvedBy` int,
	`approvalDate` timestamp,
	`rejectionReason` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resourceRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext NOT NULL,
	`category` enum('ai_agent','software_tool','dataset','computing_resource','consulting','training','other') NOT NULL,
	`subcategory` varchar(100),
	`tags` json NOT NULL DEFAULT ('[]'),
	`availability` enum('available','limited','unavailable') NOT NULL DEFAULT 'available',
	`capacityUnits` varchar(50),
	`capacityAmount` decimal(10,2),
	`usageTerms` longtext,
	`targetSectors` json NOT NULL DEFAULT ('[]'),
	`skillRequirements` varchar(100),
	`documentation` varchar(255),
	`contactEmail` varchar(255),
	`status` enum('active','inactive','archived') NOT NULL DEFAULT 'active',
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('donor','nonprofit','admin') NOT NULL DEFAULT 'nonprofit';--> statement-breakpoint
ALTER TABLE `users` ADD `profileCompleted` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);