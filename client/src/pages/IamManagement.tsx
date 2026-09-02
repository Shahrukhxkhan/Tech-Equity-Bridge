import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, Key, Users, Check, Lock, Globe, Plus, Play, RefreshCw, CheckCircle2, AlertCircle, Building2, Crown, Activity, FileText, Search, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import RoleAccessBadge from "@/components/RoleAccessBadge";

export default function IamManagement() {
  const [activeTab, setActiveTab] = useState<"sso" | "rbac">("sso");
  const [showAddIdp, setShowAddIdp] = useState(false);
  const [idpName, setIdpName] = useState("");
  const [providerType, setProviderType] = useState<"okta" | "entra_id" | "google_workspace" | "saml_generic">("okta");
  const [protocol, setProtocol] = useState<"SAML_2_0" | "OIDC">("SAML_2_0");
  const [entityId, setEntityId] = useState("");
  const [ssoLoginUrl, setSsoLoginUrl] = useState("");
  const [clientDomain, setClientDomain] = useState("");
  const [defaultRole, setDefaultRole] = useState<any>("csr_executive");

  const { data: ssoProviders, refetch: refetchSso, isLoading: isSsoLoading } = trpc.iam.getSsoProviders.useQuery();
  const { data: matrixData, refetch: refetchMatrix } = trpc.iam.getPermissionMatrix.useQuery();

  const saveIdpMutation = trpc.iam.saveSsoProvider.useMutation({
    onSuccess: () => {
      setShowAddIdp(false);
      setIdpName("");
      setEntityId("");
      setSsoLoginUrl("");
      setClientDomain("");
      refetchSso();
      toast.success("Enterprise Identity Provider registered");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save SSO configuration");
    },
  });

  const testConnectionMutation = trpc.iam.testSsoConnection.useMutation({
    onSuccess: (data) => {
      refetchSso();
      toast.success(`SSO handshake verified with ${data.name} (${data.latencyMs}ms)`);
    },
    onError: (err) => {
      toast.error(err.message || "SSO connection test failed");
    },
  });

  const switchRoleMutation = trpc.iam.switchRole.useMutation({
    onSuccess: (data) => {
      refetchMatrix();
      toast.success(`Switched active enterprise persona to ${data.roleTitle}`);
    },
  });

  const handleSaveIdp = () => {
    if (!idpName.trim() || !ssoLoginUrl.trim() || !clientDomain.trim()) {
      toast.error("Please fill in provider name, login URL, and domain");
      return;
    }
    saveIdpMutation.mutate({
      name: idpName,
      providerType,
      protocol,
      entityId: entityId || `https://${clientDomain}/sso/metadata`,
      ssoLoginUrl,
      clientDomain,
      defaultAssignedRole: defaultRole,
      jitProvisioningEnabled: true,
      isActive: true,
    });
  };

  const PERMISSION_ROWS = [
    { key: "VIEW_ESG_CERTIFICATES", label: "View ESG Certificates & GRI Reports", category: "Governance & ESG" },
    { key: "GENERATE_CSR_REPORTS", label: "Generate Automated CSR Dossiers", category: "Governance & ESG" },
    { key: "RUN_SLA_BENCHMARKS", label: "Execute Live Technical SLA Benchmarks", category: "Technical SLA" },
    { key: "MANAGE_GPU_ENDPOINTS", label: "Configure GPU Cluster Endpoints", category: "Technical SLA" },
    { key: "REBALANCE_COALITION_QUOTAS", label: "Rebalance Shared Compute Pools", category: "Coalition Governance" },
    { key: "MANAGE_MILESTONE_TASKS", label: "Manage Milestone Kanban Board", category: "Coalition Governance" },
    { key: "DRAFT_GRANT_PROPOSALS", label: "Grant Assistant v2 & RFP Ingestion", category: "Grant Intelligence" },
    { key: "INITIATE_A2A_NEGOTIATIONS", label: "Launch Autonomous A2A Negotiations", category: "Grant Intelligence" },
    { key: "ACCESS_AUDIT_LEDGER", label: "Inspect Cryptographic Audit Ledger", category: "Compliance & Auditing" },
    { key: "EXPORT_COMPLIANCE_CSV", label: "Download CSV/JSON Audit Archives", category: "Compliance & Auditing" },
    { key: "MANAGE_IAM_AND_SSO", label: "Manage Enterprise SSO & RBAC Matrix", category: "IAM Administration" },
  ];

  const ROLES_COLUMNS = [
    { key: "csr_executive", label: "CSR Executive", icon: Crown, color: "text-amber-800 bg-amber-50" },
    { key: "sla_auditor", label: "SLA Auditor", icon: Activity, color: "text-purple-800 bg-purple-50" },
    { key: "coalition_lead", label: "Coalition Lead", icon: Users, color: "text-blue-800 bg-blue-50" },
    { key: "grant_navigator", label: "Grant Navigator", icon: FileText, color: "text-emerald-800 bg-emerald-50" },
    { key: "public_auditor", label: "Financial Auditor", icon: Search, color: "text-slate-800 bg-slate-100" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-600" /> Enterprise IAM & Access Governance
              </span>
              <span className="text-xs text-gray-500">SAML 2.0 • OIDC • Granular RBAC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Enterprise Single Sign-On (SSO) & IAM Console
            </h1>
            <p className="text-xs text-gray-500">
              Manage enterprise identity federation (Okta, Microsoft Entra ID, Google Workspace) and enforce 5-tier role-based access policies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RoleAccessBadge />
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-2 px-3">
              Dashboard
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex gap-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("sso")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "sso"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. Enterprise Identity Providers (Okta / Entra ID / Google)
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "rbac"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. Granular RBAC Permission Matrix & Switcher
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* TAB 1: Enterprise SSO Providers */}
        {activeTab === "sso" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-gray-900">Active Identity Federation Gateways</h3>
                <p className="text-xs text-gray-500">
                  SAML 2.0 & OIDC identity providers with Just-In-Time (JIT) provisioning and domain routing.
                </p>
              </div>

              <button
                onClick={() => setShowAddIdp(true)}
                className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Enterprise IdP
              </button>
            </div>

            {/* IdP Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ssoProviders?.map((idp: any) => (
                <div
                  key={idp.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 uppercase">
                        {idp.protocol}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> JIT Active
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 leading-snug">{idp.name}</h3>
                    <div className="text-xs text-gray-500 mt-1 font-mono">Domain: @{idp.clientDomain}</div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">Entity ID / Metadata:</span>
                      <span className="text-[11px] font-mono text-gray-600 truncate block">{idp.entityId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">Default Assigned Role:</span>
                      <span className="font-semibold text-gray-800 capitalize">{idp.defaultAssignedRole.replace("_", " ")}</span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => testConnectionMutation.mutate({ providerId: idp.id })}
                        disabled={testConnectionMutation.isPending}
                        className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-[#1D9E75]" /> Test SAML/OIDC Handshake
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add IdP Modal */}
            {showAddIdp && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                  <h3 className="text-base font-bold text-gray-900">Configure Enterprise Identity Provider</h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Provider Display Name</label>
                      <input
                        type="text"
                        value={idpName}
                        onChange={(e) => setIdpName(e.target.value)}
                        placeholder="e.g. Apex Cloud Okta SSO"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Provider Type</label>
                        <select
                          value={providerType}
                          onChange={(e) => setProviderType(e.target.value as any)}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="okta">Okta SSO</option>
                          <option value="entra_id">Microsoft Entra ID</option>
                          <option value="google_workspace">Google Workspace</option>
                          <option value="saml_generic">Generic SAML 2.0</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Protocol</label>
                        <select
                          value={protocol}
                          onChange={(e) => setProtocol(e.target.value as any)}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="SAML_2_0">SAML 2.0</option>
                          <option value="OIDC">OpenID Connect (OIDC)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">SSO Login / Authorize URL</label>
                      <input
                        type="url"
                        value={ssoLoginUrl}
                        onChange={(e) => setSsoLoginUrl(e.target.value)}
                        placeholder="https://company.okta.com/app/sso/saml"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-[11px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Corporate Domain</label>
                        <input
                          type="text"
                          value={clientDomain}
                          onChange={(e) => setClientDomain(e.target.value)}
                          placeholder="company.com"
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Default Role</label>
                        <select
                          value={defaultRole}
                          onChange={(e) => setDefaultRole(e.target.value as any)}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="csr_executive">CSR Executive</option>
                          <option value="sla_auditor">SLA Benchmark Auditor</option>
                          <option value="coalition_lead">Coalition Lead</option>
                          <option value="grant_navigator">Grant Navigator</option>
                          <option value="public_auditor">Financial Auditor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowAddIdp(false)}
                      className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveIdp}
                      disabled={saveIdpMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Save Identity Provider
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Granular RBAC Matrix & Live Switcher */}
        {activeTab === "rbac" && (
          <div className="space-y-6">
            {/* Active Persona Banner */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Current Simulated Persona</span>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1D9E75]" />
                  {matrixData?.current.roleTitle}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xl">{matrixData?.current.description}</p>
              </div>

              {/* Quick Persona Switcher Buttons */}
              <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                {ROLES_COLUMNS.map((col) => {
                  const isCurrent = matrixData?.current.role === col.key;
                  return (
                    <button
                      key={col.key}
                      onClick={() => switchRoleMutation.mutate({ role: col.key as any })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#1D9E75] text-white border-[#1D9E75] shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {col.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permission Matrix Grid Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-gray-100 bg-gray-50/60">
                <h4 className="text-sm font-bold text-gray-900">Granular Enterprise Capability Matrix</h4>
                <p className="text-xs text-gray-500">
                  Defines fine-grained permission authorization across all platform engines.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="p-3.5 font-bold text-gray-700">Platform Feature / Engine</th>
                      {ROLES_COLUMNS.map((col) => (
                        <th key={col.key} className="p-3.5 text-center font-bold text-gray-700">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PERMISSION_ROWS.map((row) => (
                      <tr key={row.key} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-900 block">{row.label}</span>
                          <span className="text-[10px] text-gray-400">{row.category}</span>
                        </td>
                        {ROLES_COLUMNS.map((col) => {
                          const permissions = (matrixData?.matrix as any)?.[col.key] || [];
                          const isAllowed = permissions.includes(row.key);

                          return (
                            <td key={col.key} className="p-3.5 text-center">
                              {isAllowed ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
