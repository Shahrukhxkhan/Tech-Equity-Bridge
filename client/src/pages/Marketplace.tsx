import { useState } from "react";
import { Search, Filter, Zap, Building2, Database, Server } from "lucide-react";

const SAMPLE_RESOURCES = [
  {
    id: 1,
    title: "AI Content Moderation Agent",
    donor: "TechCorp Inc.",
    category: "AI Agents",
    description: "Production-ready AI agent for content moderation with 99.2% accuracy",
    organizations: 5,
    matchScore: 92,
  },
  {
    id: 2,
    title: "Cloud Computing Credits",
    donor: "CloudServices Ltd.",
    category: "Compute",
    description: "$50K in annual cloud computing resources for non-profits",
    organizations: 12,
    matchScore: 78,
  },
  {
    id: 3,
    title: "Data Analytics Platform",
    donor: "DataViz Solutions",
    category: "Tools",
    description: "Enterprise data analytics platform with custom dashboards",
    organizations: 8,
    matchScore: 85,
  },
];

const CATEGORIES = ["All", "AI Agents", "Tools", "Compute", "Data"];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = SAMPLE_RESOURCES.filter((resource) => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI Agents":
        return <Zap className="w-4 h-4" />;
      case "Compute":
        return <Server className="w-4 h-4" />;
      case "Tools":
        return <Database className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-8">
        <div className="container-page">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Resource Marketplace</h1>
          <p className="text-gray-700">
            Discover AI agents, tools, datasets, and computing resources from leading tech companies
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="container-page py-8">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "nav-pill-active"
                    : "nav-pill-inactive"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="card flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex-center w-8 h-8 rounded-md bg-secondary-light">
                    {getCategoryIcon(resource.category)}
                  </div>
                  <span className="badge badge-ai-agent">{resource.category}</span>
                </div>
              </div>

              <h3 className="card-title mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-700 mb-4 flex-grow">{resource.description}</p>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-300">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Donor:</span>
                  <span className="font-medium text-gray-900">{resource.donor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Organizations using:</span>
                  <span className="font-medium text-gray-900">{resource.organizations}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Match score</span>
                  <span className="match-score-label">{resource.matchScore}%</span>
                </div>
                <div className="match-score-track">
                  <div
                    className="match-score-fill"
                    style={{ width: `${resource.matchScore}%` }}
                  ></div>
                </div>
              </div>

              <button className="btn btn-primary w-full">Request</button>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No resources found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn btn-secondary"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
