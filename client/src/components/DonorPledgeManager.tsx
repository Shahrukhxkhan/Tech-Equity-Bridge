import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, Award, Crown, Clock, Calendar, CheckCircle2, AlertTriangle, Plus, Play, Pause, FileText, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface DonorPledgeManagerProps {
  donorId: number;
  onOpenBenchmark?: (resourceId: number) => void;
  onOpenCsr?: (donorId: number) => void;
}

export default function DonorPledgeManager({ donorId, onOpenBenchmark, onOpenCsr }: DonorPledgeManagerProps) {
  const [activeTab, setActiveTab] = useState<"tier" | "pledges" | "fulfillment">("tier");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState<"gpu_compute" | "ai_agent" | "data_processing" | "software_tool">("gpu_compute");
  const [pledgeQuantity, setPledgeQuantity] = useState<number>(1000);
  const [pledgeUnit, setPledgeUnit] = useState<string>("GPU Hours / month");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday - Friday"]);
  const [startTime, setStartTime] = useState("20:00");
  const [endTime, setEndTime] = useState("08:00");

  // tRPC Queries
  const { data: tierData, refetch: refetchTier } = trpc.incentive.getDonorTier.useQuery({ donorId });
  const { data: pledges, refetch: refetchPledges } = trpc.incentive.getPledges.useQuery({ donorId });

  // Mutations
  const setTierMutation = trpc.incentive.setDonorTier.useMutation({
    onSuccess: () => {
      toast.success("Tier commitment updated successfully!");
      refetchTier();
    },
  });

  const createPledgeMutation = trpc.incentive.createPledge.useMutation({
    onSuccess: () => {
      toast.success("Resource pledge created successfully!");
      setShowCreateModal(false);
      refetchPledges();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create pledge");
    }
  });

  const updateStatusMutation = trpc.incentive.updatePledgeStatus.useMutation({
    onSuccess: () => {
      toast.success("Pledge status updated");
      refetchPledges();
    }
  });

  const currentTier = tierData?.tier || "equity_champion";

  const handleCreatePledge = (e: React.FormEvent) => {
    e.preventDefault();
    createPledgeMutation.mutate({
      resourceType: selectedResourceType,
      quantity: Number(pledgeQuantity),
      unit: pledgeUnit,
      availabilityWindows: [
        {
          day: selectedDays.join(", "),
          startTime,
          endTime,
        }
      ],
      startDate: new Date().toISOString(),
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "founding_partner":
        return <Crown className="w-5 h-5 text-amber-500" />;
      case "equity_champion":
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Shield className="w-5 h-5 text-[#1D9E75]" />;
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "founding_partner":
        return "Founding Partner";
      case "equity_champion":
        return "Equity Champion";
      default:
        return "Impact Ally";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
      {/* Header Banner */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 via-purple-50/30 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
              {getTierIcon(currentTier)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Incentive Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active & Verified
                </span>
              </div>
              <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2 mt-0.5">
                {getTierLabel(currentTier)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCsr && (
              <button
                onClick={() => onOpenCsr(donorId)}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                CSR Impact Report
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md bg-[#1D9E75] text-white hover:bg-[#16815f] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Pledge
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("tier")}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "tier"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Tier Benefits & Perks
          </button>
          <button
            onClick={() => setActiveTab("pledges")}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "pledges"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Resource Pledges ({pledges?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("fulfillment")}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "fulfillment"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            SLA & Fulfillment Auditing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "tier" && (
          <div className="space-y-6">
            {/* Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1 */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  currentTier === "impact_ally"
                    ? "border-[#1D9E75] bg-emerald-50/20 ring-1 ring-[#1D9E75]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#1D9E75]" />
                    <h3 className="text-sm font-medium text-gray-900">Tier 1: Impact Ally</h3>
                  </div>
                  {currentTier === "impact_ally" && (
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Pledge min. <strong>500 GPU-hrs</strong> or <strong>50k API calls</strong> monthly.
                </p>
                <ul className="text-xs text-gray-600 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Public verified donor badge
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Monthly automated CSR impact report
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    SLA: p95 &lt; 5s, uptime &gt; 95%
                  </li>
                </ul>
                <button
                  disabled={currentTier === "impact_ally"}
                  onClick={() =>
                    setTierMutation.mutate({
                      tier: "impact_ally",
                      monthlyPledgeAmount: 500,
                      pledgeUnit: "gpu_hours",
                    })
                  }
                  className="w-full py-1.5 px-3 rounded text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  {currentTier === "impact_ally" ? "Active Tier" : "Select Tier"}
                </button>
              </div>

              {/* Tier 2 */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  currentTier === "equity_champion"
                    ? "border-purple-500 bg-purple-50/20 ring-1 ring-purple-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-medium text-gray-900">Tier 2: Equity Champion</h3>
                  </div>
                  {currentTier === "equity_champion" && (
                    <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Pledge min. <strong>2,000 GPU-hrs</strong> or <strong>200k API calls</strong> monthly.
                </p>
                <ul className="text-xs text-gray-600 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    All Tier 1 benefits included
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Featured placement in Marketplace
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Quarterly joint PR release generator
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    SLA: p95 &lt; 3s, uptime &gt; 99%, score ≥ 4.0
                  </li>
                </ul>
                <button
                  disabled={currentTier === "equity_champion"}
                  onClick={() =>
                    setTierMutation.mutate({
                      tier: "equity_champion",
                      monthlyPledgeAmount: 2000,
                      pledgeUnit: "gpu_hours",
                    })
                  }
                  className="w-full py-1.5 px-3 rounded text-xs font-medium border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 disabled:opacity-50 cursor-pointer"
                >
                  {currentTier === "equity_champion" ? "Active Tier" : "Upgrade to Champion"}
                </button>
              </div>

              {/* Tier 3 */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  currentTier === "founding_partner"
                    ? "border-amber-500 bg-amber-50/20 ring-1 ring-amber-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-medium text-gray-900">Tier 3: Founding Partner</h3>
                  </div>
                  {currentTier === "founding_partner" && (
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Pledge min. <strong>10,000 GPU-hrs</strong> or <strong>1M API calls</strong> monthly.
                </p>
                <ul className="text-xs text-gray-600 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Dedicated co-branded impact microsite
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Platform Advisory Council seat
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Verified ESG Contribution Certificate
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    SLA: p95 &lt; 2s, uptime &gt; 99.5%, score ≥ 4.5
                  </li>
                </ul>
                <button
                  disabled={currentTier === "founding_partner"}
                  onClick={() =>
                    setTierMutation.mutate({
                      tier: "founding_partner",
                      monthlyPledgeAmount: 10000,
                      pledgeUnit: "gpu_hours",
                    })
                  }
                  className="w-full py-1.5 px-3 rounded text-xs font-medium border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 disabled:opacity-50 cursor-pointer"
                >
                  {currentTier === "founding_partner" ? "Active Tier" : "Upgrade to Partner"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pledges" && (
          <div className="space-y-4">
            {(!pledges || pledges.length === 0) ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">No active resource pledges yet</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">Commit computing or AI agent capacity to fulfill your incentive tier.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-3 py-1.5 rounded text-xs font-medium bg-[#1D9E75] text-white hover:bg-[#16815f] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Pledge
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pledges.map((pledge: any) => (
                  <div key={pledge.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 uppercase">
                          {pledge.resourceType.replace("_", " ")}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900">
                          {pledge.quantity} {pledge.unit}
                        </h4>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          pledge.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          {pledge.status}
                        </span>
                      </div>

                      {pledge.availabilityWindows && pledge.availabilityWindows.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {pledge.availabilityWindows.map((w: any, idx: number) => (
                              <span key={idx}>
                                {w.day}: {w.startTime} - {w.endTime}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenBenchmark && (
                        <button
                          onClick={() => onOpenBenchmark(pledge.id)}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Run SLA Benchmark
                        </button>
                      )}
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            pledgeId: pledge.id,
                            status: pledge.status === "active" ? "paused" : "active",
                          })
                        }
                        className="p-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-900 cursor-pointer"
                        title={pledge.status === "active" ? "Pause Pledge" : "Activate Pledge"}
                      >
                        {pledge.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "fulfillment" && (
          <div className="space-y-6">
            {/* Fulfillment Status Box */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs text-gray-500">Current Month Fulfillment (August 2026)</span>
                  <div className="text-lg font-semibold text-gray-900">2,450 / 2,000 Hours Delivered (122.5%)</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> SLA Compliant
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-[#1D9E75] h-2 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Historical Table */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Recent Monthly Audits</h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Pledged</th>
                      <th className="py-2.5 px-3">Delivered</th>
                      <th className="py-2.5 px-3">Fulfillment</th>
                      <th className="py-2.5 px-3">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">2026-08</td>
                      <td className="py-2.5 px-3">2,000 hrs</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">2,450 hrs</td>
                      <td className="py-2.5 px-3">122.5%</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Passed</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">2026-07</td>
                      <td className="py-2.5 px-3">2,000 hrs</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">2,100 hrs</td>
                      <td className="py-2.5 px-3">105.0%</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Passed</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">2026-06</td>
                      <td className="py-2.5 px-3">2,000 hrs</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">1,940 hrs</td>
                      <td className="py-2.5 px-3">97.0%</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Passed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Pledge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Create Resource Pledge</h3>
            <p className="text-xs text-gray-500 mb-4">Specify available capacity and scheduled availability windows.</p>

            <form onSubmit={handleCreatePledge} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Resource Type</label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value as any)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-[#1D9E75]"
                >
                  <option value="gpu_compute">GPU Compute (NVIDIA A100/H100/T4)</option>
                  <option value="ai_agent">Autonomous AI Agent / API Endpoint</option>
                  <option value="data_processing">Data Processing & ETL Pipeline</option>
                  <option value="software_tool">Software Tool / SaaS License</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={pledgeQuantity}
                    onChange={(e) => setPledgeQuantity(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-[#1D9E75]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit Description</label>
                  <input
                    type="text"
                    value={pledgeUnit}
                    onChange={(e) => setPledgeUnit(e.target.value)}
                    placeholder="e.g. GPU Hours / month"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-[#1D9E75]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Availability Window</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500">From (24h)</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">To (24h)</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Off-peak or dedicated schedules help non-profits plan workloads.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPledgeMutation.isPending}
                  className="px-3 py-1.5 rounded bg-[#1D9E75] text-xs font-medium text-white hover:bg-[#16815f] disabled:opacity-50 cursor-pointer"
                >
                  {createPledgeMutation.isPending ? "Creating..." : "Confirm Pledge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
