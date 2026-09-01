import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Collaboration & Real-Time Features", () => {
  it("should create, transition, and delete coalition milestone tasks", async () => {
    // 1. Create task
    const task = await db.createCoalitionTask(1, {
      title: "Deploy Multilingual Translation Agent on Clinic Tablets",
      description: "Test local Wi-Fi connectivity and configure token endpoints.",
      assigneeName: "Elena Rostova",
      assigneeOrg: "Community Health Net",
      stage: "todo",
      priority: "urgent",
    });

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.title).toContain("Multilingual");
    expect(task.stage).toBe("todo");

    // 2. Transition stage
    const updated = await db.updateCoalitionTaskStage(task.id, "in_progress");
    expect(updated.stage).toBe("in_progress");

    const finished = await db.updateCoalitionTaskStage(task.id, "done");
    expect(finished.stage).toBe("done");

    // 3. Delete task
    const deleted = await db.deleteCoalitionTask(task.id);
    expect(deleted.success).toBe(true);
  });

  it("should retrieve shared resource pools and validate member quota splitting", async () => {
    const pools = await db.getCoalitionResourcePools(1);
    expect(pools.length).toBeGreaterThan(0);

    const gpuPool = pools.find(p => p.resourceType === "gpu_compute");
    expect(gpuPool).toBeDefined();
    expect(parseFloat(gpuPool!.totalCapacity)).toBeGreaterThanOrEqual(1000);
    expect(gpuPool!.allocatedMembers.length).toBeGreaterThan(0);

    const totalAllocated = gpuPool!.allocatedMembers.reduce((sum, m) => sum + m.allocatedAmount, 0);
    expect(totalAllocated).toBeLessThanOrEqual(parseFloat(gpuPool!.totalCapacity));

    // Update allocations
    const newMembers = [
      { nonprofitId: 1, orgName: "Community Health Net", allocatedAmount: 2000, usedAmount: 1450, contactPerson: "Elena Rostova" },
      { nonprofitId: 2, orgName: "Urban Transit Alliance", allocatedAmount: 1500, usedAmount: 980, contactPerson: "Marcus Vance" },
      { nonprofitId: 3, orgName: "Civic Literacy Foundation", allocatedAmount: 1500, usedAmount: 850, contactPerson: "Sarah Chen" },
    ];

    const result = await db.updateCoalitionMemberAllocation(gpuPool!.id, newMembers);
    expect(result).toBeDefined();
  });

  it("should post and retrieve live request evaluation thread messages", async () => {
    const message = await db.sendRequestThreadMessage({
      requestId: 10,
      senderId: 1,
      senderName: "Dr. Aris Thorne (Nexus DeepMind)",
      senderRole: "donor",
      content: "Can you confirm if local clinic tablets have GPU acceleration enabled?",
    });

    expect(message).toBeDefined();
    expect(message.id).toBeDefined();
    expect(message.content).toContain("GPU acceleration");

    const thread = await db.getRequestThreadMessages(10);
    expect(thread.length).toBeGreaterThan(0);
    expect(thread[thread.length - 1].content).toContain("GPU acceleration");
  });

  it("should retrieve user live notifications stream", async () => {
    const notifications = await db.getUserLiveNotifications(1);
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications.some(n => n.type === "request_approved" || n.type === "message_received")).toBe(true);
  });
});
