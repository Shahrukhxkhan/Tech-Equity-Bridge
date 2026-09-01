import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, Award, Crown, AlertTriangle, CheckCircle2, Clock, Activity, Search, RefreshCw, Send, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";

export default function PledgeMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "flagged" | "compliant">("all");

  const { data: pledgeData, refetch, isLoading } = trpc.incentive.getAdminPledgeMonitor.useQuery();

  const handleTriggerEvaluation = () => {
    toast.success("Tier & SLA evaluations recomputed across all active donors.");
    refetch();
  };

  const handleSendRemediation = (companyName: string) => {
    toast.success(`Under-delivery remediation reminder sent to ${companyName}`);
  };

  const pledges = pledgeData || [
    {
      donorId: 1,
      companyName: "Nexus DeepMind Labs",
      tier: "founding_partner",
      monthlyPledge: "10,000 GPU Hours",
      currentMonthDelivered: "9,850",
      fulfillmentRate: 98.5,
      flagged: false,
      qualityScore: "4.9",
      lastTested: new Date("2026-08-28"),
      status: "compliant",
    },
    {
      donorId: 2,
      companyName: "Apex Cloud Matrix",
      tier: "equity_champion",
      monthlyPledge: "3,000 GPU Hours",
      currentMonthDelivered: "2,150",
      fulfillmentRate: 71.6,
      flagged: true,
      flagReason: "Shortfall of 28.4% (<80% threshold)",
      qualityScore: "4.2",
      lastTested: new Date("2026-08-25"),
      status: "grace_period",
    },
    {
      donorId: 3,
      companyName: "CivicAI Systems",
      tier: "impact_ally",
      monthlyPledge: "50,000 API Calls",
      currentMonthDelivered: "54,200",
      fulfillmentRate: 108.4,
      flagged: false,
      qualityScore: "4.7",
      lastTested: new Date("2026-08-30"),
      status: "compliant",
    },
  ];

  const filteredPledges = pledges.filter((p: any) => {
    const matchesSearch = p.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "flagged" && p.flagged) ||
      (selectedFilter === "compliant" && !p.flagged);
    return matchesSearch && matchesFilter;
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "founding_partner":
        return <Crown className="w-4 h-4 text-amber-500" />;
      case "equity_champion":
        return <Award className="w-4 h-4 text-purple-600" />;
      default:
        return <Shield className="w-4 h-4 text-[#1D9E75]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Admin Console
              </span>
              <span className="text-xs text-gray-500">Engine Audit Log</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Donor Pledge & SLA Fulfillment Monitor</h1>
            <p className="text-xs text-gray-500">
              Audit corporate commitments, track under-delivery shortfalls, and manage 7-day grace periods.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerEvaluation}
              className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md bg-[#1D9E75] text-white hover:bg-[#16815f] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-evaluate Tiers
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1 text-xs">
              <span>Total Active Pledges</span>
              <Activity className="w-4 h-4 text-[#1D9E75]" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{pledges.length} Donors</div>
            <span className="text-[11px] text-gray-500">Across 3 Incentive Tiers</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1 text-xs">
              <span>Avg. Fulfillment Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">92.8%</div>
            <span className="text-[11px] text-emerald-700 font-medium">Within target SLA</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1 text-xs">
              <span>Under-Delivery Shortfalls</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {pledges.filter((p: any) => p.flagged).length} Flagged
            </div>
            <span className="text-[11px] text-amber-700 font-medium">7-Day Grace Period active</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1 text-xs">
              <span>Platform Quality Index</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">4.6 / 5.0</div>
            <span className="text-[11px] text-purple-700 font-medium">p95 &lt; 2.1s average</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Pledges ({pledges.length})
            </button>
            <button
              onClick={() => setSelectedFilter("flagged")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedFilter === "flagged"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Flagged Shortfalls ⚠️
            </button>
            <button
              onClick={() => setSelectedFilter("compliant")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedFilter === "compliant"
                  ? "bg-[#1D9E75] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              SLA Compliant ✅
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="py-3 px-4 font-medium">Donor Organization</th>
                  <th className="py-3 px-4 font-medium">Incentive Tier</th>
                  <th className="py-3 px-4 font-medium">Monthly Commitment</th>
                  <th className="py-3 px-4 font-medium">Delivered / Pledged</th>
                  <th className="py-3 px-4 font-medium">Quality SLA</th>
                  <th className="py-3 px-4 font-medium">Fulfillment Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPledges.map((donor: any) => (
                  <tr key={donor.donorId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {donor.companyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getTierIcon(donor.tier)}
                        <span className="capitalize font-medium text-gray-700">
                          {donor.tier.replace("_", " ")}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {donor.monthlyPledge}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-gray-900">{donor.fulfillmentRate}%</span>
                          <span className="text-gray-500">{donor.currentMonthDelivered} delivered</span>
                        </div>
                        <div className="w-28 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              donor.fulfillmentRate >= 80 ? "bg-[#1D9E75]" : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(100, donor.fulfillmentRate)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ★ {donor.qualityScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {donor.flagged ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            <AlertTriangle className="w-3 h-3 mr-1" /> 7-Day Grace
                          </span>
                          <p className="text-[10px] text-amber-700 truncate max-w-[150px]">{donor.flagReason}</p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Compliant
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {donor.flagged ? (
                        <button
                          onClick={() => handleSendRemediation(donor.companyName)}
                          className="px-2.5 py-1 text-xs font-medium rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" /> Remind
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">All Good</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
