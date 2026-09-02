import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { TrendingUp, Users, Zap, Award, BarChart3, MessageSquare, Settings, Shield, Crown, FileText, ArrowRight, ExternalLink, Activity, Radio, Lock, Cpu, Leaf } from "lucide-react";
import DonorPledgeManager from "@/components/DonorPledgeManager";
import BenchmarkRunnerModal from "@/components/BenchmarkRunnerModal";
import CsrReportViewer from "@/components/CsrReportViewer";
import WebhookSettingsModal from "@/components/WebhookSettingsModal";
import SystemHealthDrawer from "@/components/SystemHealthDrawer";
import RoleAccessBadge from "@/components/RoleAccessBadge";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [benchmarkResourceId, setBenchmarkResourceId] = useState<number | null>(null);
  const [activeCsrDonorId, setActiveCsrDonorId] = useState<number | null>(null);
  const [showWebhooksModal, setShowWebhooksModal] = useState(false);
  const [showHealthDrawer, setShowHealthDrawer] = useState(false);

  // In demo or fallback mode, default role is donor for testing
  const isDonor = user?.role === "donor" || !user?.role || user?.role === "nonprofit";

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RoleAccessBadge />
              <a href="/impact-wall" className="text-xs text-purple-700 hover:underline flex items-center gap-1">
                Public Impact Wall <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.name || "Civic Leader"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/sroi"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-[#1D9E75]" /> Predictive SROI &amp; Co-Funding
            </a>
            <a
              href="/web3-esg"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 cursor-pointer shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> zk-Proofs &amp; DIDs
            </a>
            <a
              href="/edge"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5 mr-1.5 text-[#1D9E75]" /> Edge Mesh & Offline
            </a>
            <a
              href="/iam"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Enterprise SSO & IAM
            </a>
            <a
              href="/a2a"
              className="inline-flex items-center px-3 py-2 text-xs font-bold rounded-lg border border-purple-300 bg-purple-700 text-white hover:bg-purple-800 cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" /> A2A Bot Negotiator
            </a>
            <button
              onClick={() => setShowWebhooksModal(true)}
              className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Webhooks
            </button>
            <button
              onClick={() => setShowHealthDrawer(true)}
              className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-[#1D9E75]" /> System Health
            </button>
            <a href="/marketplace" className="btn btn-secondary btn-sm text-xs py-2 px-3">
              Marketplace
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Donor Incentive & Resource Commitment Engine (Phase 16) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Donor Incentive & Resource Commitment Engine
              </h2>
              <p className="text-xs text-gray-500">
                Manage your 3-Tier commitments, scheduled off-peak windows, monthly SLA fulfillments, and GRI-aligned CSR reports.
              </p>
            </div>
            <button
              onClick={() => setActiveCsrDonorId(user?.id || 1)}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> View CSR Ledger
            </button>
          </div>

          <DonorPledgeManager
            donorId={user?.id || 1}
            onOpenBenchmark={(resId) => setBenchmarkResourceId(resId)}
            onOpenCsr={(dId) => setActiveCsrDonorId(dId)}
          />
        </section>

        {/* Aggregate Impact Statistics */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cumulative Platform Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-gray-400">Monthly</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">2,450 hrs</div>
              <div className="text-xs text-gray-500 mt-1">GPU Compute & Agents Shared</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-[#1D9E75]" />
                <span className="text-xs text-gray-400">Active</span>
              </div>
              <div className="text-2xl font-bold text-[#1D9E75]">42 Orgs</div>
              <div className="text-xs text-gray-500 mt-1">Non-Profits Empowered</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">89,000+</div>
              <div className="text-xs text-gray-500 mt-1">Community Beneficiaries</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs text-gray-400">SLA Rate</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">99.85%</div>
              <div className="text-xs text-gray-500 mt-1">Uptime & Latency SLA Passed</div>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/marketplace"
              className="p-5 rounded-xl bg-white border border-gray-200 hover:border-[#1D9E75] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#1D9E75]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1D9E75] transition-colors">
                    Resource Marketplace
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Browse SLA-benchmarked AI models & compute</p>
                </div>
              </div>
            </a>

            <a
              href="/impact-wall"
              className="p-5 rounded-xl bg-white border border-gray-200 hover:border-purple-400 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Public Impact Wall
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">View verified donor tiers & ESG credentials</p>
                </div>
              </div>
            </a>

            <a
              href="/grant-assistant"
              className="p-5 rounded-xl bg-white border border-gray-200 hover:border-amber-400 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Grant Writing Assistant
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">AI-powered 501(c)(3) proposal generator</p>
                </div>
              </div>
            </a>
          </div>
        </section>
      </div>

      {/* Modals */}
      {benchmarkResourceId !== null && (
        <BenchmarkRunnerModal
          isOpen={true}
          onClose={() => setBenchmarkResourceId(null)}
          resourceId={benchmarkResourceId}
          resourceTitle="Pledged GPU Cluster SLA Test"
          resourceType="gpu_compute"
        />
      )}

      {activeCsrDonorId !== null && (
        <CsrReportViewer
          isOpen={true}
          onClose={() => setActiveCsrDonorId(null)}
          donorId={activeCsrDonorId}
          donorName={user?.name || "Nexus DeepMind Labs"}
        />
      )}
    </div>
  );
}
