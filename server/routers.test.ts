import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Helper to create authenticated context
function createAuthContext(role: "donor" | "nonprofit" | "admin" = "nonprofit") {
  const ctx: TrpcContext = {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return ctx;
}

describe("Auth Router", () => {
  it("should return current user from me query", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toEqual(ctx.user);
  });

  it("should handle logout mutation", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});

describe("Donor Router", () => {
  it("should create donor profile", async () => {
    const ctx = createAuthContext("donor");
    const caller = appRouter.createCaller(ctx);

    const profile = await caller.donor.createProfile({
      companyName: "TechCorp Inc.",
      industry: "Technology",
      description: "Leading tech company",
      resources: ["AI Agents", "Computing"],
      contactEmail: "contact@techcorp.com",
      website: "https://techcorp.com",
    });

    expect(profile).toHaveProperty("id");
    expect(profile.companyName).toBe("TechCorp Inc.");
    expect(profile.userId).toBe(ctx.user?.id);
  });

  it("should list donor resources", async () => {
    const ctx = createAuthContext("donor");
    const caller = appRouter.createCaller(ctx);

    const resources = await caller.donor.listResources();
    expect(Array.isArray(resources)).toBe(true);
  });

  it("should create resource listing", async () => {
    const ctx = createAuthContext("donor");
    const caller = appRouter.createCaller(ctx);

    const resource = await caller.donor.createResource({
      title: "AI Content Moderation Agent",
      description: "Production-ready AI agent",
      category: "AI Agent",
      availability: "Available",
      specifications: { accuracy: "99.2%", latency: "<100ms" },
    });

    expect(resource).toHaveProperty("id");
    expect(resource.title).toBe("AI Content Moderation Agent");
  });

  it("should review resource request", async () => {
    const ctx = createAuthContext("donor");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.donor.reviewRequest({
      requestId: 1,
      action: "approve",
      message: "Approved! We're excited to help.",
    });

    expect(result).toHaveProperty("id");
    expect(result.status).toBe("approved");
  });
});

describe("Nonprofit Router", () => {
  it("should create nonprofit profile", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const profile = await caller.nonprofit.createProfile({
      organizationName: "Global Education Initiative",
      mission: "Democratizing education",
      sector: "Education",
      technicalProficiency: "Intermediate",
      primaryNeeds: ["AI Tools", "Data Analytics"],
      contactEmail: "contact@geinitiative.org",
      website: "https://geinitiative.org",
    });

    expect(profile).toHaveProperty("id");
    expect(profile.organizationName).toBe("Global Education Initiative");
  });

  it("should submit resource request", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const request = await caller.nonprofit.submitRequest({
      resourceId: 1,
      description: "We need this for our education program",
      expectedUsage: "Daily use in classrooms",
      timeline: "Immediate",
    });

    expect(request).toHaveProperty("id");
    expect(request.status).toBe("pending");
  });

  it("should get nonprofit impact metrics", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const metrics = await caller.nonprofit.getImpactMetrics();
    expect(metrics).toHaveProperty("resourcesReceived");
    expect(metrics).toHaveProperty("projectsEnabled");
    expect(metrics).toHaveProperty("peopleImpacted");
  });
});

describe("Coalition Router", () => {
  it("should create coalition", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const coalition = await caller.coalition.create({
      name: "Education Tech Alliance",
      mission: "Democratize AI education",
      description: "Alliance of education nonprofits",
    });

    expect(coalition).toHaveProperty("id");
    expect(coalition.name).toBe("Education Tech Alliance");
  });

  it("should add member to coalition", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.coalition.addMember({
      coalitionId: 1,
      nonprofitId: 2,
    });

    expect(result).toHaveProperty("id");
  });

  it("should list coalitions", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const coalitions = await caller.coalition.list();
    expect(Array.isArray(coalitions)).toBe(true);
  });
});

describe("Matching Router", () => {
  it("should get matches for nonprofit", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.matching.getMatches();
    expect(Array.isArray(matches)).toBe(true);
    matches.forEach((match) => {
      expect(match).toHaveProperty("resourceId");
      expect(match).toHaveProperty("score");
    });
  });

  it("should calculate match score", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const score = await caller.matching.calculateScore({
      resourceId: 1,
      nonprofitId: 1,
    });

    expect(typeof score).toBe("number");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("Request Router", () => {
  it("should get request status", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const request = await caller.request.getStatus({ requestId: 1 });
    expect(request).toHaveProperty("id");
    expect(request).toHaveProperty("status");
  });

  it("should send message on request", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const message = await caller.request.sendMessage({
      requestId: 1,
      message: "Thank you for approving our request!",
    });

    expect(message).toHaveProperty("id");
    expect(message.content).toBe("Thank you for approving our request!");
  });
});

describe("Impact Router", () => {
  it("should get platform impact stats", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.impact.getPlatformStats();
    expect(stats).toHaveProperty("totalPeopleImpacted");
    expect(stats).toHaveProperty("totalResourcesShared");
    expect(stats).toHaveProperty("totalProjectsEnabled");
  });

  it("should report outcome", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    const outcome = await caller.impact.reportOutcome({
      projectId: 1,
      title: "AI Training Program",
      description: "Trained 500 students",
      metricsAchieved: { studentsReached: 500, hoursOfTraining: 1000 },
    });

    expect(outcome).toHaveProperty("id");
    expect(outcome.title).toBe("AI Training Program");
  });
});

describe("Admin Router", () => {
  it("should list all users (admin only)", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const users = await caller.admin.listUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  it("should get moderation queue (admin only)", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const queue = await caller.admin.getModerationQueue();
    expect(Array.isArray(queue)).toBe(true);
  });

  it("should approve resource (admin only)", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.approveResource({
      resourceId: 1,
      notes: "Approved for platform",
    });

    expect(result).toHaveProperty("id");
    expect(result.status).toBe("approved");
  });

  it("should get platform analytics (admin only)", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const analytics = await caller.admin.getAnalytics();
    expect(analytics).toHaveProperty("totalUsers");
    expect(analytics).toHaveProperty("totalResources");
    expect(analytics).toHaveProperty("platformHealth");
  });
});

describe("Authorization", () => {
  it("should prevent nonprofit from accessing donor procedures", async () => {
    const ctx = createAuthContext("nonprofit");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.donor.createResource({
        title: "Test",
        description: "Test",
        category: "Test",
        availability: "Available",
        specifications: {},
      });
      expect.fail("Should have thrown authorization error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should prevent non-admin from accessing admin procedures", async () => {
    const ctx = createAuthContext("donor");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.listUsers();
      expect.fail("Should have thrown authorization error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
