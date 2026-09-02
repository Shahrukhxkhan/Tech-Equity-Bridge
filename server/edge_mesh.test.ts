import { describe, it, expect } from "vitest";
import * as edgeMeshEngine from "./edgeMeshEngine";

describe("Offline-First Edge Compute Mesh & P2P CRDT Sync", () => {
  it("should list available quantized edge models for air-gapped deployment", () => {
    const models = edgeMeshEngine.getQuantizedModelsList();
    expect(models.length).toBeGreaterThanOrEqual(4);

    const medTriage = models.find(m => m.id === "MODEL-MEDTRIAGE-Q4");
    expect(medTriage).toBeDefined();
    expect(medTriage!.quantization).toBe("INT4");
    expect(medTriage!.memoryFootprintMb).toBeLessThanOrEqual(1000);
    expect(medTriage!.targetHardware).toContain("Raspberry Pi 4/5");
  });

  it("should run quantized local offline edge inference and queue CRDT record", async () => {
    const result = await edgeMeshEngine.runLocalEdgeInference(
      "MODEL-MEDTRIAGE-Q4",
      "Patient reports sudden chest tightness and fever.",
      "NODE-RURAL-01"
    );

    expect(result).toBeDefined();
    expect(result.output).toContain("Offline Edge Triage Output");
    expect(result.isAirGapped).toBe(true);
    expect(result.createdCrdtRecord).toBeDefined();
    expect(result.createdCrdtRecord.lamportTimestamp).toBeGreaterThan(100);
    expect(result.createdCrdtRecord.syncStatus).toBe("locally_queued");
  });

  it("should list active rural clinic edge node devices and battery/sync status", () => {
    const nodes = edgeMeshEngine.getEdgeNodesList();
    expect(nodes.length).toBeGreaterThanOrEqual(3);

    const appalachian = nodes.find(n => n.id === "NODE-RURAL-01");
    expect(appalachian).toBeDefined();
    expect(appalachian!.batteryLevelPct).toBeGreaterThan(0);
    expect(appalachian!.deviceType).toBe("tablet");
  });

  it("should reconcile and synchronize offline CRDT records to cloud audit ledger", async () => {
    const syncRes = await edgeMeshEngine.reconcileCrdtMeshToCloud();
    expect(syncRes.success).toBe(true);
    expect(syncRes.crdtConvergenceStatus).toBe("CONVERGED_ZERO_CONFLICTS");
    expect(syncRes.reconciliationHash).toMatch(/^0x/);

    const records = edgeMeshEngine.getCrdtLedgerRecords();
    const queuedRecords = records.filter(r => r.syncStatus === "locally_queued");
    expect(queuedRecords.length).toBe(0);
  });
});
