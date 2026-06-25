import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";

// Protected procedure for donors only
const donorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "donor") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only donors can access this" });
  }
  return next({ ctx });
});

// Protected procedure for non-profits only
const nonprofitProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "nonprofit") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only non-profits can access this" });
  }
  return next({ ctx });
});

// Protected procedure for admins only
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
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

  // ============ USER PROFILE ROUTES ============
  user: router({
    // Complete user profile setup
    completeProfile: protectedProcedure
      .input(
        z.object({
          role: z.enum(["donor", "nonprofit"]),
          profileData: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        try {
          if (input.role === "donor") {
            await db.createDonorProfile(userId, input.profileData);
          } else {
            await db.createNonprofitProfile(userId, input.profileData);
          }

          // Mark profile as completed
          await db.updateUser(userId, { profileCompleted: true, role: input.role });

          return { success: true, role: input.role };
        } catch (error) {
          console.error("Profile completion error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to complete profile",
          });
        }
      }),

    // Get donor profile
    getDonorProfile: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorProfile(ctx.user.id);
    }),

    // Update donor profile
    updateDonorProfile: donorProcedure
      .input(z.record(z.string(), z.any()))
      .mutation(async ({ ctx, input }) => {
        await db.updateDonorProfile(ctx.user.id, input);
        return { success: true };
      }),

    // Get nonprofit profile
    getNonprofitProfile: nonprofitProcedure.query(async ({ ctx }) => {
      return db.getNonprofitProfile(ctx.user.id);
    }),

    // Update nonprofit profile
    updateNonprofitProfile: nonprofitProcedure
      .input(z.record(z.string(), z.any()))
      .mutation(async ({ ctx, input }) => {
        await db.updateNonprofitProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ============ RESOURCE ROUTES ============
  resource: router({
    // Create new resource
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
        const donor = await db.getDonorProfile(ctx.user.id);
        if (!donor) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Complete donor profile first",
          });
        }

        await db.createResource(ctx.user.id, input);
        return { success: true };
      }),

    // Get single resource
    get: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getResource(input);
    }),

    // Search resources
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

    // Get donor's resources
    getDonorResources: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorResources(ctx.user.id);
    }),

    // Update resource
    update: donorProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const resource = await db.getResource(input.id);
        if (!resource || resource.donorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateResource(input.id, input.data);
        return { success: true };
      }),
  }),

  // ============ COALITION ROUTES ============
  coalition: router({
    // Create coalition
    create: nonprofitProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          mission: z.string().optional(),
          sectors: z.array(z.string()).optional(),
          sharedGoals: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createCoalition(ctx.user.id, input);
        return { success: true };
      }),

    // Get coalition
    get: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getCoalition(input);
    }),

    // Get coalition members
    getMembers: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getCoalitionMembers(input);
    }),

    // Add member to coalition
    addMember: protectedProcedure
      .input(
        z.object({
          coalitionId: z.number(),
          nonprofitId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const coalition = await db.getCoalition(input.coalitionId);
        if (!coalition || coalition.creatorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.addCoalitionMember(input.coalitionId, input.nonprofitId);
        return { success: true };
      }),
  }),

  // ============ REQUEST ROUTES ============
  request: router({
    // Create resource request
    create: nonprofitProcedure
      .input(
        z.object({
          resourceId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          requestedCapacity: z.number().optional(),
          intendedUse: z.string().optional(),
          expectedOutcome: z.string().optional(),
          coalitionId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createResourceRequest({
          resourceId: input.resourceId,
          requesterId: ctx.user.id,
          coalitionId: input.coalitionId,
          title: input.title,
          description: input.description,
          requestedCapacity: input.requestedCapacity,
          intendedUse: input.intendedUse,
          expectedOutcome: input.expectedOutcome,
        });

        return { success: true };
      }),

    // Get request
    get: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
      const request = await db.getResourceRequest(input);
      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check authorization
      const resource = await db.getResource(request.resourceId);
      if (
        ctx.user.id !== request.requesterId &&
        ctx.user.id !== resource?.donorId &&
        ctx.user.role !== "admin"
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return request;
    }),

    // Get nonprofit's requests
    getNonprofitRequests: nonprofitProcedure.query(async ({ ctx }) => {
      return db.getNonprofitRequests(ctx.user.id);
    }),

    // Get donor's requests (for their resources)
    getDonorRequests: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorRequests(ctx.user.id);
    }),

    // Approve request
    approve: donorProcedure
      .input(
        z.object({
          requestId: z.number(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const request = await db.getResourceRequest(input.requestId);
        if (!request) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const resource = await db.getResource(request.resourceId);
        if (!resource || resource.donorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateResourceRequest(input.requestId, {
          status: "approved",
          approvedBy: ctx.user.id,
          approvalDate: new Date(),
          startDate: input.startDate,
          endDate: input.endDate,
        });

        return { success: true };
      }),

    // Reject request
    reject: donorProcedure
      .input(
        z.object({
          requestId: z.number(),
          rejectionReason: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const request = await db.getResourceRequest(input.requestId);
        if (!request) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const resource = await db.getResource(request.resourceId);
        if (!resource || resource.donorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateResourceRequest(input.requestId, {
          status: "rejected",
          rejectionReason: input.rejectionReason,
        });

        return { success: true };
      }),
  }),

  // ============ MESSAGING ROUTES ============
  message: router({
    // Send message
    send: protectedProcedure
      .input(
        z.object({
          requestId: z.number(),
          recipientId: z.number(),
          content: z.string().min(1),
          attachmentUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createMessage({
          requestId: input.requestId,
          senderId: ctx.user.id,
          recipientId: input.recipientId,
          content: input.content,
          attachmentUrl: input.attachmentUrl,
        });

        return { success: true };
      }),

    // Get request messages
    getRequestMessages: protectedProcedure.input(z.number()).query(async ({ input }) => {
      return db.getRequestMessages(input);
    }),
  }),

  // ============ IMPACT ROUTES ============
  impact: router({
    // Report impact
    report: nonprofitProcedure
      .input(
        z.object({
          requestId: z.number(),
          hoursContributed: z.number().optional(),
          projectsEnabled: z.number().optional(),
          peopleImpacted: z.number().optional(),
          outcomesReported: z.array(z.string()).optional(),
          successStory: z.string().optional(),
          metrics: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const request = await db.getResourceRequest(input.requestId);
        if (!request || request.requesterId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const resource = await db.getResource(request.resourceId);
        if (!resource) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await db.createImpactMetric({
          requestId: input.requestId,
          nonprofitId: ctx.user.id,
          donorId: resource.donorId,
          hoursContributed: input.hoursContributed,
          projectsEnabled: input.projectsEnabled,
          peopleImpacted: input.peopleImpacted,
          outcomesReported: input.outcomesReported,
          successStory: input.successStory,
          metrics: input.metrics,
        });

        return { success: true };
      }),

    // Get nonprofit impact metrics
    getNonprofitMetrics: nonprofitProcedure.query(async ({ ctx }) => {
      return db.getNonprofitImpactMetrics(ctx.user.id);
    }),

    // Get donor impact metrics
    getDonorMetrics: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorImpactMetrics(ctx.user.id);
    }),
  }),

  // ============ NOTIFICATION ROUTES ============
  notification: router({
    // Get user notifications
    getNotifications: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getUserNotifications(ctx.user.id, input.unreadOnly);
      }),

    // Mark as read
    markAsRead: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input);
        return { success: true };
      }),
  }),

  // ============ MATCHING ROUTES ============
  match: router({
    // Get nonprofit matches
    getNonprofitMatches: nonprofitProcedure.query(async ({ ctx }) => {
      return db.getNonprofitMatches(ctx.user.id);
    }),

    // Get donor matches
    getDonorMatches: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorMatches(ctx.user.id);
    }),
  }),

  // ============ GRANT WRITING ROUTES ============
  grantWriting: router({
    // Create grant writing session
    createSession: nonprofitProcedure
      .input(
        z.object({
          title: z.string().min(1),
          grantType: z.string().optional(),
          fundingAmount: z.number().optional(),
          deadline: z.date().optional(),
          context: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createGrantWritingSession(ctx.user.id, input);
        return { success: true };
      }),

    // Get grant writing session
    getSession: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
      const session = await db.getGrantWritingSession(input);
      if (!session || (session.nonprofitId !== ctx.user.id && ctx.user.role !== "admin")) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return session;
    }),

    // Get nonprofit grant sessions
    getNonprofitSessions: nonprofitProcedure.query(async ({ ctx }) => {
      return db.getNonprofitGrantSessions(ctx.user.id);
    }),

    // Update grant session
    updateSession: nonprofitProcedure
      .input(
        z.object({
          sessionId: z.number(),
          data: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = await db.getGrantWritingSession(input.sessionId);
        if (!session || session.nonprofitId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateGrantWritingSession(input.sessionId, input.data);
        return { success: true };
      }),
  }),

  // ============ ADMIN ROUTES ============
  admin: router({
    // Get platform stats
    getPlatformStats: adminProcedure.query(async () => {
      return db.getPlatformStats();
    }),

    // Update platform stats
    updatePlatformStats: adminProcedure
      .input(z.record(z.string(), z.any()))
      .mutation(async ({ input }) => {
        await db.updatePlatformStats(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
