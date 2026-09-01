import { useState } from "react";
import { BarChart3, TrendingUp, Users, Award, Download, Globe, ShieldCheck, PieChart, Sparkles, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import GeospatialImpactMap from "@/components/GeospatialImpactMap";
import AuditLogExportModal from "@/components/AuditLogExportModal";

export default function ImpactTracker() {
  const [activeTab, setActiveTab] = useState<"map" | "metrics" | "sectors">("map");
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1D9E75] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Impact Intelligence
              </span>
              <span className="text-xs text-gray-500">Live Geospatial Telemetry & Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Impact Tracker & Geospatial Analytics</h1>
            <p className="text-xs text-gray-500">
              Real-time measurement of donated compute hours, multilingual AI beneficiaries, and municipal deployment clusters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Audit Data (CSV/JSON)
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex gap-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("map")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "map"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. Geospatial Impact Map
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "metrics"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. Aggregate Impact Telemetry
          </button>
          <button
            onClick={() => setActiveTab("sectors")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "sectors"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            3. Sector Distribution & ROI
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>People Impacted</span>
              <Users className="w-4 h-4 text-[#1D9E75]" />
            </div>
            <div className="text-2xl font-bold text-gray-900">176,200+</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ 24% vs last quarter</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Hours Contributed</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700">12,650 hrs</div>
            <div className="text-[10px] text-purple-600 font-semibold mt-1">Verified GPU & Agent Compute</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Civic Projects Enabled</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">342</div>
            <div className="text-[10px] text-gray-400 mt-1">Across 8 metro hubs</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>In-Kind Value Created</span>
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#1D9E75]">$2,380,000</div>
            <div className="text-[10px] text-gray-400 mt-1">GRI 201-1 Philanthropic ROI</div>
          </div>
        </div>

        {/* Tab 1: Geospatial Map */}
        {activeTab === "map" && (
          <GeospatialImpactMap />
        )}

        {/* Tab 2: Aggregate Telemetry */}
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900">Monthly Beneficiary Reach (2026)</h3>
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { month: "August 2026", count: 48500, pct: 95 },
                  { month: "July 2026", count: 41200, pct: 82 },
                  { month: "June 2026", count: 35600, pct: 70 },
                  { month: "May 2026", count: 28400, pct: 56 },
                  { month: "April 2026", count: 22500, pct: 45 },
                ].map((item) => (
                  <div key={item.month} className="space-y-1">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="font-medium">{item.month}</span>
                      <span className="font-bold text-gray-900">{item.count.toLocaleString()} residents</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#1D9E75] h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900">Compute SLA Uptime Performance</h3>
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { name: "Nexus DeepMind Translation Endpoints", uptime: "99.85%", latency: "480ms", status: "Optimal" },
                  { name: "Apex Cloud NVIDIA A100 GPU Cluster", uptime: "99.92%", latency: "280ms", status: "Optimal" },
                  { name: "CivicAI Systems Grant Screener Tool", uptime: "99.40%", latency: "620ms", status: "Healthy" },
                  { name: "DataViz Census ETL Pipeline", uptime: "99.70%", latency: "510ms", status: "Optimal" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-[10px] text-gray-400">p95 Latency: {item.latency}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-700">{item.uptime}</div>
                      <div className="text-[10px] text-emerald-600">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sector Distribution */}
        {activeTab === "sectors" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                sector: "Healthcare & Clinical Access",
                share: "38%",
                reach: "68,000 residents",
                highlight: "Multilingual translation and triage bots deployed across 18 community clinics.",
              },
              {
                sector: "Education & Literacy",
                share: "27%",
                reach: "48,500 students",
                highlight: "AI reading comprehension and STEM tutoring across 22 Title I after-school sites.",
              },
              {
                sector: "Transit & Municipal Equity",
                share: "21%",
                reach: "38,000 riders",
                highlight: "GIS bus corridor optimization and transit desert telemetry in Chicago and Atlanta.",
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{card.sector}</span>
                  <span className="text-xs font-bold text-[#1D9E75] bg-emerald-50 px-2 py-0.5 rounded">
                    {card.share}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-800">{card.reach}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{card.highlight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Export Modal */}
      <AuditLogExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
