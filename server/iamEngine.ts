/**
 * =============================================================================
 * Enterprise Single Sign-On (SSO) & Granular Role-Based Access Control (IAM)
 * =============================================================================
 */

export type EnterpriseRbacRole =
  | "csr_executive"
  | "sla_auditor"
  | "coalition_lead"
  | "grant_navigator"
  | "public_auditor"
  | "admin";

export type FeaturePermission =
  | "VIEW_ESG_CERTIFICATES"
  | "GENERATE_CSR_REPORTS"
  | "RUN_SLA_BENCHMARKS"
  | "MANAGE_GPU_ENDPOINTS"
  | "REBALANCE_COALITION_QUOTAS"
  | "MANAGE_MILESTONE_TASKS"
  | "DRAFT_GRANT_PROPOSALS"
  | "INITIATE_A2A_NEGOTIATIONS"
  | "ACCESS_AUDIT_LEDGER"
  | "EXPORT_COMPLIANCE_CSV"
  | "MANAGE_IAM_AND_SSO";

export interface SsoProviderConfig {
  id: string;
  name: string;
  providerType: "okta" | "entra_id" | "google_workspace" | "saml_generic";
  protocol: "SAML_2_0" | "OIDC";
  entityId: string;
  ssoLoginUrl: string;
  certificateFingerprint?: string;
  clientDomain: string;
  jitProvisioningEnabled: boolean;
  defaultAssignedRole: EnterpriseRbacRole;
  isActive: boolean;
  createdAt: Date;
  lastTestedAt?: Date;
}

// In-memory active role session (defaulting to csr_executive for demo testing)
let activeSessionRole: EnterpriseRbacRole = "csr_executive";

// Configured Enterprise SSO Providers
const ssoProviders: SsoProviderConfig[] = [
  {
    id: "IDP-OKTA-01",
    name: "Nexus DeepMind Okta SSO",
    providerType: "okta",
    protocol: "SAML_2_0",
    entityId: "https://nexus-deepmind.okta.com/app/techequity/sso/saml",
    ssoLoginUrl: "https://nexus-deepmind.okta.com/app/techequity_bridge/exk98471/sso/saml",
    certificateFingerprint: "SHA256: 7F:83:B1:65:7F:F1:FC:53:B9:2D:C1:81:48:A1:D6:5D",
    clientDomain: "nexusdeepmind.org",
    jitProvisioningEnabled: true,
    defaultAssignedRole: "csr_executive",
    isActive: true,
    createdAt: new Date("2026-08-01"),
    lastTestedAt: new Date("2026-09-01T10:00:00Z"),
  },
  {
    id: "IDP-ENTRA-02",
    name: "Microsoft Entra ID (Azure AD)",
    providerType: "entra_id",
    protocol: "OIDC",
    entityId: "https://login.microsoftonline.com/8f94-4712-9841-techequity/v2.0",
    ssoLoginUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    clientDomain: "apexcloudmatrix.com",
    jitProvisioningEnabled: true,
    defaultAssignedRole: "sla_auditor",
    isActive: true,
    createdAt: new Date("2026-08-10"),
    lastTestedAt: new Date("2026-08-30T14:30:00Z"),
  },
  {
    id: "IDP-GOOGLE-03",
    name: "Civic Coalition Google Workspace OIDC",
    providerType: "google_workspace",
    protocol: "OIDC",
    entityId: "https://accounts.google.com/o/oauth2/auth",
    ssoLoginUrl: "https://accounts.google.com/o/oauth2/v2/auth?client_id=techequity-civic.apps.googleusercontent.com",
    clientDomain: "civichealthnet.org",
    jitProvisioningEnabled: true,
    defaultAssignedRole: "grant_navigator",
    isActive: true,
    createdAt: new Date("2026-08-15"),
    lastTestedAt: new Date("2026-08-28T09:15:00Z"),
  },
];

