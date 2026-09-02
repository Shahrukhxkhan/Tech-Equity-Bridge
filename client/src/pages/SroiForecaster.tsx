import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { TrendingUp, DollarSign, Users, Award, Sparkles, Building2, BookOpen, HeartPulse, Bus, Scale, Utensils, ArrowUpRight, CheckCircle2, RefreshCw, Plus, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import RoleAccessBadge from "@/components/RoleAccessBadge";

export default function SroiForecaster() {
  const [activeTab, setActiveTab] = useState<"calculator" | "cofunding" | "methodology">("calculator");

  // Calculator Parameters
  const [sectorKey, setSectorKey] = useState("healthcare");
  const [gpuHours, setGpuHours] = useState(1500);
  const [beneficiaries, setBeneficiaries] = useState(15000);
  const [complexity, setComplexity] = useState(1.0);

  // Co-funding pledge modal state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState(15000);
  const [foundationName, setFoundationName] = useState("Rockefeller Philanthropy Advisors");

  const { data: forecast, isLoading: isForecastLoading } = trpc.sroi.calculateForecast.useQuery({
    sectorKey,
    gpuHours,
    beneficiaries,
    complexity,
  });

  const { data: benchmarks } = trpc.sroi.getSectorBenchmarks.useQuery();
  const { data: cofundingCampaigns, refetch: refetchCampaigns } = trpc.sroi.getCoFundingCampaigns.useQuery();

  const pledgeMutation = trpc.sroi.pledgeCoFunding.useMutation({
    onSuccess: (data) => {
      setSelectedCampaignId(null);
      refetchCampaigns();
      toast.success(`Co-funding grant match committed! Campaign is now $${data.foundationGrantFunding.currentMatchedUsd.toLocaleString()} funded.`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit pledge match");
    },
  });

  const getSectorIcon = (key: string) => {
    switch (key) {
      case "healthcare": return HeartPulse;
      case "education": return BookOpen;
      case "transit": return Bus;
      case "legal": return Scale;
      default: return Utensils;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#1D9E75]" /> Predictive SROI &amp; Co-Funding
              </span>
              <span className="text-xs text-gray-500">Machine Learning Econometric Valuation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Social Return on Investment (SROI) ML Engine
            </h1>
            <p className="text-xs text-gray-500">
              Forecast quantifiable community dollar value per $1 of donated compute and connect philanthropic foundations to co-fund operational staff.
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
            onClick={() => setActiveTab("calculator")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "calculator"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. SROI ML Outcome Forecaster
          </button>
          <button
            onClick={() => setActiveTab("cofunding")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "cofunding"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. Philanthropic Foundation Co-Funding Matcher
          </button>
          <button
            onClick={() => setActiveTab("methodology")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "methodology"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            3. Econometric Methodology &amp; Sources
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* TAB 1: SROI ML Outcome Forecaster */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Parameter Sliders (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Project Inputs &amp; Capacity</span>
                  <span className="text-[10px] text-gray-400">Econometric ML Model</span>
                </div>

                {/* Sector Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Non-Profit Domain / Sector</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { key: "healthcare", label: "Healthcare & Clinical Triage", icon: HeartPulse, sub: "WHO ER Diversion Model ($4.20/$) " },
                      { key: "education", label: "Civic Literacy & AI Tutoring", icon: BookOpen, sub: "Brookings Lifelong Earnings ($3.85/$)" },
                      { key: "transit", label: "Urban Transit & Environmental GIS", icon: Bus, sub: "Urban Institute Mobility ($3.40/$)" },
                      { key: "legal", label: "Legal Aid & Immigration Intake", icon: Scale, sub: "LSC Justice Gap Index ($4.60/$)" },
                      { key: "food", label: "Food Security & Cold Chain", icon: Utensils, sub: "ReFED Wholesale Diverted ($3.75/$)" },
                    ].map((s) => {
                      const isSelected = s.key === sectorKey;
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.key}
                          onClick={() => setSectorKey(s.key)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? "border-[#1D9E75] bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-[#1D9E75]"
                              : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#1D9E75]" : "text-gray-500"}`} />
                          <div>
                            <div className="text-xs leading-tight">{s.label}</div>
                            <div className="text-[10px] text-gray-400 leading-none mt-0.5">{s.sub}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-gray-700 mb-1">
                      <span>Donated GPU Compute:</span>
                      <span className="font-mono text-purple-700">{gpuHours.toLocaleString()} hrs/mo</span>
                    </div>
                    <input
                      type="range"
                      min={200}
                      max={8000}
                      step={100}
                      value={gpuHours}
                      onChange={(e) => setGpuHours(parseInt(e.target.value))}
                      className="w-full accent-[#1D9E75] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-gray-700 mb-1">
                      <span>Community Beneficiaries:</span>
                      <span className="font-mono text-[#1D9E75]">{beneficiaries.toLocaleString()} people</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={60000}
                      step={1000}
                      value={beneficiaries}
                      onChange={(e) => setBeneficiaries(parseInt(e.target.value))}
                      className="w-full accent-[#1D9E75] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-gray-700 mb-1">
                      <span>Intervention Complexity:</span>
                      <span className="font-mono text-gray-800">{complexity}x</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                      {[
                        { val: 0.9, label: "Basic (0.9x)" },
                        { val: 1.0, label: "Standard (1.0x)" },
                        { val: 1.3, label: "Advanced (1.3x)" },
                      ].map((c) => (
                        <button
                          key={c.val}
                          onClick={() => setComplexity(c.val)}
                          className={`p-1.5 rounded-lg border cursor-pointer ${
                            complexity === c.val
                              ? "bg-purple-50 border-purple-300 text-purple-800 font-bold"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Predictive Forecast Output (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Hero Multiplier Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Forecasted Social Return Ratio
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {forecast?.confidenceInterval.confidencePct}% Econometric Confidence
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#1D9E75]">
                        ${forecast?.sroiMultiplier}
                      </span>
                      <span className="text-base text-gray-500 font-semibold">
                        Social Value per $1.00 Compute Donated
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-gray-400">Total Net Economic Value</div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        ${forecast?.totalEconomicValueCreated.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Quantifiable Direct Metric */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                        Direct Community Outcome Generated:
                      </span>
                      <div className="text-sm font-bold text-gray-900 mt-0.5">
                        {forecast?.primaryOutcomeMetric.name}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-extrabold text-emerald-700">
                        {forecast?.primaryOutcomeMetric.quantity.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-500 block">Units Avoided / Uplifted</span>
                    </div>
                  </div>

                  {/* 3-Year Compounding Trajectory */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-gray-700 block">
                      3-Year Compounding Impact Trajectory (USD):
                    </span>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-[10px] text-gray-400">Year 1</div>
                        <div className="font-bold text-gray-900 mt-0.5">
                          ${forecast?.threeYearProjection.year1Usd.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-[10px] text-gray-400">Year 2 (+18%)</div>
                        <div className="font-bold text-purple-700 mt-0.5">
                          ${forecast?.threeYearProjection.year2Usd.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                        <div className="text-[10px] text-purple-700 font-semibold">Year 3 Cumulative</div>
                        <div className="font-bold text-purple-900 mt-0.5">
                          ${forecast?.threeYearProjection.cumulativeTotalUsd.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Philanthropic Foundation Co-Funding Matcher */}
        {activeTab === "cofunding" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Philanthropic Co-Funding Consortium</h3>
                <p className="text-xs text-gray-500">
                  Tech corporate donors pledge compute &amp; agents; philanthropic foundation grantmakers match with operational staff cash grants.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600" /> Active Consortium Pools
              </span>
            </div>

            {/* Campaign Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cofundingCampaigns?.map((campaign: any) => {
                const pctMatched = Math.min(
                  100,
                  Math.round(
                    (campaign.foundationGrantFunding.currentMatchedUsd /
                      campaign.foundationGrantFunding.operationalBudgetGoalUsd) *
                      100
                  )
                );

                return (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          SROI: ${campaign.sroiScore}/$1
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          campaign.foundationGrantFunding.status === "fully_matched"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {campaign.foundationGrantFunding.status.replace("_", " ")}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 leading-snug">{campaign.projectTitle}</h3>
                      <div className="text-xs text-gray-500">Non-Profit: {campaign.nonprofitName}</div>
                    </div>

                    {/* Tech Donor Compute Pledge */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Tech Compute Pledge:</span>
                      <div className="font-semibold text-gray-800">{campaign.techDonorPartner.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        {campaign.techDonorPartner.committedComputeHours.toLocaleString()} hrs (${campaign.techDonorPartner.estimatedValueUsd.toLocaleString()} value)
                      </div>
                    </div>

                    {/* Foundation Operational Match Progress */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span>Foundation Staff Grant:</span>
                        <span className="font-mono text-purple-700">
                          ${campaign.foundationGrantFunding.currentMatchedUsd.toLocaleString()} / ${campaign.foundationGrantFunding.operationalBudgetGoalUsd.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${pctMatched}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 block">
                        Funds: {campaign.foundationGrantFunding.targetPositionsFunded.join(", ")}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedCampaignId(campaign.id)}
                        className="w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Pledge Foundation Cash Match
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pledge Match Modal */}
            {selectedCampaignId && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
                  <h3 className="text-base font-bold text-gray-900">Commit Foundation Operational Match</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Pair your philanthropic grant dollars directly with tech donor GPU compute allocations to fully fund local non-profit field staff.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Grantmaking Foundation Name</label>
                      <input
                        type="text"
                        value={foundationName}
                        onChange={(e) => setFoundationName(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Operational Grant Match ($ USD)</label>
                      <input
                        type="number"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(parseInt(e.target.value))}
                        step={1000}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedCampaignId(null)}
                      className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        pledgeMutation.mutate({
                          campaignId: selectedCampaignId,
                          pledgeAmountUsd: pledgeAmount,
                          foundationName,
                        })
                      }
                      disabled={pledgeMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Commit Grant Pledge
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Econometric Methodology */}
        {activeTab === "methodology" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Peer-Reviewed Econometric Valuation Methodology</h3>
              <p className="text-xs text-gray-500 mt-1">
                The SROI ML Engine derives its outcome multipliers from validated academic, government, and philanthropic research bodies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benchmarks?.map((bm: any) => (
                <div key={bm.sectorId} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-sm">{bm.sectorName}</h4>
                    <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-emerald-100 text-emerald-800">
                      ${bm.baseMultiplierRatio} / $1.00
                    </span>
                  </div>

                  <div className="text-xs text-purple-700 font-semibold">{bm.sourceCitation}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{bm.methodologyDescription}</p>

                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-mono">
                    Baseline Unit Value: ${bm.dollarValuePerBeneficiary} per beneficiary
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
