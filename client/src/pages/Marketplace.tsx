import { useState } from "react";
import { Search, Filter, Zap, Building2, Database, Server, Shield, Award, Crown, CheckCircle2, Activity, ArrowRight } from "lucide-react";
import BenchmarkRunnerModal from "@/components/BenchmarkRunnerModal";
import { toast } from "sonner";

const SAMPLE_RESOURCES = [
  {
    id: 1,
    title: "Multilingual Health Translation Agent",
    donor: "Nexus DeepMind Labs",
    donorTier: "founding_partner",
    category: "AI Agents",
    description: "Production-ready autonomous agent supporting 42 languages for community health intake with 99.4% accuracy.",
    organizations: 14,
    matchScore: 95,
    qualityScore: "4.9",
    latencyP95: "1.2s",
    uptime: "99.9%",
  },
  {
    id: 2,
    title: "NVIDIA A100 GPU Cluster Capacity",
    donor: "Apex Cloud Matrix",
    donorTier: "equity_champion",
    category: "Compute",
    description: "Dedicated GPU hours for geospatial mapping, climate modeling, and civic demographic research.",
    organizations: 28,
    matchScore: 88,
    qualityScore: "4.8",
    latencyP95: "1.6s",
    uptime: "99.5%",
  },
  {
    id: 3,
    title: "Automated Non-Profit Grant Screener",
    donor: "CivicAI Systems",
    donorTier: "impact_ally",
    category: "Tools",
    description: "Intelligent RFP parser and proposal compliance assistant tailored for 501(c)(3) funding applications.",
    organizations: 16,
    matchScore: 91,
    qualityScore: "4.7",
    latencyP95: "2.1s",
    uptime: "98.8%",
  },
  {
    id: 4,
    title: "Census & Demographics ETL Pipeline",
    donor: "DataViz Solutions",
    donorTier: "impact_ally",
    category: "Data",
    description: "Cleaned and anonymized urban socioeconomic datasets formatted for GIS mapping and municipal equity studies.",
    organizations: 9,
    matchScore: 82,
    qualityScore: "4.5",
    latencyP95: "2.4s",
    uptime: "98.5%",
  },
  {
    id: 5,
    title: "Youth Literacy Tutor Assistant",
    donor: "Nexus DeepMind Labs",
    donorTier: "founding_partner",
    category: "AI Agents",
    description: "Adaptive reading comprehension agent designed for K-8 after-school programs in underserved districts.",
    organizations: 35,
    matchScore: 97,
    qualityScore: "5.0",
    latencyP95: "0.9s",
    uptime: "99.9%",
  },
];

const CATEGORIES = ["All", "AI Agents", "Compute", "Tools", "Data"];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [benchmarkResource, setBenchmarkResource] = useState<{ id: number; title: string; type: any } | null>(null);

  const filteredResources = SAMPLE_RESOURCES.filter((resource) => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesTier = selectedTier === "All" || resource.donorTier === selectedTier;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.donor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTier && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI Agents":
        return <Zap className="w-4 h-4 text-purple-600" />;
      case "Compute":
        return <Server className="w-4 h-4 text-[#1D9E75]" />;
      case "Tools":
        return <Database className="w-4 h-4 text-amber-600" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "founding_partner":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Crown className="w-3 h-3 mr-1 text-amber-500" /> Founding Partner
          </span>
        );
      case "equity_champion":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Award className="w-3 h-3 mr-1 text-purple-600" /> Equity Champion
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Shield className="w-3 h-3 mr-1 text-[#1D9E75]" /> Impact Ally
          </span>
        );
    }
  };

  const handleRequestResource = (title: string) => {
    toast.success(`Resource request submitted for "${title}". The donor will review your match criteria.`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1D9E75] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SLA Verified Directory
              </span>
              <a href="/impact-wall" className="text-xs text-purple-700 hover:underline flex items-center gap-1">
                View Donor Impact Wall <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <h1 className="text-3xl font-medium text-gray-900">Resource Marketplace</h1>
            <p className="text-sm text-gray-600 mt-1">
              Discover quality-benchmarked AI agents, computing clusters, and enterprise tools committed by corporate donors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-2 px-3.5">
              My Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search resources, AI models, donor companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75] shadow-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-gray-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    selectedCategory === category
                      ? "bg-[#1D9E75] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Donor Tier Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 focus:ring-1 focus:ring-[#1D9E75]"
              >
                <option value="All">All Donor Tiers</option>
                <option value="founding_partner">Founding Partners 👑</option>
                <option value="equity_champion">Equity Champions 🌟</option>
                <option value="impact_ally">Impact Allies 🛡️</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:border-gray-300 transition-all shadow-xs"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{resource.category}</span>
                  </div>
                  {getTierBadge(resource.donorTier)}
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1.5 leading-snug">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {resource.description}
                </p>
              </div>

              <div>
                {/* SLA & Quality Benchmark Strip */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-gray-50 border border-gray-100 text-center mb-3">
                  <div>
                    <div className="text-xs font-bold text-emerald-700">★ {resource.qualityScore}</div>
                    <div className="text-[10px] text-gray-500">Quality Score</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{resource.latencyP95}</div>
                    <div className="text-[10px] text-gray-500">p95 Latency</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{resource.uptime}</div>
                    <div className="text-[10px] text-gray-500">Uptime SLA</div>
                  </div>
                </div>

                {/* Donor & Match score */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-3 border-b border-gray-100">
                  <span className="truncate max-w-[140px] font-medium text-gray-800">
                    By {resource.donor}
                  </span>
                  <span className="inline-flex items-center text-xs font-semibold text-[#1D9E75]">
                    {resource.matchScore}% match
                  </span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/sandbox`}
                    className="py-2 px-2.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium inline-flex items-center justify-center gap-1 cursor-pointer"
                    title="Test-run in Interactive AI Sandbox"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Sandbox
                  </a>

                  <button
                    onClick={() =>
                      setBenchmarkResource({
                        id: resource.id,
                        title: resource.title,
                        type: resource.category === "AI Agents" ? "ai_agent" : "gpu_compute",
                      })
                    }
                    className="py-2 px-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 inline-flex items-center justify-center gap-1 cursor-pointer"
                    title="Live SLA Benchmark Test"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#1D9E75]" />
                    SLA Test
                  </button>

                  <button
                    onClick={() => handleRequestResource(resource.title)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-medium inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-3">No resources found matching your search and filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedTier("All");
              }}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Benchmark Runner Modal */}
      {benchmarkResource && (
        <BenchmarkRunnerModal
          isOpen={true}
          onClose={() => setBenchmarkResource(null)}
          resourceId={benchmarkResource.id}
          resourceTitle={benchmarkResource.title}
          resourceType={benchmarkResource.type}
        />
      )}
    </div>
  );
}
