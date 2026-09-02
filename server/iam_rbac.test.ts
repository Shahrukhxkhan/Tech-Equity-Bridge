import { describe, it, expect } from "vitest";
import * as iamEngine from "./iamEngine";

describe("Enterprise Single Sign-On (SSO) & Granular RBAC (IAM)", () => {
  it("should list configured enterprise identity providers (Okta, Microsoft Entra ID, Google Workspace)", () => {
    const providers = iamEngine.getSsoProviderConfigs();
    expect(providers.length).toBeGreaterThanOrEqual(3);

    const okta = providers.find(p => p.providerType === "okta");
    expect(okta).toBeDefined();
    expect(okta!.protocol).toBe("SAML_2_0");
    expect(okta!.clientDomain).toBe("nexusdeepmind.org");

    const entra = providers.find(p => p.providerType === "entra_id");
    expect(entra).toBeDefined();
    expect(entra!.protocol).toBe("OIDC");
  });

  it("should test SAML/OIDC handshake and verify ACS and callback endpoints", async () => {
    const res = await iamEngine.testSsoProviderConnection("IDP-OKTA-01");
    expect(res.success).toBe(true);
    expect(res.samlAcsUrl).toBe("https://auth.tech-equity.org/saml/acs");
    expect(res.certificateStatus).toContain("VALID");
    expect(res.latencyMs).toBeGreaterThan(0);
  });

  it("should enforce granular RBAC permissions accurately across all 5 enterprise roles", () => {
    // 1. CSR Executive
    expect(iamEngine.canAccessFeature("csr_executive", "VIEW_ESG_CERTIFICATES")).toBe(true);
    expect(iamEngine.canAccessFeature("csr_executive", "GENERATE_CSR_REPORTS")).toBe(true);
    expect(iamEngine.canAccessFeature("csr_executive", "REBALANCE_COALITION_QUOTAS")).toBe(false);
    expect(iamEngine.canAccessFeature("csr_executive", "RUN_SLA_BENCHMARKS")).toBe(false);

    // 2. SLA Benchmark Auditor
    expect(iamEngine.canAccessFeature("sla_auditor", "RUN_SLA_BENCHMARKS")).toBe(true);
    expect(iamEngine.canAccessFeature("sla_auditor", "MANAGE_GPU_ENDPOINTS")).toBe(true);
    expect(iamEngine.canAccessFeature("sla_auditor", "DRAFT_GRANT_PROPOSALS")).toBe(false);

    // 3. Coalition Lead
    expect(iamEngine.canAccessFeature("coalition_lead", "REBALANCE_COALITION_QUOTAS")).toBe(true);
    expect(iamEngine.canAccessFeature("coalition_lead", "MANAGE_MILESTONE_TASKS")).toBe(true);
    expect(iamEngine.canAccessFeature("coalition_lead", "RUN_SLA_BENCHMARKS")).toBe(false);

    // 4. Non-Profit Grant Navigator
    expect(iamEngine.canAccessFeature("grant_navigator", "DRAFT_GRANT_PROPOSALS")).toBe(true);
    expect(iamEngine.canAccessFeature("grant_navigator", "INITIATE_A2A_NEGOTIATIONS")).toBe(true);
    expect(iamEngine.canAccessFeature("grant_navigator", "GENERATE_CSR_REPORTS")).toBe(false);

    // 5. Public / Financial Auditor
    expect(iamEngine.canAccessFeature("public_auditor", "ACCESS_AUDIT_LEDGER")).toBe(true);
    expect(iamEngine.canAccessFeature("public_auditor", "EXPORT_COMPLIANCE_CSV")).toBe(true);
    expect(iamEngine.canAccessFeature("public_auditor", "INITIATE_A2A_NEGOTIATIONS")).toBe(false);
  });

  it("should switch active session role dynamically", () => {
    const switched = iamEngine.switchActiveSessionRole("grant_navigator");
    expect(switched.role).toBe("grant_navigator");
    expect(switched.roleTitle).toBe("Non-Profit Grant Navigator");
    expect(switched.permissions).toContain("DRAFT_GRANT_PROPOSALS");

    // Revert back
    iamEngine.switchActiveSessionRole("csr_executive");
  });
});
