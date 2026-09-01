import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, Award, Crown, CheckCircle2, Clock, Building2, Users, Search, ExternalLink, ArrowRight, FileText, Zap } from "lucide-react";
import CsrReportViewer from "@/components/CsrReportViewer";

export default function ImpactWall() {
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCsrDonor, setActiveCsrDonor] = useState<{ id: number; name: string } | null>(null);

  const { data: featuredDonors } = trpc.incentive.getFeaturedDonors.useQuery();

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

  const filteredDonors = donors.filter((d: any) => {
    const matchesTier = selectedTier === "all" || d.tier === selectedTier;
    const matchesSearch = d.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
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
              Public Impact Wall
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/marketplace" className="text-xs font-medium text-gray-600 hover:text-gray-900">
              Marketplace
            </a>
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-1.5 px-3">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Showcase */}
      <section className="bg-gradient-to-b from-emerald-950 via-gray-900 to-gray-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Civic Tech Donors & Compute Pledges
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Corporate Impact & Resource Wall
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Honoring technology leaders pledging GPU compute, AI agents, and enterprise tools to empower non-profit organizations worldwide.
          </p>

          {/* Aggregate Public Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-gray-800/80">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">24,150+</div>
              <div className="text-xs text-gray-400 mt-0.5">Verified GPU & Agent Hours</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">86</div>
              <div className="text-xs text-gray-400 mt-0.5">Non-Profits Empowered</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">156,000+</div>
              <div className="text-xs text-gray-400 mt-0.5">Community Beneficiaries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory & Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTier("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                selectedTier === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              All Tiers ({donors.length})
            </button>
            <button
              onClick={() => setSelectedTier("founding_partner")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                selectedTier === "founding_partner"
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Founding Partners 👑
            </button>
            <button
              onClick={() => setSelectedTier("equity_champion")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                selectedTier === "equity_champion"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Equity Champions 🌟
            </button>
            <button
              onClick={() => setSelectedTier("impact_ally")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                selectedTier === "impact_ally"
                  ? "bg-[#1D9E75] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Impact Allies 🛡️
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donor companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75]"
            />
          </div>
        </div>

        {/* Donors Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor: any) => (
            <div
              key={donor.id}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between hover:border-gray-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <img
                    src={donor.logoUrl}
                    alt={donor.displayName}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-xs"
                  />
                  {getTierBadge(donor.tier)}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{donor.displayName}</h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-5">
                  {donor.description}
                </p>
              </div>

              <div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-lg bg-gray-50 border border-gray-100 text-center mb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{donor.totalHoursContributed}</div>
                    <div className="text-[10px] text-gray-500">Hours Donated</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{donor.organizationsHelped}</div>
                    <div className="text-[10px] text-gray-500">Non-Profits</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {(donor.peopleImpacted / 1000).toFixed(0)}k+
                    </div>
                    <div className="text-[10px] text-gray-500">Impacted</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCsrDonor({ id: donor.donorId, name: donor.displayName })}
                    className="flex-1 py-1.5 px-2.5 rounded-md border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    CSR Ledger
                  </button>
                  <a
                    href={`/marketplace?donor=${donor.donorId}`}
                    className="py-1.5 px-3 rounded-md bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    View Resources <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSR Report Modal */}
      {activeCsrDonor && (
        <CsrReportViewer
          isOpen={true}
          onClose={() => setActiveCsrDonor(null)}
          donorId={activeCsrDonor.id}
          donorName={activeCsrDonor.name}
        />
      )}
    </div>
  );
}
