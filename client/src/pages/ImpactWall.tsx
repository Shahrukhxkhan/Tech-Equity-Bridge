import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, Award, Crown, CheckCircle2, Clock, Building2, Users, Search, ExternalLink, ArrowRight, FileText, Zap, Globe, Sparkles } from "lucide-react";
import CsrReportViewer from "@/components/CsrReportViewer";

export default function ImpactWall() {
  const [activeDirectoryTab, setActiveDirectoryTab] = useState<"donors" | "nonprofits">("donors");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCsrDonor, setActiveCsrDonor] = useState<{ id: number; name: string } | null>(null);

  const { data: featuredDonors } = trpc.incentive.getFeaturedDonors.useQuery();
  const { data: publicNonprofits } = trpc.analytics.getPublicNonprofits.useQuery();

  const donors = featuredDonors || [
    {
      id: 1,
      donorId: 1,
      publicSlug: "nexus-deepmind",
      displayName: "Nexus DeepMind Labs",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120",
      description: "Pioneering state-of-the-art multimodal AI compute pledges for civic advancement, food security, and community health.",
      tier: "founding_partner",
      totalHoursContributed: "14850.00",
      organizationsHelped: 42,
      peopleImpacted: 89000,
    },
    {
      id: 2,
      donorId: 2,
      publicSlug: "apex-cloud",
      displayName: "Apex Cloud Matrix",
      logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120",
      description: "Providing dedicated high-throughput GPU clusters to accelerate university and grassroots non-profit research.",
      tier: "equity_champion",
      totalHoursContributed: "7200.00",
      organizationsHelped: 28,
      peopleImpacted: 45000,
    },
    {
      id: 3,
      donorId: 3,
      publicSlug: "civic-ai-systems",
      displayName: "CivicAI Systems",
      logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&h=120",
      description: "Empowering non-profits with automated grant writing and intake intelligence agents.",
      tier: "impact_ally",
      totalHoursContributed: "2100.00",
      organizationsHelped: 16,
      peopleImpacted: 22000,
    },
  ];

  const nonprofits = publicNonprofits || [
    {
      id: 1,
      name: "Community Health Net",
      city: "San Francisco, CA",
      sector: "Healthcare & Immigration",
      mission: "Bridging the healthcare divide for vulnerable neighborhood families through multilingual digital navigation.",
      beneficiariesServed: 15400,
      activeProjects: 3,
      verifiedEsgBadge: "Health Equity Tier 1",
      techDeployed: ["Multilingual Health Translation AI", "Samsung Clinic Tablets", "NVIDIA A100 GPU Cluster"],
      primaryDonors: ["Nexus DeepMind Labs", "Apex Cloud Matrix"],
    },
    {
      id: 2,
      name: "Urban Transit Alliance",
      city: "Chicago, IL",
      sector: "Transit & Mobility",
      mission: "Empowering transit-dependent neighborhoods with transparent telemetry and route accessibility tools.",
      beneficiariesServed: 42000,
      activeProjects: 2,
      verifiedEsgBadge: "Civic Infrastructure Ally",
      techDeployed: ["Census & Demographic ETL Pipeline", "GIS Transit Deserts Model"],
      primaryDonors: ["DataViz Solutions", "CivicAI Systems"],
    },
    {
      id: 3,
      name: "Civic Literacy Foundation",
      city: "Atlanta, GA",
      sector: "Education & Youth",
      mission: "Providing Title I elementary students with adaptive AI literacy tutors and STEM mentoring.",
      beneficiariesServed: 8200,
      activeProjects: 4,
      verifiedEsgBadge: "NextGen Education Partner",
      techDeployed: ["Youth Literacy Tutor AI", "Grant Writing Assistant v2"],
      primaryDonors: ["Nexus DeepMind Labs"],
    },
  ];

  const filteredDonors = donors.filter((d: any) => {
    const matchesTier = selectedTier === "all" || d.tier === selectedTier;
    const matchesSearch = d.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const filteredNonprofits = nonprofits.filter((n: any) => {
    return n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.sector.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "founding_partner":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Crown className="w-3.5 h-3.5 mr-1 text-amber-500" /> Founding Partner
          </span>
        );
      case "equity_champion":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Award className="w-3.5 h-3.5 mr-1 text-purple-600" /> Equity Champion
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Shield className="w-3.5 h-3.5 mr-1 text-[#1D9E75]" /> Impact Ally
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Navigation Top Bar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#1D9E75]" />
            <a href="/" className="font-semibold text-lg text-gray-900">Tech-Equity Bridge</a>
            <span className="text-xs font-medium text-gray-400 ml-2 pl-2 border-l border-gray-200">
              Public Impact Directory
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/impact" className="text-xs font-medium text-gray-600 hover:text-gray-900">
              Geospatial Map
            </a>
            <a href="/marketplace" className="text-xs font-medium text-gray-600 hover:text-gray-900">
              Marketplace
            </a>
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-1.5 px-3">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#1D9E75]">
            <Sparkles className="w-3.5 h-3.5" /> Verified Public Impact Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Recognizing Pioneers in Digital Equity
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-gray-600 leading-relaxed">
            Showcasing the verified compute pledges of corporate leaders and the transformative grassroots deployments of non-profit changemakers.
          </p>

          {/* Dual Toggle Pill */}
          <div className="pt-4 flex justify-center">
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
              <button
                onClick={() => setActiveDirectoryTab("donors")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeDirectoryTab === "donors"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                👑 Corporate Donor Impact Wall
              </button>
              <button
                onClick={() => setActiveDirectoryTab("nonprofits")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeDirectoryTab === "nonprofits"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🏛️ Non-Profit Impact Showcase
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Listing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeDirectoryTab === "donors" ? "corporate donors" : "non-profit organizations"}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75] shadow-xs"
            />
          </div>

          {activeDirectoryTab === "donors" && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setSelectedTier("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedTier === "all" ? "bg-[#1D9E75] text-white" : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                All Tiers
              </button>
              <button
                onClick={() => setSelectedTier("founding_partner")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedTier === "founding_partner" ? "bg-amber-600 text-white" : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                Founding Partners 👑
              </button>
              <button
                onClick={() => setSelectedTier("equity_champion")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedTier === "equity_champion" ? "bg-purple-700 text-white" : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                Equity Champions 🌟
              </button>
              <button
                onClick={() => setSelectedTier("impact_ally")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedTier === "impact_ally" ? "bg-emerald-700 text-white" : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                Impact Allies 🛡️
              </button>
            </div>
          )}
        </div>

        {/* DONOR IMPACT WALL VIEW */}
        {activeDirectoryTab === "donors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor: any) => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <img
                      src={donor.logoUrl}
                      alt={donor.displayName}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-xs"
                    />
                    {getTierBadge(donor.tier)}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{donor.displayName}</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{donor.description}</p>
                </div>

                <div className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-gray-50 border border-gray-100 text-center text-xs">
                    <div>
                      <div className="font-bold text-gray-900">{parseFloat(donor.totalHoursContributed).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">Hours Pledged</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-700">{donor.organizationsHelped}</div>
                      <div className="text-[10px] text-gray-500">Non-Profits</div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-700">{donor.peopleImpacted.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">Impacted</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveCsrDonor({ id: donor.donorId || donor.id, name: donor.displayName })}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View CSR Report
                    </button>
                    <a
                      href={`/marketplace`}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium cursor-pointer"
                      title="View Resources"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NON-PROFIT DIRECTORY VIEW */}
        {activeDirectoryTab === "nonprofits" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNonprofits.map((np: any) => (
              <div
                key={np.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {np.sector}
                    </span>
                    <span className="text-xs text-gray-400">{np.city}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{np.name}</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{np.mission}</p>
                </div>

                <div className="space-y-4">
                  {/* Tech Stack Pills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                      Donated Tech Stack Deployed:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {np.techDeployed?.map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Impact metric bar */}
                  <div className="py-2.5 px-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Beneficiaries:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {np.beneficiariesServed.toLocaleString()}+ residents
                    </span>
                  </div>

                  <a
                    href={`/coalition`}
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    View Coalition Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for CSR Report View */}
      {activeCsrDonor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {activeCsrDonor.name} — ESG Impact Dossier
              </h3>
              <button
                onClick={() => setActiveCsrDonor(null)}
                className="text-gray-400 hover:text-gray-900 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <CsrReportViewer donorId={activeCsrDonor.id} donorName={activeCsrDonor.name} />
          </div>
        </div>
      )}
    </div>
  );
}
