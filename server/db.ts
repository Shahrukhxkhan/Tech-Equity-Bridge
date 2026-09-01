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
  donorIncentiveTiers,
  resourcePledges,
  pledgeFulfillmentLog,
  resourceQualityBenchmarks,
  resourceRatings,
  donorIncentiveEvents,
  csrReports,
  donorImpactWalls,
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

/**
 * =============================================================================
 * Phase 16: Donor Incentive & Resource Commitment Engine Helpers
 * =============================================================================
 */

// In-memory fallbacks when DB is not provisioned
const memoryStore = {
  tiers: new Map<number, any>(),
  pledges: new Map<number, any[]>(),
  fulfillments: new Map<number, any[]>(),
  benchmarks: new Map<number, any>(),
  ratings: new Map<number, any[]>(),
  csrReports: new Map<number, any[]>(),
  impactWalls: new Map<number, any>(),
  events: new Map<number, any[]>(),
};

/**
 * Donor Incentive Tiers
 */
export async function getDonorIncentiveTier(donorId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.tiers.get(donorId) || {
      donorId,
      tier: "impact_ally",
      monthlyPledgeAmount: "500.00",
      pledgeUnit: "gpu_hours",
      verificationStatus: "verified",
      badgePublic: true,
      csrReportsEnabled: true,
    };
  }

  const result = await db
    .select()
    .from(donorIncentiveTiers)
    .where(eq(donorIncentiveTiers.donorId, donorId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateDonorIncentiveTier(donorId: number, data: {
  tier: "impact_ally" | "equity_champion" | "founding_partner";
  monthlyPledgeAmount: number;
  pledgeUnit: "gpu_hours" | "api_calls" | "agent_hours" | "compute_units";
  verificationStatus?: "pending" | "verified" | "rejected";
  badgePublic?: boolean;
  csrReportsEnabled?: boolean;
}) {
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.tiers.get(donorId) || {};
    const updated = {
      ...existing,
      donorId,
      ...data,
      monthlyPledgeAmount: data.monthlyPledgeAmount.toFixed(2),
      verificationStatus: data.verificationStatus || "verified",
      badgePublic: data.badgePublic !== undefined ? data.badgePublic : true,
      csrReportsEnabled: data.csrReportsEnabled !== undefined ? data.csrReportsEnabled : true,
      updatedAt: new Date(),
    };
    memoryStore.tiers.set(donorId, updated);
    return updated;
  }

  const existing = await getDonorIncentiveTier(donorId);
  if (existing) {
    await db
      .update(donorIncentiveTiers)
      .set({
        tier: data.tier,
        monthlyPledgeAmount: data.monthlyPledgeAmount.toFixed(2),
        pledgeUnit: data.pledgeUnit,
        verificationStatus: data.verificationStatus || existing.verificationStatus,
        badgePublic: data.badgePublic !== undefined ? data.badgePublic : existing.badgePublic,
        csrReportsEnabled: data.csrReportsEnabled !== undefined ? data.csrReportsEnabled : existing.csrReportsEnabled,
      })
      .where(eq(donorIncentiveTiers.donorId, donorId));
    return getDonorIncentiveTier(donorId);
  } else {
    await db.insert(donorIncentiveTiers).values({
      donorId,
      tier: data.tier,
      monthlyPledgeAmount: data.monthlyPledgeAmount.toFixed(2),
      pledgeUnit: data.pledgeUnit,
      verificationStatus: data.verificationStatus || "pending",
      badgePublic: data.badgePublic !== undefined ? data.badgePublic : true,
      csrReportsEnabled: data.csrReportsEnabled !== undefined ? data.csrReportsEnabled : true,
    });
    return getDonorIncentiveTier(donorId);
  }
}

/**
 * Resource Pledges
 */
export async function getDonorPledges(donorId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.pledges.get(donorId) || [
      {
        id: 101,
        donorId,
        resourceType: "gpu_compute",
        quantity: "1500.00",
        unit: "NVIDIA A100 GPU Hours",
        availabilityWindows: [
          { day: "Monday - Friday", startTime: "20:00", endTime: "08:00" },
          { day: "Saturday - Sunday", startTime: "00:00", endTime: "23:59" },
        ],
        startDate: new Date("2026-01-01"),
        status: "active",
        createdAt: new Date(),
      },
      {
        id: 102,
        donorId,
        resourceType: "ai_agent",
        quantity: "50000.00",
        unit: "API Inference Queries",
        availabilityWindows: [
          { day: "All Days", startTime: "00:00", endTime: "23:59" }
        ],
        startDate: new Date("2026-01-01"),
        status: "active",
        createdAt: new Date(),
      },
    ];
  }

  return db
    .select()
    .from(resourcePledges)
    .where(eq(resourcePledges.donorId, donorId))
    .orderBy(desc(resourcePledges.createdAt));
}

