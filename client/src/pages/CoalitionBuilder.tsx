import { useState } from "react";
import { Users, Plus, MessageSquare, TrendingUp, Zap, Search } from "lucide-react";

const SAMPLE_COALITIONS = [
  {
    id: 1,
    name: "Education Tech Alliance",
    members: 8,
    goal: "Democratize AI education tools for underserved schools",
    resources: 12,
    impact: "500+ students reached",
  },
  {
    id: 2,
    name: "Healthcare Innovation Network",
    members: 5,
    goal: "Deploy AI diagnostic tools to rural clinics",
    resources: 7,
    impact: "15 clinics equipped",
  },
  {
    id: 3,
    name: "Environmental Data Collective",
    members: 12,
    goal: "Share climate and environmental datasets",
    resources: 24,
    impact: "20 research projects",
  },
];

export default function CoalitionBuilder() {
  const [coalitions] = useState(SAMPLE_COALITIONS);

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-8">
        <div className="container-page flex-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Coalition Builder</h1>
            <p className="text-gray-700 mt-1">
              Unite multiple non-profits to amplify impact and access larger resource packages
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Coalition
          </button>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="search"
              placeholder="Search coalitions..."
              className="w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Coalitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {coalitions.map((coalition) => (
            <div key={coalition.id} className="card flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="card-title">{coalition.name}</h3>
                  <p className="text-sm text-gray-700 mt-2">{coalition.goal}</p>
                </div>
                <div className="flex-center w-10 h-10 rounded-md bg-secondary-light flex-shrink-0">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4 pb-4 border-b border-gray-300">
                <div>
                  <div className="font-medium text-lg text-gray-900">{coalition.members}</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
                <div>
                  <div className="font-medium text-lg text-gray-900">{coalition.resources}</div>
                  <div className="text-xs text-gray-500">Resources</div>
                </div>
                <div>
                  <span className="badge badge-verified text-xs">{coalition.impact}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button className="btn btn-primary flex-1">Join</button>
                <button className="btn btn-secondary">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="card-sunken p-8">
          <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Why Join a Coalition?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Amplified Impact</h4>
              <p className="text-sm text-gray-700">
                Combined resources reach more organizations and create greater social impact
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Shared Expertise</h4>
              <p className="text-sm text-gray-700">
                Learn from peer organizations and collaborate on implementation
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Better Negotiation</h4>
              <p className="text-sm text-gray-700">
                Access larger resource packages and negotiate better terms together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
