CREATE TABLE `csrReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`reportUrl` varchar(500),
	`organizationsHelped` int NOT NULL DEFAULT 0,
	`hoursContributed` decimal(12,2) NOT NULL DEFAULT '0.00',
	`peopleImpacted` int NOT NULL DEFAULT 0,
	`successStories` json NOT NULL DEFAULT ('[]'),
	`griAligned` boolean NOT NULL DEFAULT true,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `csrReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donorImpactWalls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`publicSlug` varchar(255),
	`displayName` varchar(255) NOT NULL,
	`logoUrl` varchar(500),
	`description` longtext,
	`tier` enum('impact_ally','equity_champion','founding_partner') NOT NULL,
	`totalHoursContributed` decimal(12,2) NOT NULL DEFAULT '0.00',
	`organizationsHelped` int NOT NULL DEFAULT 0,
	`peopleImpacted` int NOT NULL DEFAULT 0,
	`featuredStories` json NOT NULL DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donorImpactWalls_id` PRIMARY KEY(`id`),
	CONSTRAINT `donorImpactWalls_donorId_unique` UNIQUE(`donorId`),
	CONSTRAINT `donorImpactWalls_publicSlug_unique` UNIQUE(`publicSlug`)
);
--> statement-breakpoint
CREATE TABLE `donorIncentiveEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`eventType` enum('tier_upgrade','tier_downgrade','pledge_created','pledge_fulfilled','pledge_under_delivery','quality_issue','csr_report_generated','badge_awarded','grace_period_applied','grace_period_expired') NOT NULL,
	`details` json NOT NULL DEFAULT ('{}'),
	`triggeredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `donorIncentiveEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donorIncentiveTiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`tier` enum('impact_ally','equity_champion','founding_partner') NOT NULL,
	`monthlyPledgeAmount` decimal(12,2) NOT NULL,
	`pledgeUnit` enum('gpu_hours','api_calls','agent_hours','compute_units') NOT NULL,
	`verificationStatus` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`badgePublic` boolean NOT NULL DEFAULT true,
	`csrReportsEnabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donorIncentiveTiers_id` PRIMARY KEY(`id`),
	CONSTRAINT `donorIncentiveTiers_donorId_unique` UNIQUE(`donorId`)
);
--> statement-breakpoint
CREATE TABLE `pledgeFulfillmentLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pledgeId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`pledgedAmount` decimal(12,2) NOT NULL,
	`deliveredAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
	`fulfillmentPercentage` decimal(5,2) NOT NULL DEFAULT '0.00',
	`flagged` boolean NOT NULL DEFAULT false,
	`flagReason` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pledgeFulfillmentLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resourcePledges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`resourceType` enum('ai_agent','gpu_compute','data_processing','software_tool') NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`availabilityWindows` json NOT NULL DEFAULT ('[]'),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`status` enum('active','paused','completed','cancelled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resourcePledges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resourceQualityBenchmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceId` int NOT NULL,
	`resourceType` enum('ai_agent','gpu_compute','data_processing','software_tool') NOT NULL,
	`latencyP95Ms` int,
	`uptimePercentage` decimal(5,2),
	`tokenLimit` int,
	`throughputBenchmark` varchar(255),
	`jobCompletionSlaHours` int,
	`qualityScore` decimal(3,1) NOT NULL DEFAULT '0.0',
	`benchmarkPassed` boolean NOT NULL DEFAULT false,
	`testedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resourceQualityBenchmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `resourceQualityBenchmarks_resourceId_unique` UNIQUE(`resourceId`)
);
