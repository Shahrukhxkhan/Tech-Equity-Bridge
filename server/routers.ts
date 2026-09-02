import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";
import * as workerQueue from "./workerQueue";
import * as webhooks from "./webhooks";
import * as a2aEngine from "./a2aEngine";
import * as iamEngine from "./iamEngine";
import * as edgeMeshEngine from "./edgeMeshEngine";

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

  // ============ MATCHING ROUTES (v2 Semantic Engine) ============
  matching: router({
    getMatches: publicProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id || 1;
      return db.getSemanticMatchesForNonprofit(userId);
    }),

    getSemanticMatches: publicProcedure
      .input(z.object({ nonprofitId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const userId = input?.nonprofitId || ctx.user?.id || 1;
        return db.getSemanticMatchesForNonprofit(userId);
      }),

    calculateScore: publicProcedure
      .input(
        z.object({
          resourceId: z.number(),
          nonprofitId: z.number(),
        })
      )
      .query(async ({ input }) => {
        const nonprofit = await db.getNonprofitProfile(input.nonprofitId);
        const resource = await db.getResource(input.resourceId);
        return db.computeSemanticMatch(nonprofit, resource || { id: input.resourceId, title: "Resource", category: "AI Agents" });
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

  // ============ PHASE 16: DONOR INCENTIVE & COMMITMENT ENGINE ============
  incentive: router({
    getDonorTier: publicProcedure
      .input(z.object({ donorId: z.number() }))
      .query(async ({ input }) => {
        return db.getDonorIncentiveTier(input.donorId);
      }),

    getMyTier: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorIncentiveTier(ctx.user!.id);
    }),

    setDonorTier: donorProcedure
      .input(
        z.object({
          tier: z.enum(["impact_ally", "equity_champion", "founding_partner"]),
          monthlyPledgeAmount: z.number().positive(),
          pledgeUnit: z.enum(["gpu_hours", "api_calls", "agent_hours", "compute_units"]),
          badgePublic: z.boolean().optional(),
          csrReportsEnabled: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await db.createOrUpdateDonorIncentiveTier(ctx.user!.id, input);
        await db.logDonorIncentiveEvent(ctx.user!.id, "pledge_created", {
          tier: input.tier,
          monthlyPledgeAmount: input.monthlyPledgeAmount,
          unit: input.pledgeUnit,
        });
        return result;
      }),

    getPledges: publicProcedure
      .input(z.object({ donorId: z.number() }))
      .query(async ({ input }) => {
        return db.getDonorPledges(input.donorId);
      }),

    getMyPledges: donorProcedure.query(async ({ ctx }) => {
      return db.getDonorPledges(ctx.user!.id);
    }),

    createPledge: donorProcedure
      .input(
        z.object({
          resourceType: z.enum(["ai_agent", "gpu_compute", "data_processing", "software_tool"]),
          quantity: z.number().positive(),
          unit: z.string().min(1),
          availabilityWindows: z.array(
            z.object({
              day: z.string(),
              startTime: z.string(),
              endTime: z.string(),
            })
          ),
          startDate: z.date().or(z.string().transform(s => new Date(s))),
          endDate: z.date().or(z.string().transform(s => new Date(s))).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const pledge = await db.createResourcePledge(ctx.user!.id, {
          ...input,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : undefined,
        });
        await db.logDonorIncentiveEvent(ctx.user!.id, "pledge_created", {
          resourceType: input.resourceType,
          quantity: input.quantity,
          unit: input.unit,
        });
        return pledge;
      }),

    updatePledgeStatus: donorProcedure
      .input(
        z.object({
          pledgeId: z.number(),
          status: z.enum(["active", "paused", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateResourcePledgeStatus(input.pledgeId, input.status);
      }),

    getFulfillmentHistory: publicProcedure
      .input(z.object({ pledgeId: z.number() }))
      .query(async ({ input }) => {
        return db.getPledgeFulfillmentHistory(input.pledgeId);
      }),

    logFulfillment: protectedProcedure
      .input(
        z.object({
          pledgeId: z.number(),
          month: z.string(), // YYYY-MM
          pledgedAmount: z.number().positive(),
          deliveredAmount: z.number().nonnegative(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const log = await db.logPledgeFulfillment(input.pledgeId, input.month, {
          pledgedAmount: input.pledgedAmount,
          deliveredAmount: input.deliveredAmount,
          donorId: ctx.user?.id,
        });

        if (input.deliveredAmount < input.pledgedAmount * 0.8) {
          await db.logDonorIncentiveEvent(ctx.user?.id || 1, "pledge_under_delivery", {
            pledgeId: input.pledgeId,
            month: input.month,
            shortfallPercentage: (((input.pledgedAmount - input.deliveredAmount) / input.pledgedAmount) * 100).toFixed(1),
          });
        }

        return log;
      }),

    runBenchmark: protectedProcedure
      .input(
        z.object({
          resourceId: z.number(),
          resourceType: z.enum(["ai_agent", "gpu_compute", "data_processing", "software_tool"]),
          customOverrides: z
            .object({
              latencyP95Ms: z.number().optional(),
              uptimePercentage: z.number().optional(),
              tokenLimit: z.number().optional(),
              throughputBenchmark: z.string().optional(),
              jobCompletionSlaHours: z.number().optional(),
            })
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.runResourceBenchmark(input.resourceId, input.resourceType, input.customOverrides);
        return result;
      }),

    getResourceBenchmark: publicProcedure
      .input(z.object({ resourceId: z.number() }))
      .query(async ({ input }) => {
        return db.getResourceBenchmark(input.resourceId);
      }),

    submitRating: protectedProcedure
      .input(
        z.object({
          resourceId: z.number(),
          rating: z.number().min(1).max(5),
          latencyRating: z.number().min(1).max(5).optional(),
          reliabilityRating: z.number().min(1).max(5).optional(),
          feedback: z.string().optional(),
          requestId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const rating = await db.createResourceRating({
          ...input,
          nonprofitId: ctx.user!.id,
        });

        if (input.rating < 3) {
          await db.logDonorIncentiveEvent(1, "quality_issue", {
            resourceId: input.resourceId,
            rating: input.rating,
            feedback: input.feedback,
          });
        }

        return rating;
      }),

    getResourceRatings: publicProcedure
      .input(z.object({ resourceId: z.number() }))
      .query(async ({ input }) => {
        return db.getResourceRatings(input.resourceId);
      }),

    getCsrReports: publicProcedure
      .input(z.object({ donorId: z.number() }))
      .query(async ({ input }) => {
        return db.getDonorCsrReports(input.donorId);
      }),

    generateCsrReport: donorProcedure
      .input(z.object({ month: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const report = await db.generateCsrReport(ctx.user!.id, input.month);
        await db.logDonorIncentiveEvent(ctx.user!.id, "csr_report_generated", {
          month: input.month,
          reportId: report.id,
        });
        return report;
      }),

    getImpactWall: publicProcedure
      .input(z.object({ slugOrId: z.union([z.string(), z.number()]) }))
      .query(async ({ input }) => {
        return db.getDonorImpactWall(input.slugOrId);
      }),

    getFeaturedDonors: publicProcedure.query(async () => {
      return db.getAllFeaturedImpactWalls();
    }),

    getAdminPledgeMonitor: adminProcedure.query(async () => {
      return db.getAdminPledgeMonitor();
    }),
  }),

  // ============ AI AGENT PLAYGROUND & SANDBOX ============
  agentSandbox: router({
    executeAgent: publicProcedure
      .input(
        z.object({
          agentType: z.enum([
            "multilingual_health",
            "grant_screener",
            "data_extractor",
            "literacy_tutor",
            "custom",
          ]),
          inputPrompt: z.string().min(1),
          parameters: z
            .object({
              temperature: z.number().optional(),
              maxTokens: z.number().optional(),
              language: z.string().optional(),
            })
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.executeSandboxAgent(input.agentType, input.inputPrompt, input.parameters);
      }),
  }),

  // ============ GRANT ASSISTANT V2 (RFP PARSER & AUTOFILL) ============
  grantAssistant: router({
    parseRfp: publicProcedure
      .input(z.object({ rfpText: z.string().min(10) }))
      .mutation(async ({ input }) => {
        return db.parseRfpText(input.rfpText);
      }),

    autofillSection: publicProcedure
      .input(
        z.object({
          sectionName: z.string(),
          rfpContext: z.object({
            opportunityTitle: z.string().optional(),
            funderName: z.string().optional(),
            maxAwardAmount: z.string().optional(),
            submissionDeadline: z.string().optional(),
          }),
          tone: z.enum(["formal", "urgent", "community", "data_driven"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const nonprofit = ctx.user ? await db.getNonprofitProfile(ctx.user.id) : null;
        return {
          sectionName: input.sectionName,
          content: db.generateContextAwareGrantSection(
            input.sectionName,
            input.rfpContext,
            nonprofit,
            input.tone || "formal"
          ),
        };
      }),
  }),

  // ============ COALITION WORKSPACE & TASK MANAGEMENT ============
  coalitionWorkspace: router({
    getTasks: publicProcedure
      .input(z.object({ coalitionId: z.number().default(1) }))
      .query(async ({ input }) => {
        return db.getCoalitionTasks(input.coalitionId);
      }),

    createTask: publicProcedure
      .input(
        z.object({
          coalitionId: z.number().default(1),
          title: z.string().min(1),
          description: z.string().optional(),
          assigneeName: z.string().optional(),
          assigneeOrg: z.string().optional(),
          stage: z.enum(["backlog", "todo", "in_progress", "review", "done"]).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          dueDate: z.date().or(z.string().transform(s => new Date(s))).optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createCoalitionTask(input.coalitionId, {
          ...input,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        });
      }),

    updateTaskStage: publicProcedure
      .input(
        z.object({
          taskId: z.number(),
          stage: z.enum(["backlog", "todo", "in_progress", "review", "done"]),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateCoalitionTaskStage(input.taskId, input.stage);
      }),

    deleteTask: publicProcedure
      .input(z.object({ taskId: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteCoalitionTask(input.taskId);
      }),

    getResourcePools: publicProcedure
      .input(z.object({ coalitionId: z.number().default(1) }))
      .query(async ({ input }) => {
        return db.getCoalitionResourcePools(input.coalitionId);
      }),

    updateMemberAllocation: publicProcedure
      .input(
        z.object({
          poolId: z.number(),
          memberAllocations: z.array(
            z.object({
              nonprofitId: z.number(),
              orgName: z.string(),
              allocatedAmount: z.number().nonnegative(),
              usedAmount: z.number().nonnegative(),
              contactPerson: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateCoalitionMemberAllocation(input.poolId, input.memberAllocations);
      }),
  }),

  // ============ REAL-TIME COLLABORATION & LIVE CHAT ============
  collaboration: router({
    getThreadMessages: publicProcedure
      .input(z.object({ requestId: z.number().default(1) }))
      .query(async ({ input }) => {
        return db.getRequestThreadMessages(input.requestId);
      }),

    sendMessage: publicProcedure
      .input(
        z.object({
          requestId: z.number().default(1),
          senderId: z.number().default(1),
          senderName: z.string(),
          senderRole: z.enum(["donor", "nonprofit", "admin"]).optional(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        return db.sendRequestThreadMessage(input);
      }),

    getLiveNotifications: publicProcedure
      .input(z.object({ userId: z.number().default(1) }))
      .query(async ({ input }) => {
        return db.getUserLiveNotifications(input.userId);
      }),
  }),

  // ============ ANALYTICS, GEOSPATIAL MAP & AUDIT EXPORT ============
  analytics: router({
    getGeospatialProjects: publicProcedure.query(async () => {
      return db.getGeospatialImpactProjects();
    }),

    getPublicNonprofits: publicProcedure.query(async () => {
      return db.getPublicNonprofitDirectory();
    }),

    getAuditLogs: publicProcedure.query(async () => {
      return db.getPlatformAuditLogs();
    }),

    exportAuditData: publicProcedure
      .input(z.object({ format: z.enum(["csv", "json"]).default("csv") }))
      .mutation(async ({ input }) => {
        return db.exportComplianceData(input.format);
      }),
  }),

  // ============ PRODUCTION INFRASTRUCTURE & WEBHOOKS ============
  infrastructure: router({
    getSystemHealth: publicProcedure.query(async () => {
      const dbHealth = await db.checkDatabaseHealth();
      const queueStats = workerQueue.getBackgroundJobStats();
      const memoryUsage = process.memoryUsage();

      return {
        database: dbHealth,
        workerQueue: queueStats,
        uptimeSeconds: Math.floor(process.uptime()),
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        },
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development",
      };
    }),

    getWorkerJobs: publicProcedure.query(async () => {
      return {
        stats: workerQueue.getBackgroundJobStats(),
        jobs: workerQueue.getRecentBackgroundJobs(15),
      };
    }),

    enqueueJob: publicProcedure
      .input(
        z.object({
          type: z.enum([
            "GENERATE_MONTHLY_CSR_REPORTS",
            "RUN_SLA_BENCHMARKS",
            "SEND_EMAIL_NOTIFICATION_ALERTS",
            "DISPATCH_WEBHOOK_EVENT",
            "CLEANUP_AUDIT_LOGS_AND_CACHE",
          ]),
          payload: z.record(z.string(), z.any()).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return workerQueue.enqueueBackgroundJob(input.type, input.payload, input.priority);
      }),

    getWebhooks: publicProcedure.query(async () => {
      return webhooks.getWebhookConfigs();
    }),

    saveWebhook: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          platform: z.enum(["slack", "discord", "teams", "generic"]),
          url: z.string().url(),
          enabledEvents: z.array(
            z.enum([
              "RESOURCE_REQUEST_APPROVED",
              "NEW_HIGH_MATCH_RESOURCE",
              "COALITION_MILESTONE_COMPLETED",
              "PLEDGE_UNDER_DELIVERY_ALERT",
              "SLA_BENCHMARK_VIOLATION",
            ])
          ),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        return webhooks.saveWebhookConfig(input);
      }),

    deleteWebhook: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return { success: webhooks.deleteWebhookConfig(input.id) };
      }),

    testWebhook: publicProcedure
      .input(
        z.object({
          platform: z.enum(["slack", "discord", "teams", "generic"]),
          url: z.string().url(),
          event: z
            .enum([
              "RESOURCE_REQUEST_APPROVED",
              "NEW_HIGH_MATCH_RESOURCE",
              "COALITION_MILESTONE_COMPLETED",
              "PLEDGE_UNDER_DELIVERY_ALERT",
              "SLA_BENCHMARK_VIOLATION",
            ])
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        return webhooks.testWebhookEndpoint(input.platform, input.url, input.event);
      }),
  }),

  // ============ AUTONOMOUS AGENT-TO-AGENT (A2A) NEGOTIATOR ============
  a2a: router({
    startNegotiation: publicProcedure
      .input(
        z.object({
          nonprofitProfile: z.object({
            name: z.string().min(1),
            mission: z.string().min(1),
            sector: z.string().min(1),
            requestedHours: z.number().optional(),
          }),
          resourceOffer: z.object({
            id: z.number(),
            title: z.string(),
            donor: z.string(),
            donorTier: z.string(),
            maxCapacity: z.number(),
          }),
          preferences: z
            .object({
              flexOffPeak: z.boolean().optional(),
              targetBeneficiaries: z.number().optional(),
            })
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        return a2aEngine.executeA2ANegotiation(
          input.nonprofitProfile,
          input.resourceOffer,
          input.preferences
        );
      }),

    getSessionHistory: publicProcedure.query(async () => {
      return a2aEngine.getA2ANegotiationHistory();
    }),

    getSmartSchedule: publicProcedure.query(async () => {
      return a2aEngine.getDynamic24HourGpuSchedule();
    }),

    triggerSmartRebalance: publicProcedure.mutation(async () => {
      return a2aEngine.triggerDynamicRebalance();
    }),
  }),

  // ============ ENTERPRISE SSO & GRANULAR RBAC (IAM) ============
  iam: router({
    getCurrentRole: publicProcedure.query(async () => {
      return iamEngine.getCurrentSessionRole();
    }),

    switchRole: publicProcedure
      .input(
        z.object({
          role: z.enum([
            "csr_executive",
            "sla_auditor",
            "coalition_lead",
            "grant_navigator",
            "public_auditor",
            "admin",
          ]),
        })
      )
      .mutation(async ({ input }) => {
        return iamEngine.switchActiveSessionRole(input.role);
      }),

    getPermissionMatrix: publicProcedure.query(async () => {
      return {
        matrix: iamEngine.RBAC_PERMISSION_MATRIX,
        current: iamEngine.getCurrentSessionRole(),
      };
    }),

    validateAccess: publicProcedure
      .input(
        z.object({
          feature: z.enum([
            "VIEW_ESG_CERTIFICATES",
            "GENERATE_CSR_REPORTS",
            "RUN_SLA_BENCHMARKS",
            "MANAGE_GPU_ENDPOINTS",
            "REBALANCE_COALITION_QUOTAS",
            "MANAGE_MILESTONE_TASKS",
            "DRAFT_GRANT_PROPOSALS",
            "INITIATE_A2A_NEGOTIATIONS",
            "ACCESS_AUDIT_LEDGER",
            "EXPORT_COMPLIANCE_CSV",
            "MANAGE_IAM_AND_SSO",
          ]),
        })
      )
      .query(async ({ input }) => {
        const current = iamEngine.getCurrentSessionRole();
        const allowed = iamEngine.canAccessFeature(current.role, input.feature);
        return {
          allowed,
          role: current.role,
          feature: input.feature,
        };
      }),

    getSsoProviders: publicProcedure.query(async () => {
      return iamEngine.getSsoProviderConfigs();
    }),

    saveSsoProvider: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          providerType: z.enum(["okta", "entra_id", "google_workspace", "saml_generic"]),
          protocol: z.enum(["SAML_2_0", "OIDC"]),
          entityId: z.string().min(1),
          ssoLoginUrl: z.string().url(),
          clientDomain: z.string().min(1),
          jitProvisioningEnabled: z.boolean().default(true),
          defaultAssignedRole: z.enum([
            "csr_executive",
            "sla_auditor",
            "coalition_lead",
            "grant_navigator",
            "public_auditor",
            "admin",
          ]),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        return iamEngine.saveSsoProviderConfig(input);
      }),

    testSsoConnection: publicProcedure
      .input(z.object({ providerId: z.string() }))
      .mutation(async ({ input }) => {
        return iamEngine.testSsoProviderConnection(input.providerId);
      }),
  }),

  // ============ OFFLINE-FIRST EDGE COMPUTE MESH & CRDT SYNC ============
  edgeMesh: router({
    getEdgeNodes: publicProcedure.query(async () => {
      return edgeMeshEngine.getEdgeNodesList();
    }),

    getQuantizedModels: publicProcedure.query(async () => {
      return edgeMeshEngine.getQuantizedModelsList();
    }),

    getCrdtRecords: publicProcedure.query(async () => {
      return edgeMeshEngine.getCrdtLedgerRecords();
    }),

    runLocalInference: publicProcedure
      .input(
        z.object({
          modelId: z.string(),
          inputPrompt: z.string(),
          nodeId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return edgeMeshEngine.runLocalEdgeInference(
          input.modelId,
          input.inputPrompt,
          input.nodeId
        );
      }),

    syncMeshToCloud: publicProcedure.mutation(async () => {
      return edgeMeshEngine.reconcileCrdtMeshToCloud();
    }),
  }),
});

export type AppRouter = typeof appRouter;



