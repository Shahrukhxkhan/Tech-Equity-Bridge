import { eq, and, like, inArray, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  donorProfiles,
  nonprofitProfiles,
  resources,
  coalitions,
  coalitionMembers,
  resourceRequests,
  messages,
  impactMetrics,
  notifications,
  matches,
  grantWritingSessions,
  moderationQueue,
  platformStats,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * User Management
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Donor Profile Management
 */
export async function createDonorProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(donorProfiles).values({
    userId,
    companyName: data.companyName,
    companyWebsite: data.companyWebsite,
    companyLogo: data.companyLogo,
    industry: data.industry,
    description: data.description,
    resourceTypes: data.resourceTypes || [],
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
  });

  return result;
}

export async function getDonorProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(donorProfiles)
    .where(eq(donorProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateDonorProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(donorProfiles).set(data).where(eq(donorProfiles.userId, userId));
}

/**
 * Non-Profit Profile Management
 */
export async function createNonprofitProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(nonprofitProfiles).values({
    userId,
    organizationName: data.organizationName,
    organizationWebsite: data.organizationWebsite,
    organizationLogo: data.organizationLogo,
    sector: data.sector,
    mission: data.mission,
    description: data.description,
    yearFounded: data.yearFounded,
    teamSize: data.teamSize,
    annualBudget: data.annualBudget,
    technicalProficiency: data.technicalProficiency || "beginner",
    primaryNeeds: data.primaryNeeds || [],
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
  });
}