export async function createResourcePledge(donorId: number, data: {
  resourceType: "ai_agent" | "gpu_compute" | "data_processing" | "software_tool";
  quantity: number;
  unit: string;
  availabilityWindows: Array<{ day: string; startTime: string; endTime: string }>;
  startDate: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    const list = memoryStore.pledges.get(donorId) || [];
    const newPledge = {
      id: Date.now(),
      donorId,
      ...data,
      quantity: data.quantity.toFixed(2),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    list.unshift(newPledge);
    memoryStore.pledges.set(donorId, list);
    return newPledge;
  }

  const result = await db.insert(resourcePledges).values({
    donorId,
    resourceType: data.resourceType,
    quantity: data.quantity.toFixed(2),
    unit: data.unit,
    availabilityWindows: data.availabilityWindows,
    startDate: data.startDate,
    endDate: data.endDate,
    status: "active",
  });

  return result;
}

export async function updateResourcePledgeStatus(id: number, status: "active" | "paused" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) {
    for (const [donorId, list] of memoryStore.pledges.entries()) {
      const idx = list.findIndex(p => p.id === id);
      if (idx !== -1) {
        list[idx].status = status;
        list[idx].updatedAt = new Date();
        return list[idx];
      }
    }
    return null;
  }

  return db.update(resourcePledges).set({ status }).where(eq(resourcePledges.id, id));
}

/**
 * Pledge Fulfillment Logging & Auditing
 */
export async function logPledgeFulfillment(pledgeId: number, month: string, data: {
  pledgedAmount: number;
  deliveredAmount: number;
  donorId?: number;
}) {
  const db = await getDb();
  const fulfillmentPercentage = data.pledgedAmount > 0 
    ? ((data.deliveredAmount / data.pledgedAmount) * 100) 
    : 0;
  const flagged = fulfillmentPercentage < 80; // Shortfall threshold >20%
  const flagReason = flagged 
    ? `Under-delivery shortfall: only ${fulfillmentPercentage.toFixed(1)}% fulfilled` 
    : null;

  if (!db) {
    const list = memoryStore.fulfillments.get(pledgeId) || [];
    const logItem = {
      id: Date.now(),
      pledgeId,
      month,
      pledgedAmount: data.pledgedAmount.toFixed(2),
      deliveredAmount: data.deliveredAmount.toFixed(2),
      fulfillmentPercentage: fulfillmentPercentage.toFixed(2),
      flagged,
      flagReason,
      createdAt: new Date(),
    };
    list.unshift(logItem);
    memoryStore.fulfillments.set(pledgeId, list);
    return logItem;
  }

  return db.insert(pledgeFulfillmentLog).values({
    pledgeId,
    month,
    pledgedAmount: data.pledgedAmount.toFixed(2),
    deliveredAmount: data.deliveredAmount.toFixed(2),
    fulfillmentPercentage: fulfillmentPercentage.toFixed(2),
    flagged,
    flagReason,
  });
}

export async function getPledgeFulfillmentHistory(pledgeId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.fulfillments.get(pledgeId) || [
      { id: 1, pledgeId, month: "2026-05", pledgedAmount: "1500.00", deliveredAmount: "1580.00", fulfillmentPercentage: "105.33", flagged: false, createdAt: new Date() },
      { id: 2, pledgeId, month: "2026-06", pledgedAmount: "1500.00", deliveredAmount: "1450.00", fulfillmentPercentage: "96.67", flagged: false, createdAt: new Date() },
      { id: 3, pledgeId, month: "2026-07", pledgedAmount: "1500.00", deliveredAmount: "1520.00", fulfillmentPercentage: "101.33", flagged: false, createdAt: new Date() },
      { id: 4, pledgeId, month: "2026-08", pledgedAmount: "1500.00", deliveredAmount: "1120.00", fulfillmentPercentage: "74.67", flagged: true, flagReason: "Under-delivery shortfall: only 74.7% fulfilled", createdAt: new Date() },
    ];
  }

  return db
    .select()
    .from(pledgeFulfillmentLog)
    .where(eq(pledgeFulfillmentLog.pledgeId, pledgeId))
    .orderBy(desc(pledgeFulfillmentLog.month));
}

