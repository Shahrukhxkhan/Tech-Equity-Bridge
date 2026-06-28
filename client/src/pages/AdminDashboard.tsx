import { useState } from "react";
import {
  BarChart3,
  Users,
  AlertCircle,
  TrendingUp,
  Shield,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Zap,
  Search,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const users = [
    { id: 1, name: "TechCorp Inc.", type: "Donor", status: "verified", joined: "2 months ago" },
    { id: 2, name: "Global Education Initiative", type: "Non-Profit", status: "verified", joined: "1 month ago" },
    { id: 3, name: "CloudServices Ltd.", type: "Donor", status: "pending", joined: "1 week ago" },
    { id: 4, name: "Rural Healthcare Network", type: "Non-Profit", status: "verified", joined: "3 weeks ago" },
  ];

  const moderationQueue = [
    {
      id: 1,
      title: "AI Content Moderation Agent",
      donor: "TechCorp Inc.",
      status: "pending",
      submitted: "2 days ago",
    },
    {
      id: 2,
      title: "Cloud Computing Credits",
      donor: "CloudServices Ltd.",
      status: "flagged",
      submitted: "1 day ago",
    },
    {
      id: 3,
      title: "Data Analytics Platform",
      donor: "DataViz Solutions",
      status: "approved",
      submitted: "5 days ago",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "moderation", label: "Moderation" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-8">
        <div className="container-page flex-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-700 mt-1">Platform oversight and management</p>
          </div>
          <button className="btn btn-secondary">
            <Shield className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Tabs */}
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
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <div className="metric-value metric-value-primary">1,847</div>
                <div className="metric-label">Active users</div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <div className="metric-value metric-value-secondary">847</div>
                <div className="metric-label">Resources shared</div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
                <div className="metric-value metric-value-accent">12</div>
                <div className="metric-label">Flagged items</div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500">This month</span>
                </div>
                <div className="metric-value metric-value-primary">+24%</div>
                <div className="metric-label">Growth rate</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="card-title mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between pb-3 border-b border-gray-300 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.type}</p>
                      </div>
                      <span className={`badge ${user.status === "verified" ? "badge-verified" : "badge-pending"}`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title mb-4">Moderation Queue</h3>
                <div className="space-y-3">
                  {moderationQueue.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between pb-3 border-b border-gray-300 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.submitted}</p>
                      </div>
                      <span className={`badge ${item.status === "approved" ? "badge-verified" : item.status === "flagged" ? "badge-high-demand" : "badge-pending"}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search users..."
                className="w-full pl-10 pr-4"
              />
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-300 last:border-0">
                        <td className="py-3 px-4 text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-700 text-sm">{user.type}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${user.status === "verified" ? "badge-verified" : "badge-pending"}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 text-sm">{user.joined}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="btn btn-ghost btn-sm">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="btn btn-ghost btn-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            {moderationQueue.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">From: {item.donor}</p>
                    <p className="text-xs text-gray-500 mt-2">Submitted {item.submitted}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm">Approve</button>
                    <button className="btn btn-secondary btn-sm">Review</button>
                    <button className="btn btn-ghost btn-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="card">
            <h3 className="card-title mb-4">Platform Analytics</h3>
            <div className="h-64 flex items-center justify-center bg-sunken rounded-lg">
              <BarChart3 className="w-12 h-12 text-gray-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