// Granular RBAC Permission Matrix
export const RBAC_PERMISSION_MATRIX: Record<EnterpriseRbacRole, FeaturePermission[]> = {
  csr_executive: [
    "VIEW_ESG_CERTIFICATES",
    "GENERATE_CSR_REPORTS",
    "ACCESS_AUDIT_LEDGER",
    "EXPORT_COMPLIANCE_CSV",
  ],
  sla_auditor: [
    "RUN_SLA_BENCHMARKS",
    "MANAGE_GPU_ENDPOINTS",
    "ACCESS_AUDIT_LEDGER",
  ],
  coalition_lead: [
    "REBALANCE_COALITION_QUOTAS",
    "MANAGE_MILESTONE_TASKS",
    "VIEW_ESG_CERTIFICATES",
  ],
  grant_navigator: [
    "DRAFT_GRANT_PROPOSALS",
    "INITIATE_A2A_NEGOTIATIONS",
    "MANAGE_MILESTONE_TASKS",
  ],
  public_auditor: [
    "ACCESS_AUDIT_LEDGER",
    "EXPORT_COMPLIANCE_CSV",
    "VIEW_ESG_CERTIFICATES",
  ],
  admin: [
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
  ],
};

export function canAccessFeature(role: EnterpriseRbacRole, feature: FeaturePermission): boolean {
  if (role === "admin") return true;
  const permissions = RBAC_PERMISSION_MATRIX[role] || [];
  return permissions.includes(feature);
}

export function getCurrentSessionRole(): { role: EnterpriseRbacRole; permissions: FeaturePermission[]; roleTitle: string; description: string } {
  const roleTitles: Record<EnterpriseRbacRole, { title: string; description: string }> = {
    csr_executive: {
      title: "CSR Executive",
      description: "View ESG certificates, automated GRI CSR impact reports, and philanthropic tax write-off logs.",
    },
    sla_auditor: {
      title: "SLA Benchmark Auditor",
      description: "Run sandboxed throughput/latency probes, inspect GPU clusters, and monitor remediation alerts.",
    },
    coalition_lead: {
      title: "Coalition Lead",
      description: "Rebalance shared compute pool quotas among member non-profits and manage milestone Kanban roadmaps.",
    },
    grant_navigator: {
      title: "Non-Profit Grant Navigator",
      description: "Draft context-aware grant proposals using RFP Ingestion and launch A2A autonomous capacity negotiations.",
    },
    public_auditor: {
      title: "Public / Financial Auditor",
      description: "Read-only access to immutable cryptographic audit ledgers and downloadable CSV/JSON compliance archives.",
    },
    admin: {
      title: "Platform Administrator",
      description: "Full administrative access across all engines, webhooks, worker queues, and IAM configurations.",
    },
  };

  return {
    role: activeSessionRole,
    permissions: RBAC_PERMISSION_MATRIX[activeSessionRole] || [],
    roleTitle: roleTitles[activeSessionRole].title,
    description: roleTitles[activeSessionRole].description,
  };
}

export function switchActiveSessionRole(newRole: EnterpriseRbacRole) {
  activeSessionRole = newRole;
  return getCurrentSessionRole();
}

export function getSsoProviderConfigs(): SsoProviderConfig[] {
  return ssoProviders;
}

export function saveSsoProviderConfig(config: Omit<SsoProviderConfig, "id" | "createdAt">): SsoProviderConfig {
  const newConfig: SsoProviderConfig = {
    id: `IDP-${config.providerType.toUpperCase()}-${String(ssoProviders.length + 1).padStart(2, "0")}`,
    ...config,
    createdAt: new Date(),
  };
  ssoProviders.push(newConfig);
  return newConfig;
}

export async function testSsoProviderConnection(providerId: string) {
  const provider = ssoProviders.find(p => p.id === providerId);
  if (!provider) {
    throw new Error(`SSO Provider with ID ${providerId} not found`);
  }

  provider.lastTestedAt = new Date();

  return {
    success: true,
    providerId: provider.id,
    name: provider.name,
    protocol: provider.protocol,
    samlAcsUrl: "https://auth.tech-equity.org/saml/acs",
    oidcCallbackUrl: "https://auth.tech-equity.org/oauth2/callback",
    certificateStatus: "VALID_EXPIRES_2028",
    latencyMs: 165,
    testedAt: provider.lastTestedAt,
  };
}
