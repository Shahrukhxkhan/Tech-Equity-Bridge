import { useState } from "react";
import { BarChart3, TrendingUp, Users, Award, Download, Zap } from "lucide-react";

export default function ImpactTracker() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "donors", label: "Donors" },
    { id: "nonprofits", label: "Non-Profits" },
    { id: "outcomes", label: "Outcomes" },
  ];

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-8">
        <div className="container-page flex-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Impact Tracker</h1>
            <p className="text-gray-700 mt-1">
              Measure, visualize, and share the real-world outcomes of resource sharing
            </p>
          </div>
          <button className="btn btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xs text-gray-500">This quarter</span>
            </div>
            <div className="metric-value metric-value-primary">125K+</div>
            <div className="metric-label">People impacted</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-secondary" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="metric-value metric-value-secondary">847</div>
            <div className="metric-label">Resources shared</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-xs text-gray-500">This month</span>
            </div>
            <div className="metric-value metric-value-accent">342</div>
            <div className="metric-label">Projects enabled</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-xs text-gray-500">Estimated</span>
            </div>
            <div className="metric-value metric-value-primary">$2.3M</div>
            <div className="metric-label">Platform value</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-all ${
                  activeTab === tab.id ? "nav-pill-active" : "nav-pill-inactive"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="card-title mb-4">Platform Growth</h3>
                <div className="h-64 flex items-center justify-center bg-sunken rounded-md">
                  <BarChart3 className="w-12 h-12 text-gray-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="card-title mb-4">Top Resource Categories</h4>
                  <div className="space-y-3">
                    {[
                      { name: "AI Agents", count: 234 },
                      { name: "Computing Resources", count: 189 },
                      { name: "Data & Datasets", count: 156 },
                      { name: "Software Tools", count: 128 },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between pb-3 border-b border-gray-300 last:border-0">
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <span className="badge badge-secondary">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h4 className="card-title mb-4">Sectors Served</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Education", count: 45 },
                      { name: "Healthcare", count: 38 },
                      { name: "Environment", count: 32 },
                      { name: "Social Services", count: 28 },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between pb-3 border-b border-gray-300 last:border-0">
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <span className="badge badge-secondary">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Donors Tab */}
          {activeTab === "donors" && (
            <div className="card">
              <h3 className="card-title mb-4">Top Donors</h3>
              <p className="text-sm text-gray-500 mb-6">Organizations contributing the most resources</p>
              <div className="space-y-4">
                {[
                  { name: "TechCorp Inc.", resources: 45, impact: "1,200+ people" },
                  { name: "CloudServices Ltd.", resources: 38, impact: "850+ people" },
                  { name: "DataViz Solutions", resources: 32, impact: "650+ people" },
                ].map((donor) => (
                  <div key={donor.name} className="flex items-center justify-between pb-4 border-b border-gray-300 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{donor.name}</p>
                      <p className="text-sm text-gray-500">{donor.impact}</p>
                    </div>
                    <span className="badge badge-ai-agent">{donor.resources} resources</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Profits Tab */}
          {activeTab === "nonprofits" && (
            <div className="card">
              <h3 className="card-title mb-4">Most Active Non-Profits</h3>
              <p className="text-sm text-gray-500 mb-6">Organizations receiving and utilizing the most resources</p>
              <div className="space-y-4">
                {[
                  { name: "Global Education Initiative", resources: 12, impact: "5,000+ students" },
                  { name: "Rural Healthcare Network", resources: 8, impact: "2,300+ patients" },
                  { name: "Environmental Research Collective", resources: 15, impact: "20+ projects" },
                ].map((org) => (
                  <div key={org.name} className="flex items-center justify-between pb-4 border-b border-gray-300 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{org.name}</p>
                      <p className="text-sm text-gray-500">{org.impact}</p>
                    </div>
                    <span className="badge badge-verified">{org.resources} resources</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes Tab */}
          {activeTab === "outcomes" && (
            <div className="card">
              <h3 className="card-title mb-4">Reported Outcomes</h3>
              <p className="text-sm text-gray-500 mb-6">Real-world impact stories from the community</p>
              <div className="space-y-4">
                {[
                  {
                    title: "AI Literacy Program Reaches 500 Students",
                    org: "Global Education Initiative",
                    metric: "500 students trained",
                  },
                  {
                    title: "Rural Clinic Deploys Diagnostic AI",
                    org: "Rural Healthcare Network",
                    metric: "2,300 patients served",
                  },
                  {
                    title: "Environmental Data Enables 20 Research Projects",
                    org: "Environmental Research Collective",
                    metric: "20 projects launched",
                  },
                ].map((outcome, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-300 last:border-0">
                    <p className="font-medium text-gray-900">{outcome.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{outcome.org}</p>
                    <span className="badge badge-high-demand mt-2">{outcome.metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
