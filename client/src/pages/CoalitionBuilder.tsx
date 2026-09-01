import { useState } from "react";
import { Users, Plus, MessageSquare, TrendingUp, Zap, Search, LayoutGrid, CheckSquare, PieChart, ShieldCheck, ArrowRight } from "lucide-react";
import CoalitionKanban from "@/components/CoalitionKanban";
import SharedResourcePoolManager from "@/components/SharedResourcePoolManager";
import LiveEvaluationChat from "@/components/LiveEvaluationChat";

const SAMPLE_COALITIONS = [
  {
    id: 1,
    name: "Education & Healthcare Tech Alliance",
    members: 8,
    goal: "Democratize AI education and multilingual clinical triage for underserved schools and neighborhood clinics",
    resources: 12,
    impact: "15,400+ residents served",
    status: "Active Coalition",
  },
  {
    id: 2,
    name: "Urban Transit & Accessibility Network",
    members: 5,
    goal: "Deploy AI routing agents and GIS accessibility tools for public transit deserts",
    resources: 7,
    impact: "24 transit routes optimized",
    status: "Active Coalition",
  },
  {
    id: 3,
    name: "Civic Food Security & Demographics Collective",
    members: 12,
    goal: "Share climate, demographic, and food pantry distribution telemetry",
    resources: 24,
    impact: "45 pantries equipped",
    status: "Active Coalition",
  },
];

export default function CoalitionBuilder() {
  const [coalitions] = useState(SAMPLE_COALITIONS);
  const [activeTab, setActiveTab] = useState<"directory" | "kanban" | "pools" | "chat">("directory");
  const [selectedCoalition, setSelectedCoalition] = useState(SAMPLE_COALITIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoalitions = coalitions.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1D9E75] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Coalition Workspace
              </span>
              <span className="text-xs text-gray-500">Joint Tech Initiatives & Resource Splitting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coalition Workspace & Collaboration</h1>
            <p className="text-xs text-gray-500">
              Unite multiple non-profits to co-manage shared GPU compute pools, execute milestone roadmaps, and chat with corporate donors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("kanban")}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab("pools")}
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <PieChart className="w-3.5 h-3.5 mr-1.5" />
              Manage Shared Pools
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex gap-3 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("directory")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "directory"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. Coalition Directory
          </button>
          <button
            onClick={() => setActiveTab("kanban")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "kanban"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. Milestone Kanban Board
          </button>
          <button
            onClick={() => setActiveTab("pools")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "pools"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            3. Shared Resource Pool Allocator
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === "chat"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            4. Live Donor & Partner Chat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: Coalition Directory */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active coalitions by mission focus or tech domain..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75] shadow-xs"
              />
            </div>

            {/* Coalitions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoalitions.map((coalition) => (
                <div
                  key={coalition.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-xs hover:border-gray-300 transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1D9E75]">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {coalition.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 leading-snug">{coalition.name}</h3>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{coalition.goal}</p>
                  </div>

                  <div>
                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-100 text-center mb-3 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{coalition.members}</div>
                        <div className="text-[10px] text-gray-500">Non-Profits</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-700">{coalition.resources}</div>
                        <div className="text-[10px] text-gray-500">Resources</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-700">Verified</div>
                        <div className="text-[10px] text-gray-500">{coalition.impact.split(" ")[0]}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCoalition(coalition);
                          setActiveTab("kanban");
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Enter Workspace <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCoalition(coalition);
                          setActiveTab("chat");
                        }}
                        className="py-2 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium cursor-pointer"
                        title="Live Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Milestone Kanban Board */}
        {activeTab === "kanban" && (
          <CoalitionKanban coalitionId={selectedCoalition.id} coalitionName={selectedCoalition.name} />
        )}

        {/* TAB 3: Shared Resource Pool Allocator */}
        {activeTab === "pools" && (
          <SharedResourcePoolManager coalitionId={selectedCoalition.id} coalitionName={selectedCoalition.name} />
        )}

        {/* TAB 4: Live Evaluation & Partner Chat */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <LiveEvaluationChat
              requestId={1}
              requestTitle={`${selectedCoalition.name} Shared GPU & Agent Allocation`}
              donorName="Dr. Aris Thorne (Nexus DeepMind)"
              nonprofitName="Elena Rostova (Community Health Net)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
