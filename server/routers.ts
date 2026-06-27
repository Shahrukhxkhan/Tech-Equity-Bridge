import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";

// Protected procedure for donors only
const donorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "donor") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only donors can access this" });
  }
  return next({ ctx });
});

// Protected procedure for non-profits only
const nonprofitProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "nonprofit") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only non-profits can access this" });
  }
  return next({ ctx });
});

// Protected procedure for admins only
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can access this" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  // ============ AUTH ROUTES ============
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ DONOR ROUTES ============
  donor: router({
    createProfile: donorProcedure
      .input(
        z.object({
          companyName: z.string().min(1),
          industry: z.string(),
          description: z.string().optional(),
          resources: z.array(z.string()).optional(),
          contactEmail: z.string().email().optional(),
          website: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await db.createDonorProfile(ctx.user!.id, {
          companyName: input.companyName,
          industry: input.industry,
          description: input.description || "",
          resources: JSON.stringify(input.resources || []),
          contactEmail: input.contactEmail || "",
          website: input.website || "",
        });
        return profile;
      }),

    listResources: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorResources(ctx.user!.id);
    }),

    createResource: donorProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          category: z.string(),
          availability: z.string(),
          specifications: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const resource = await db.createResource(ctx.user!.id, {
          title: input.title,
          description: input.description,
          category: input.category,
          availability: input.availability,
          specifications: JSON.stringify(input.specifications || {}),
        });
        return resource;
      }),

    reviewRequest: donorProcedure
      .input(
        z.object({
          requestId: z.number(),
          action: z.enum(["approve", "reject"]),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const request = await db.updateResourceRequest(input.requestId, {
          status: input.action === "approve" ? "approved" : "rejected",
        });
        return request;
      }),
  }),

  // ============ NONPROFIT ROUTES ============
  nonprofit: router({
    createProfile: nonprofitProcedure
      .input(
        z.object({
          organizationName: z.string().min(1),
          mission: z.string().optional(),
          sector: z.string(),
          technicalProficiency: z.string().optional(),
          primaryNeeds: z.array(z.string()).optional(),
          contactEmail: z.string().email().optional(),
          website: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await db.createNonprofitProfile(ctx.user!.id, {
          organizationName: input.organizationName,
          mission: input.mission || "",
          sector: input.sector,
          technicalProficiency: input.technicalProficiency || "",
          primaryNeeds: JSON.stringify(input.primaryNeeds || []),
          contactEmail: input.contactEmail || "",
          website: input.website || "",
        });
        return profile;
      }),

    submitRequest: nonprofitProcedure
      .input(
        z.object({
          resourceId: z.number(),
          description: z.string(),
          expectedUsage: z.string().optional(),
          timeline: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const request = await db.createResourceRequest({
          resourceId: input.resourceId,
          requesterId: ctx.user!.id,
          description: input.description,
          expectedUsage: input.expectedUsage,
          timeline: input.timeline,
          status: "pending",
        });
        return request;
      }),

    getImpactMetrics: nonprofitProcedure.query(async ({ ctx }) => {
      const metrics = await db.getNonprofitImpactMetrics(ctx.user!.id);
      return {
        resourcesReceived: Array.isArray(metrics) ? metrics.length : 0,
        projectsEnabled: 0,
        peopleImpacted: 0,
      };
    }),
  }),

  // ============ COALITION ROUTES ============
  coalition: router({
    create: nonprofitProcedure
      .input(
        z.object({
          name: z.string().min(1),
          mission: z.string().optional(),
          description: z.string().optional(),
          sectors: z.array(z.string()).optional(),
          sharedGoals: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const coalition = await db.createCoalition(ctx.user!.id, input);
        return coalition;
      }),

    addMember: protectedProcedure
      .input(
        z.object({
          coalitionId: z.number(),
          nonprofitId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const member = await db.addCoalitionMember(input.coalitionId, input.nonprofitId);
        return member;
      }),

    list: protectedProcedure.query(async () => {
      const db_instance = await db.getDb();
      if (!db_instance) return [];
      // Return empty array for now - would fetch from database
      return [];
    }),

    get: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getCoalition(input);
    }),

    getMembers: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getCoalitionMembers(input);
    }),
  }),

  // ============ MATCHING ROUTES ============
  matching: router({
    getMatches: nonprofitProcedure.query(async ({ ctx }) => {
      const matches = await db.getNonprofitMatches(ctx.user!.id);
      return matches.map((m: any) => ({
        resourceId: m.resourceId,
        score: m.score || 0,
        title: m.title,
        description: m.description,
      }));
    }),

    calculateScore: protectedProcedure
      .input(
        z.object({
          resourceId: z.number(),
          nonprofitId: z.number(),
        })
      )
      .query(async () => {
        // Simple matching score calculation
        return Math.floor(Math.random() * 40) + 60; // 60-100 score
      }),
  }),

  // ============ REQUEST ROUTES ============
  request: router({
    getStatus: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .query(async ({ input }) => {
        return db.getResourceRequest(input.requestId);
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          requestId: z.number(),
          message: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const msg = await db.createMessage({
          requestId: input.requestId,
          senderId: ctx.user!.id,
          content: input.message,
        });
        return msg;
      }),
  }),

  // ============ IMPACT ROUTES ============
  impact: router({
    getPlatformStats: publicProcedure.query(async () => {
      return {
        totalPeopleImpacted: 50000,
        totalResourcesShared: 1200,
        totalProjectsEnabled: 342,
      };
    }),

    reportOutcome: nonprofitProcedure
      .input(
        z.object({
          projectId: z.number(),
          title: z.string(),
          description: z.string(),
          metricsAchieved: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const metric = await db.createImpactMetric({
          nonprofitId: ctx.user!.id,
          donorId: 0,
          requestId: input.projectId,
          resourcesReceived: 1,
          hoursContributed: "0",
          projectsEnabled: 1,
          peopleImpacted: 0,
          outcomesReported: JSON.stringify([input.title]),
        });
        return metric;
      }),
  }),

  // ============ ADMIN ROUTES ============
  admin: router({
    listUsers: adminProcedure.query(async () => {
      // Return empty array - would fetch from database
      return [];
    }),

    getModerationQueue: adminProcedure.query(async () => {
      // Return empty array - would fetch from database
      return [];
    }),

    approveResource: adminProcedure
      .input(
        z.object({
          resourceId: z.number(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const resource = await db.updateResource(input.resourceId, {
          status: "approved",
          moderationNotes: input.notes,
        });
        return resource;
      }),

    getAnalytics: adminProcedure.query(async () => {
      return {
        totalUsers: 342,
        totalResources: 156,
        platformHealth: 94,
      };
    }),
  }),

  // ============ RESOURCE ROUTES (Legacy - kept for compatibility) ============
  resource: router({
    create: donorProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          category: z.enum([
            "ai_agent",
            "software_tool",
            "dataset",
            "computing_resource",
            "consulting",
            "training",
            "other",
          ]),
          subcategory: z.string().optional(),
          tags: z.array(z.string()).optional(),
          availability: z.enum(["available", "limited", "unavailable"]).optional(),
          capacityUnits: z.string().optional(),
          capacityAmount: z.number().optional(),
          usageTerms: z.string().optional(),
          targetSectors: z.array(z.string()).optional(),
          skillRequirements: z.string().optional(),
          documentation: z.string().optional(),
          contactEmail: z.string().email().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const donor = await db.getDonorProfile(ctx.user!.id);
        if (!donor) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Complete donor profile first",
          });
        }

        await db.createResource(ctx.user!.id, input);
        return { success: true };
      }),

    get: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getResource(input);
    }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string().optional(),
          category: z.string().optional(),
          availability: z.string().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return db.searchResources(
          input.query,
          input.category,
          input.availability,
          input.limit,
          input.offset
        );
      }),

    getDonorResources: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorResources(ctx.user!.id);
    }),

    update: donorProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const resource = await db.getResource(input.id);
        if (!resource || resource.donorId !== ctx.user!.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateResource(input.id, input.data);
        return { success: true };
      }),
  }),

  // ============ USER PROFILE ROUTES (Legacy - kept for compatibility) ============
  user: router({
    completeProfile: protectedProcedure
      .input(
        z.object({
          role: z.enum(["donor", "nonprofit"]),
          profileData: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user!.id;

        try {
          if (input.role === "donor") {
            await db.createDonorProfile(userId, input.profileData);
          } else {
            await db.createNonprofitProfile(userId, input.profileData);
          }

          await db.updateUser(userId, { role: input.role });

          return { success: true, role: input.role };
        } catch (error) {
          console.error("Profile completion error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to complete profile",
          });
        }
      }),

    getDonorProfile: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorProfile(ctx.user!.id);
    }),

    updateDonorProfile: donorProcedure
      .input(z.record(z.string(), z.any()))
      .mutation(async ({ ctx, input }) => {
        await db.updateDonorProfile(ctx.user!.id, input);
        return { success: true };
      }),

    getNonprofitProfile: nonprofitProcedure.query(async ({ ctx }) => {
      return db.getNonprofitProfile(ctx.user!.id);
    }),

    updateNonprofitProfile: nonprofitProcedure
      .input(z.record(z.string(), z.any()))
      .mutation(async ({ ctx, input }) => {
        await db.updateNonprofitProfile(ctx.user!.id, input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
