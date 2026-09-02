import { describe, it, expect } from "vitest";
import * as a2aEngine from "./a2aEngine";

describe("Autonomous Agent-to-Agent (A2A) Capacity Negotiations & Smart Scheduling", () => {
  it("should execute multi-turn autonomous negotiation between Grant Navigator and CSR Allocator bots", async () => {
    const nonprofit = {
      name: "Community Health Net",
      mission: "Deploying autonomous multilingual triage agents across neighborhood clinics.",
      sector: "Healthcare & Immigration",
      requestedHours: 1500,
    };

    const resourceOffer = {
      id: 1,
      title: "NVIDIA A100 GPU Cluster Allocation",
      donor: "Nexus DeepMind Labs",
      donorTier: "founding_partner",
      maxCapacity: 5000,
    };

    const session = await a2aEngine.executeA2ANegotiation(nonprofit, resourceOffer, {
      flexOffPeak: true,
      targetBeneficiaries: 15400,
    });

    expect(session).toBeDefined();
    expect(session.sessionId).toMatch(/^A2A-/);
    expect(session.consensusStatus).toBe("APPROVED");
    expect(session.dialogTurns.length).toBeGreaterThanOrEqual(5);

    // Verify turns
    const proposalTurn = session.dialogTurns.find(t => t.action === "PROPOSAL_SUBMISSION");
    expect(proposalTurn).toBeDefined();
    expect(proposalTurn!.speaker).toBe("GrantNavigatorBot");

    const esgTurn = session.dialogTurns.find(t => t.action === "ESG_EVALUATION");
    expect(esgTurn).toBeDefined();
    expect(esgTurn!.speaker).toBe("CsrAllocatorBot");

    const benchmarkTurn = session.dialogTurns.find(t => t.action === "BENCHMARK_PROBE");
    expect(benchmarkTurn).toBeDefined();
    expect(benchmarkTurn!.metadata?.passed).toBe(true);

    const counterTurn = session.dialogTurns.find(t => t.action === "COUNTER_OFFER");
    expect(counterTurn).toBeDefined();
    expect(counterTurn!.content).toContain("22:00 - 06:00 UTC");

    // Verify provisioned credentials
    expect(session.provisionedCredentials).toBeDefined();
    expect(session.provisionedCredentials!.apiKey).toMatch(/^teb_live_/);
    expect(session.provisionedCredentials!.rateLimitPerMin).toBeGreaterThanOrEqual(100);
  });

  it("should retrieve dynamic 24-hour GPU capacity schedule and identify off-peak night windows", () => {
    const schedule = a2aEngine.getDynamic24HourGpuSchedule();
    expect(schedule.length).toBe(24);

    const nightSlot = schedule.find(s => s.hour === 23);
    expect(nightSlot).toBeDefined();
    expect(nightSlot!.isOffPeak).toBe(true);
    expect(nightSlot!.totalAvailableGpuHours).toBeGreaterThanOrEqual(200);

    const daySlot = schedule.find(s => s.hour === 14);
    expect(daySlot).toBeDefined();
    expect(daySlot!.isOffPeak).toBe(false);
  });

  it("should trigger dynamic off-peak GPU capacity rebalancing across coalition", () => {
    const rebalance = a2aEngine.triggerDynamicRebalance();
    expect(rebalance.rebalancedSlots).toBeGreaterThan(0);
    expect(rebalance.additionalHoursYielded).toBeGreaterThan(0);
    expect(rebalance.status).toContain("rebalancing completed");
  });
});