export async function getNonprofitProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(nonprofitProfiles)
    .where(eq(nonprofitProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateNonprofitProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(nonprofitProfiles).set(data).where(eq(nonprofitProfiles.userId, userId));
}

/**
 * Resource Management
 */
export async function createResource(donorId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(resources).values({
    donorId,
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory,
    tags: data.tags || [],
    availability: data.availability || "available",
    capacityUnits: data.capacityUnits,
    capacityAmount: data.capacityAmount,
    usageTerms: data.usageTerms,
    targetSectors: data.targetSectors || [],
    skillRequirements: data.skillRequirements,
    documentation: data.documentation,
    contactEmail: data.contactEmail,
  });
}

export async function getResource(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchResources(
  query?: string,
  category?: string,
  availability?: string,
  limit: number = 20,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [eq(resources.status, "active")];

  if (query) {
    conditions.push(
      sql`(${resources.title} LIKE ${`%${query}%`} OR ${resources.description} LIKE ${`%${query}%`})`
    );
  }

  if (category) {
    conditions.push(eq(resources.category, category as any));
  }

  if (availability) {
    conditions.push(eq(resources.availability, availability as any));
  }

  return db
    .select()
    .from(resources)
    .where(and(...conditions))
    .orderBy(desc(resources.viewCount), desc(resources.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getDonorResources(donorId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(resources)
    .where(eq(resources.donorId, donorId))
    .orderBy(desc(resources.createdAt));
}

export async function updateResource(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(resources).set(data).where(eq(resources.id, id));
}

/**
 * Coalition Management
 */
export async function createCoalition(creatorId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(coalitions).values({
    creatorId,
    name: data.name,
    description: data.description,
    mission: data.mission,
    sectors: data.sectors || [],
    sharedGoals: data.sharedGoals || [],
    memberCount: 1,
  });

  return result;
}

export async function getCoalition(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(coalitions).where(eq(coalitions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCoalitionMembers(coalitionId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(coalitionMembers)
    .where(eq(coalitionMembers.coalitionId, coalitionId));
}

export async function addCoalitionMember(coalitionId: number, nonprofitId: number, role = "member") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(coalitionMembers).values({
    coalitionId,
    nonprofitId,
    role: role as any,
  });
}

/**
 * Resource Request Management
 */
export async function createResourceRequest(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(resourceRequests).values({
    resourceId: data.resourceId,
    requesterId: data.requesterId,
    coalitionId: data.coalitionId,
    title: data.title,
    description: data.description,
    requestedCapacity: data.requestedCapacity,
    intendedUse: data.intendedUse,
    expectedOutcome: data.expectedOutcome,
    status: "submitted",
  });
}

export async function getResourceRequest(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(resourceRequests)
    .where(eq(resourceRequests.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getNonprofitRequests(requesterId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(resourceRequests)
    .where(eq(resourceRequests.requesterId, requesterId))
    .orderBy(desc(resourceRequests.createdAt));
}

export async function getDonorRequests(donorId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all requests for resources owned by this donor
  return db
    .select()
    .from(resourceRequests)
    .innerJoin(resources, eq(resourceRequests.resourceId, resources.id))
    .where(eq(resources.donorId, donorId))
    .orderBy(desc(resourceRequests.createdAt));
}

export async function updateResourceRequest(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(resourceRequests).set(data).where(eq(resourceRequests.id, id));
}

/**
 * Messaging
 */
export async function createMessage(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(messages).values({
    requestId: data.requestId,
    senderId: data.senderId,
    recipientId: data.recipientId,
    content: data.content,
    attachmentUrl: data.attachmentUrl,
  });
}

export async function getRequestMessages(requestId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.requestId, requestId))
    .orderBy(asc(messages.createdAt));
}

/**
 * Impact Metrics
 */
export async function createImpactMetric(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(impactMetrics).values({
    requestId: data.requestId,
    nonprofitId: data.nonprofitId,
    donorId: data.donorId,
    resourcesReceived: data.resourcesReceived || 0,
    hoursContributed: data.hoursContributed || "0.00",
    projectsEnabled: data.projectsEnabled || 0,
    peopleImpacted: data.peopleImpacted || 0,
    outcomesReported: data.outcomesReported || [],
    successStory: data.successStory,
    metrics: data.metrics || {},
    reportedAt: new Date(),
  });
}

export async function getNonprofitImpactMetrics(nonprofitId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(impactMetrics)
    .where(eq(impactMetrics.nonprofitId, nonprofitId))
    .orderBy(desc(impactMetrics.createdAt));
}

export async function getDonorImpactMetrics(donorId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(impactMetrics)
    .where(eq(impactMetrics.donorId, donorId))
    .orderBy(desc(impactMetrics.createdAt));
}

/**
 * Notifications
 */
export async function createNotification(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(notifications).values({
    userId: data.userId,
    type: data.type,
    title: data.title,
    content: data.content,
    relatedResourceId: data.relatedResourceId,
    relatedRequestId: data.relatedRequestId,
    relatedCoalitionId: data.relatedCoalitionId,
    actionUrl: data.actionUrl,
  });
}

export async function getUserNotifications(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [eq(notifications.userId, userId)];
  if (unreadOnly) {
    conditions.push(eq(notifications.isRead, false));
  }

  return db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

/**
 * Matches
 */
export async function createMatch(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(matches).values({
    resourceId: data.resourceId,
    nonprofitId: data.nonprofitId,
    matchScore: data.matchScore,
    matchReasons: data.matchReasons || [],
  });
}

export async function getNonprofitMatches(nonprofitId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(matches)
    .where(eq(matches.nonprofitId, nonprofitId))
    .orderBy(desc(matches.matchScore));
}

export async function getDonorMatches(donorId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(matches)
    .innerJoin(resources, eq(matches.resourceId, resources.id))
    .where(eq(resources.donorId, donorId))
    .orderBy(desc(matches.matchScore));
}

/**
 * Grant Writing Sessions
 */
export async function createGrantWritingSession(nonprofitId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(grantWritingSessions).values({
    nonprofitId,
    title: data.title,
    grantType: data.grantType,
    fundingAmount: data.fundingAmount,
    deadline: data.deadline,
    context: data.context || {},
    draftContent: data.draftContent,
  });
}

export async function getGrantWritingSession(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(grantWritingSessions)
    .where(eq(grantWritingSessions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getNonprofitGrantSessions(nonprofitId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(grantWritingSessions)
    .where(eq(grantWritingSessions.nonprofitId, nonprofitId))
    .orderBy(desc(grantWritingSessions.createdAt));
}

export async function updateGrantWritingSession(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(grantWritingSessions).set(data).where(eq(grantWritingSessions.id, id));
}

/**
 * User Updates
 */
export async function updateUser(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(users).set(data).where(eq(users.id, userId));
}

/**
 * Platform Statistics
 */
export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .select()
    .from(platformStats)
    .where(eq(platformStats.date, today))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updatePlatformStats(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await getPlatformStats();

  if (existing) {
    return db.update(platformStats).set(data).where(eq(platformStats.date, today));
  } else {
    return db.insert(platformStats).values({
      date: today,
      ...data,
    });
  }
}