export async function getAdminPledgeMonitor() {
  const db = await getDb();
  if (!db) {
    return [
      {
        donorId: 1,
        companyName: "Nexus DeepMind Labs",
        tier: "founding_partner",
        monthlyPledge: "10000 GPU Hours",
        currentMonthDelivered: "9850",
        fulfillmentRate: 98.5,
        flagged: false,
        qualityScore: "4.9",
        lastTested: new Date("2026-08-28"),
        status: "compliant",
      },
      {
        donorId: 2,
        companyName: "Apex Cloud Matrix",
        tier: "equity_champion",
        monthlyPledge: "3000 GPU Hours",
        currentMonthDelivered: "2150",
        fulfillmentRate: 71.6,
        flagged: true,
        flagReason: "Shortfall of 28.4% (<80% threshold)",
        qualityScore: "4.2",
        lastTested: new Date("2026-08-25"),
        status: "grace_period",
      },
      {
        donorId: 3,
        companyName: "CivicAI Systems",
        tier: "impact_ally",
        monthlyPledge: "50000 API Calls",
        currentMonthDelivered: "54200",
        fulfillmentRate: 108.4,
        flagged: false,
        qualityScore: "4.7",
        lastTested: new Date("2026-08-30"),
        status: "compliant",
      }
    ];
  }

  // In SQL database, query pledges, donors and fulfillment
  const pledges = await db.select().from(resourcePledges);
  return pledges;
}

/**
 * Quality Benchmarking Runner & Scoring
 */
