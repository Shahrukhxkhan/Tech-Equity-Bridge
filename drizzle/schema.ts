import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  longtext,
  tinyint,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based fields for Tech Donors, Non-Profits, and Admins.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["donor", "nonprofit", "admin"]).default("nonprofit").notNull(),
  profileCompleted: boolean("profileCompleted").default(false).notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tech Donor Profile - for companies or individuals offering resources
 */
export const donorProfiles = mysqlTable("donorProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyWebsite: varchar("companyWebsite", { length: 255 }),
  companyLogo: varchar("companyLogo", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  description: longtext("description"),
  resourceTypes: json("resourceTypes").$type<string[]>().default([]).notNull(), // ["ai_agents", "computing", "data", "tools"]
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  verificationNotes: text("verificationNotes"),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DonorProfile = typeof donorProfiles.$inferSelect;
export type InsertDonorProfile = typeof donorProfiles.$inferInsert;

/**
 * Non-Profit Profile - for organizations seeking resources
 */
export const nonprofitProfiles = mysqlTable("nonprofitProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  organizationName: varchar("organizationName", { length: 255 }).notNull(),
  organizationWebsite: varchar("organizationWebsite", { length: 255 }),
  organizationLogo: varchar("organizationLogo", { length: 255 }),
  sector: varchar("sector", { length: 100 }), // "education", "healthcare", "environment", etc.
  mission: longtext("mission"),
  description: longtext("description"),
  yearFounded: int("yearFounded"),
  teamSize: int("teamSize"),
  annualBudget: decimal("annualBudget", { precision: 12, scale: 2 }),
  technicalProficiency: mysqlEnum("technicalProficiency", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  primaryNeeds: json("primaryNeeds").$type<string[]>().default([]).notNull(), // ["grant_writing", "data_analysis", "volunteer_management"]
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  nonprofitStatus: varchar("nonprofitStatus", { length: 50 }), // "501c3", "registered_charity", etc.
  verificationNotes: text("verificationNotes"),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NonprofitProfile = typeof nonprofitProfiles.$inferSelect;
export type InsertNonprofitProfile = typeof nonprofitProfiles.$inferInsert;

/**
 * Resources/Agents - offered by donors
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  donorId: int("donorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description").notNull(),
  category: mysqlEnum("category", [
    "ai_agent",
    "software_tool",
    "dataset",
    "computing_resource",
    "consulting",
    "training",
    "other",
  ]).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  tags: json("tags").$type<string[]>().default([]).notNull(),
  availability: mysqlEnum("availability", ["available", "limited", "unavailable"]).default("available").notNull(),
  capacityUnits: varchar("capacityUnits", { length: 50 }), // "hours", "licenses", "GB", etc.
  capacityAmount: decimal("capacityAmount", { precision: 10, scale: 2 }),
  usageTerms: longtext("usageTerms"),
  targetSectors: json("targetSectors").$type<string[]>().default([]).notNull(),
  skillRequirements: varchar("skillRequirements", { length: 100 }), // "beginner", "intermediate", "advanced"
  documentation: varchar("documentation", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive", "archived"]).default("active").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Coalitions - groups of non-profits with shared goals
 */
export const coalitions = mysqlTable("coalitions", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: longtext("description"),
  mission: longtext("mission"),
  sectors: json("sectors").$type<string[]>().default([]).notNull(),
  sharedGoals: json("sharedGoals").$type<string[]>().default([]).notNull(),
  memberCount: int("memberCount").default(1).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coalition = typeof coalitions.$inferSelect;
export type InsertCoalition = typeof coalitions.$inferInsert;

/**
 * Coalition Memberships
 */
export const coalitionMembers = mysqlTable("coalitionMembers", {
  id: int("id").autoincrement().primaryKey(),
  coalitionId: int("coalitionId").notNull(),
  nonprofitId: int("nonprofitId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  role: mysqlEnum("role", ["creator", "member"]).default("member").notNull(),
  status: mysqlEnum("status", ["active", "invited", "declined"]).default("active").notNull(),
});

export type CoalitionMember = typeof coalitionMembers.$inferSelect;
export type InsertCoalitionMember = typeof coalitionMembers.$inferInsert;

/**
 * Resource Requests - non-profits request resources from donors
 */
export const resourceRequests = mysqlTable("resourceRequests", {
  id: int("id").autoincrement().primaryKey(),
  resourceId: int("resourceId").notNull(),
  requesterId: int("requesterId").notNull(), // nonprofit user id
  coalitionId: int("coalitionId"), // optional, if submitted by coalition
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  requestedCapacity: decimal("requestedCapacity", { precision: 10, scale: 2 }),
  intendedUse: longtext("intendedUse"),
  expectedOutcome: longtext("expectedOutcome"),
  status: mysqlEnum("status", [
    "draft",
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "active",
    "completed",
    "cancelled",
  ]).default("draft").notNull(),
  approvedBy: int("approvedBy"), // donor user id
  approvalDate: timestamp("approvalDate"),
  rejectionReason: text("rejectionReason"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResourceRequest = typeof resourceRequests.$inferSelect;
export type InsertResourceRequest = typeof resourceRequests.$inferInsert;

/**
 * Messages - in-platform communication between donors and non-profits
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  content: longtext("content").notNull(),
  attachmentUrl: varchar("attachmentUrl", { length: 255 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Impact Metrics - track outcomes and impact
 */
export const impactMetrics = mysqlTable("impactMetrics", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  nonprofitId: int("nonprofitId").notNull(),
  donorId: int("donorId").notNull(),
  resourcesReceived: int("resourcesReceived").default(0).notNull(),
  hoursContributed: decimal("hoursContributed", { precision: 10, scale: 2 }).default("0.00").notNull(),
  projectsEnabled: int("projectsEnabled").default(0).notNull(),
  peopleImpacted: int("peopleImpacted").default(0).notNull(),
  outcomesReported: json("outcomesReported").$type<string[]>().default([]).notNull(),
  successStory: longtext("successStory"),
  metrics: json("metrics").$type<Record<string, unknown>>().default({}).notNull(), // custom metrics
  reportedAt: timestamp("reportedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type InsertImpactMetric = typeof impactMetrics.$inferInsert;

/**
 * Notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "new_match",
    "request_submitted",
    "request_approved",
    "request_rejected",
    "coalition_invitation",
    "message_received",
    "impact_milestone",
    "resource_available",
    "admin_alert",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: longtext("content"),
  relatedResourceId: int("relatedResourceId"),
  relatedRequestId: int("relatedRequestId"),
  relatedCoalitionId: int("relatedCoalitionId"),
  isRead: boolean("isRead").default(false).notNull(),
  actionUrl: varchar("actionUrl", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Matches - suggested connections between donors and non-profits
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  resourceId: int("resourceId").notNull(),
  nonprofitId: int("nonprofitId").notNull(),
  matchScore: decimal("matchScore", { precision: 5, scale: 2 }).notNull(), // 0-100
  matchReasons: json("matchReasons").$type<string[]>().default([]).notNull(),
  status: mysqlEnum("status", ["suggested", "viewed", "requested", "active", "completed"]).default("suggested").notNull(),
  viewedAt: timestamp("viewedAt"),
  requestedAt: timestamp("requestedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

/**
 * Grant Writing Sessions - track AI-assisted grant writing
 */
export const grantWritingSessions = mysqlTable("grantWritingSessions", {
  id: int("id").autoincrement().primaryKey(),
  nonprofitId: int("nonprofitId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  grantType: varchar("grantType", { length: 100 }), // "foundation", "government", "corporate"
  fundingAmount: decimal("fundingAmount", { precision: 12, scale: 2 }),
  deadline: timestamp("deadline"),
  context: json("context").$type<Record<string, unknown>>().default({}).notNull(), // org info, needs, resources
  draftContent: longtext("draftContent"),
  status: mysqlEnum("status", ["draft", "in_progress", "completed", "submitted"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GrantWritingSession = typeof grantWritingSessions.$inferSelect;
export type InsertGrantWritingSession = typeof grantWritingSessions.$inferInsert;

/**
 * Admin Moderation Queue
 */
export const moderationQueue = mysqlTable("moderationQueue", {
  id: int("id").autoincrement().primaryKey(),
  itemType: mysqlEnum("itemType", ["resource", "profile", "coalition", "message", "impact_report"]).notNull(),
  itemId: int("itemId").notNull(),
  userId: int("userId").notNull(),
  reason: varchar("reason", { length: 255 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "flagged"]).default("pending").notNull(),
  notes: longtext("notes"),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModerationQueue = typeof moderationQueue.$inferSelect;
export type InsertModerationQueue = typeof moderationQueue.$inferInsert;

/**
 * Platform Statistics - for analytics and reporting
 */
export const platformStats = mysqlTable("platformStats", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").defaultNow().notNull().unique(),
  totalUsers: int("totalUsers").default(0).notNull(),
  totalDonors: int("totalDonors").default(0).notNull(),
  totalNonprofits: int("totalNonprofits").default(0).notNull(),
  totalResources: int("totalResources").default(0).notNull(),
  totalRequests: int("totalRequests").default(0).notNull(),
  approvedRequests: int("approvedRequests").default(0).notNull(),
  totalCoalitions: int("totalCoalitions").default(0).notNull(),
  totalMatches: int("totalMatches").default(0).notNull(),
  totalHoursContributed: decimal("totalHoursContributed", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalPeopleImpacted: int("totalPeopleImpacted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformStats = typeof platformStats.$inferSelect;
export type InsertPlatformStats = typeof platformStats.$inferInsert;
