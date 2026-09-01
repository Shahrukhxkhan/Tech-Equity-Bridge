import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Analytics, Impact Visualization & Public Presence", () => {
  it("should retrieve geospatial impact projects with coordinates and sector tags", async () => {
    const projects = await db.getGeospatialImpactProjects();
    expect(projects.length).toBeGreaterThanOrEqual(5);

    const sfProject = projects.find(p => p.city === "San Francisco");
    expect(sfProject).toBeDefined();
    expect(sfProject!.coordinates[0]).toBeCloseTo(37.77, 1);
    expect(sfProject!.coordinates[1]).toBeCloseTo(-122.41, 1);
    expect(sfProject!.beneficiariesServed).toBeGreaterThan(1000);
    expect(sfProject!.impactHighlight).toBeDefined();
  });

  it("should retrieve public non-profit showcase directory", async () => {
    const nonprofits = await db.getPublicNonprofitDirectory();
    expect(nonprofits.length).toBeGreaterThan(0);
    expect(nonprofits[0].verifiedEsgBadge).toBeDefined();
    expect(nonprofits[0].techDeployed.length).toBeGreaterThan(0);
  });

  it("should retrieve platform audit logs with verification hashes", async () => {
    const logs = await db.getPlatformAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].id).toMatch(/^AUD-/);
    expect(logs[0].verificationHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(logs[0].slaCompliance).toBeDefined();
  });

  it("should export compliance data in CSV and JSON formats", async () => {
    // 1. JSON Export
    const jsonOutput = await db.exportComplianceData("json");
    expect(jsonOutput).toContain("GRI 201-1");
    expect(jsonOutput).toContain("totalVerifiedProjects");
    const parsed = JSON.parse(jsonOutput);
    expect(parsed.totalBeneficiaries).toBeGreaterThan(50000);

    // 2. CSV Export
    const csvOutput = await db.exportComplianceData("csv");
    expect(csvOutput).toContain("Audit_ID,Timestamp_UTC,Actor_Name");
    expect(csvOutput).toContain("AUD-2026-");
    expect(csvOutput).toContain("0x");
  });
});