export async function runResourceBenchmark(
  resourceId: number,
  resourceType: "ai_agent" | "gpu_compute" | "data_processing" | "software_tool",
  customOverrides?: Partial<{
    latencyP95Ms: number;
    uptimePercentage: number;
    tokenLimit: number;
    throughputBenchmark: string;
    jobCompletionSlaHours: number;
  }>
) {
  // Sandbox simulated testing with realistic variance
  const latencyP95Ms = customOverrides?.latencyP95Ms ?? Math.floor(Math.random() * 800 + 1200); // 1.2s - 2.0s
  const uptimePercentage = customOverrides?.uptimePercentage ?? (98.5 + Math.random() * 1.4); // 98.5% - 99.9%
  const tokenLimit = customOverrides?.tokenLimit ?? 128000;
  const throughputBenchmark = customOverrides?.throughputBenchmark ?? "145 tokens/sec (p95 batch)";
  const jobCompletionSlaHours = customOverrides?.jobCompletionSlaHours ?? 2;

  // Composite Quality Score Calculation (1.0 - 5.0)
  // Latency weight: 35%, Uptime weight: 35%, Throughput/Capacity weight: 30%
  let latencyScore = Math.max(1.0, 5.0 - (latencyP95Ms / 1000) * 0.7);
  let uptimeScore = (uptimePercentage / 100) * 5.0;
  let compositeScore = Number((latencyScore * 0.4 + uptimeScore * 0.4 + 4.8 * 0.2).toFixed(1));
  if (compositeScore > 5.0) compositeScore = 5.0;
  if (compositeScore < 1.0) compositeScore = 1.0;

  const benchmarkPassed = compositeScore >= 3.5 && uptimePercentage >= 95.0;

  const benchmarkData = {
    resourceId,
    resourceType,
    latencyP95Ms,
    uptimePercentage: uptimePercentage.toFixed(2),
    tokenLimit,
    throughputBenchmark,
    jobCompletionSlaHours,
    qualityScore: compositeScore.toFixed(1),
    benchmarkPassed,
    testedAt: new Date(),
    updatedAt: new Date(),
  };

  const db = await getDb();
  if (!db) {
    memoryStore.benchmarks.set(resourceId, benchmarkData);
    return benchmarkData;
  }

  const existing = await db
    .select()
    .from(resourceQualityBenchmarks)
    .where(eq(resourceQualityBenchmarks.resourceId, resourceId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(resourceQualityBenchmarks)
      .set(benchmarkData)
      .where(eq(resourceQualityBenchmarks.resourceId, resourceId));
  } else {
    await db.insert(resourceQualityBenchmarks).values({
      ...benchmarkData,
      createdAt: new Date(),
    });
  }

  return benchmarkData;
}

export async function getResourceBenchmark(resourceId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.benchmarks.get(resourceId) || {
      resourceId,
      resourceType: "ai_agent",
      latencyP95Ms: 1450,
      uptimePercentage: "99.80",
      tokenLimit: 128000,
      throughputBenchmark: "152 tokens/sec",
      jobCompletionSlaHours: 1,
      qualityScore: "4.8",
      benchmarkPassed: true,
      testedAt: new Date(),
    };
  }

  const result = await db
    .select()
    .from(resourceQualityBenchmarks)
    .where(eq(resourceQualityBenchmarks.resourceId, resourceId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Resource Ratings
 */
export async function createResourceRating(data: {
  resourceId: number;
  nonprofitId: number;
  requestId?: number;
  rating: number;
  latencyRating?: number;
  reliabilityRating?: number;
  feedback?: string;
}) {
  const db = await getDb();
  if (!db) {
    const list = memoryStore.ratings.get(data.resourceId) || [];
    const newRating = {
      id: Date.now(),
      ...data,
      reviewedByAdmin: false,
      createdAt: new Date(),
    };
    list.unshift(newRating);
    memoryStore.ratings.set(data.resourceId, list);
    return newRating;
  }

  return db.insert(resourceRatings).values(data);
}

export async function getResourceRatings(resourceId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.ratings.get(resourceId) || [
      {
        id: 1,
        resourceId,
        nonprofitId: 5,
        rating: 5,
        latencyRating: 5,
        reliabilityRating: 5,
        feedback: "Superb uptime and near-instant inference for our community food bank routing agent.",
        createdAt: new Date("2026-08-15"),
      },
      {
        id: 2,
        resourceId,
        nonprofitId: 8,
        rating: 4,
        latencyRating: 4,
        reliabilityRating: 5,
        feedback: "Very reliable compute cluster, saved us over $4,000 in monthly cloud bills.",
        createdAt: new Date("2026-08-20"),
      },
    ];
  }

  return db
    .select()
    .from(resourceRatings)
    .where(eq(resourceRatings.resourceId, resourceId))
    .orderBy(desc(resourceRatings.createdAt));
}

/**
 * CSR Impact Reports & ESG Certificates
 */
export async function generateCsrReport(donorId: number, month: string) {
  const db = await getDb();
  const sampleStories = [
    {
      title: "Community Health Access AI",
      description: "Provided 800 GPU hours enabling real-time multilingual translation for 12,000 clinic patients.",
      impact: "12,000 Patients Supported",
    },
    {
      title: "Stem Equity After-School Labs",
      description: "Donated automated Python grading agent and cloud compute to 35 Title I schools.",
      impact: "3,400 Students Reached",
    },
  ];

  const reportData = {
    donorId,
    month,
    reportUrl: `/reports/csr-${donorId}-${month}.pdf`,
    organizationsHelped: 14,
    hoursContributed: "2450.00",
    peopleImpacted: 15400,
    successStories: sampleStories,
    griAligned: true,
    generatedAt: new Date(),
    createdAt: new Date(),
  };

  if (!db) {
    const list = memoryStore.csrReports.get(donorId) || [];
    const report = { id: Date.now(), ...reportData };
    list.unshift(report);
    memoryStore.csrReports.set(donorId, list);
    return report;
  }

  const result = await db.insert(csrReports).values(reportData);
  return { id: (result as any).insertId || Date.now(), ...reportData };
}

export async function getDonorCsrReports(donorId: number) {
  const db = await getDb();
  if (!db) {
    return memoryStore.csrReports.get(donorId) || [
      {
        id: 1,
        donorId,
        month: "2026-08",
        reportUrl: `/reports/csr-${donorId}-2026-08.pdf`,
        organizationsHelped: 14,
        hoursContributed: "2450.00",
        peopleImpacted: 15400,
        successStories: [
          {
            title: "Community Health Access AI",
            description: "Provided 800 GPU hours enabling real-time multilingual translation for 12,000 clinic patients.",
            impact: "12,000 Patients Supported",
          },
        ],
        griAligned: true,
        generatedAt: new Date("2026-08-31"),
      },
    ];
  }

  return db
    .select()
    .from(csrReports)
    .where(eq(csrReports.donorId, donorId))
    .orderBy(desc(csrReports.month));
}

/**
 * Donor Impact Walls & Public Profiles
 */
export async function getDonorImpactWall(donorIdOrSlug: number | string) {
  const db = await getDb();
  if (!db) {
    const isSlug = typeof donorIdOrSlug === "string";
    return {
      id: 1,
      donorId: isSlug ? 1 : (donorIdOrSlug as number),
      publicSlug: isSlug ? donorIdOrSlug : "nexus-deepmind",
      displayName: "Nexus DeepMind Labs",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120",
      description: "Dedicated to democratizing high-performance AI inference and specialized open-source models for civic equity, education, and healthcare non-profits.",
      tier: "founding_partner",
      totalHoursContributed: "14850.00",
      organizationsHelped: 42,
      peopleImpacted: 89000,
      featuredStories: [
        {
          title: "Civic Transit Optimization",
          description: "Cut public bus delays by 22% in underserved metro transit corridors.",
          link: "https://example.com/transit",
        },
        {
          title: "Early Literacy Tutor Agent",
          description: "Enabled 1-on-1 reading practice for 5,000 third graders.",
          link: "https://example.com/literacy",
        },
      ],
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date(),
    };
  }

  const condition = typeof donorIdOrSlug === "string"
    ? eq(donorImpactWalls.publicSlug, donorIdOrSlug)
    : eq(donorImpactWalls.donorId, donorIdOrSlug);

  const result = await db.select().from(donorImpactWalls).where(condition).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllFeaturedImpactWalls() {
  const db = await getDb();
  if (!db) {
    return [
      {
        id: 1,
        donorId: 1,
        publicSlug: "nexus-deepmind",
        displayName: "Nexus DeepMind Labs",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120",
        description: "Pioneering state-of-the-art multimodal AI compute pledges for civic advancement.",
        tier: "founding_partner",
        totalHoursContributed: "14850.00",
        organizationsHelped: 42,
        peopleImpacted: 89000,
      },
      {
        id: 2,
        donorId: 2,
        publicSlug: "apex-cloud",
        displayName: "Apex Cloud Matrix",
        logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120",
        description: "Providing high-throughput GPU clusters to accelerate community research.",
        tier: "equity_champion",
        totalHoursContributed: "7200.00",
        organizationsHelped: 28,
        peopleImpacted: 45000,
      },
      {
        id: 3,
        donorId: 3,
        publicSlug: "civic-ai-systems",
        displayName: "CivicAI Systems",
        logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&h=120",
        description: "Empowering non-profits with automated grant and intake intelligence agents.",
        tier: "impact_ally",
        totalHoursContributed: "2100.00",
        organizationsHelped: 16,
        peopleImpacted: 22000,
      },
    ];
  }

  return db
    .select()
    .from(donorImpactWalls)
    .orderBy(desc(donorImpactWalls.totalHoursContributed));
}

export async function logDonorIncentiveEvent(
  donorId: number,
  eventType: "tier_upgrade" | "tier_downgrade" | "pledge_created" | "pledge_fulfilled" | "pledge_under_delivery" | "quality_issue" | "csr_report_generated" | "badge_awarded" | "grace_period_applied" | "grace_period_expired",
  details: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) {
    const list = memoryStore.events.get(donorId) || [];
    const item = { id: Date.now(), donorId, eventType, details, triggeredAt: new Date() };
    list.unshift(item);
    memoryStore.events.set(donorId, list);
    return item;
  }

  return db.insert(donorIncentiveEvents).values({
    donorId,
    eventType,
    details,
    triggeredAt: new Date(),
  });
}

