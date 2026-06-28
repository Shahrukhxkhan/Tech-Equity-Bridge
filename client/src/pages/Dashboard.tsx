import { useAuth } from "@/_core/hooks/useAuth";
import { TrendingUp, Users, Zap, Award, BarChart3, MessageSquare, Settings } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Please sign in to access your dashboard.</p>
          <a href="/" className="btn btn-primary">Back to Home</a>
        </div>
      </div>
    );
  }

  const isDonor = user?.role === "donor";

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-6">
        <div className="container-page flex-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Dashboard</h1>
            <p className="text-gray-700 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button className="btn btn-ghost">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-page py-8">
        {isDonor ? (
          <>
            {/* Donor Dashboard */}
            <div className="space-y-8">
              {/* Key Metrics */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Your Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-secondary" />
                      <span className="text-xs text-gray-500">This month</span>
                    </div>
                    <div className="metric-value metric-value-secondary">847</div>
                    <div className="metric-label">Resources shared</div>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                    <div className="metric-value metric-value-primary">1,200+</div>
                    <div className="metric-label">Organizations helped</div>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5 text-accent" />
                      <span className="text-xs text-gray-500">Estimated</span>
                    </div>
                    <div className="metric-value metric-value-accent">50K+</div>
                    <div className="metric-label">People impacted</div>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-xs text-gray-500">This quarter</span>
                    </div>
                    <div className="metric-value metric-value-primary">+24%</div>
                    <div className="metric-label">Growth in reach</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="/marketplace" className="card hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-center w-10 h-10 rounded-md bg-primary-light">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="card-title">List a Resource</h3>
                        <p className="text-xs text-gray-500">Share your tools with non-profits</p>
                      </div>
                    </div>
                  </a>

                  <a href="/marketplace" className="card hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-center w-10 h-10 rounded-md bg-secondary-light">
                        <MessageSquare className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="card-title">Review Requests</h3>
                        <p className="text-xs text-gray-500">3 pending requests</p>
                      </div>
                    </div>
                  </a>

                  <a href="/impact" className="card hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-center w-10 h-10 rounded-md bg-accent-light">
                        <BarChart3 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="card-title">View Impact</h3>
                        <p className="text-xs text-gray-500">See your outcomes</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Request approved: AI Content Moderation</p>
                        <p className="text-sm text-gray-500">Approved for Global Education Initiative</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">New match found: Data Analytics Platform</p>
                        <p className="text-sm text-gray-500">92% match with Community Health Network</p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Non-Profit Dashboard */}
            <div className="space-y-8">
              {/* Key Metrics */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Your Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                    <div className="metric-value metric-value-primary">342</div>
                    <div className="metric-label">Resources received</div>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5 text-secondary" />
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                    <div className="metric-value metric-value-secondary">125+</div>
                    <div className="metric-label">Projects enabled</div>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="text-xs text-gray-500">Estimated</span>
                    </div>
                    <div className="metric-value metric-value-accent">50K+</div>
                    <div className="metric-label">People impacted</div>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-xs text-gray-500">This month</span>
                    </div>
                    <div className="metric-value metric-value-primary">+12</div>
                    <div className="metric-label">New resources</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="/marketplace" className="card hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-center w-10 h-10 rounded-md bg-primary-light">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="card-title">Browse Resources</h3>
                        <p className="text-xs text-gray-500">Find new tools and agents</p>
                      </div>
                    </div>
                  </a>

                  <a href="/coalition" className="card hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-center w-10 h-10 rounded-md bg-secondary-light">
                        <Users className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="card-title">Join Coalition</h3>
                        <p className="text-xs text-gray-500">Partner with other non-profits</p>
                      </div>
                    </div>
                  </a>

                  <a href="/grant-assistant" className="card hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex-center w-10 h-10 rounded-md bg-accent-light">
                        <BarChart3 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="card-title">Write Grant</h3>
                        <p className="text-xs text-gray-500">AI-powered assistance</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Pending Requests */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Pending Requests</h2>
                <div className="space-y-3">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">AI Content Moderation Agent</p>
                        <p className="text-sm text-gray-500">Requested from TechCorp Inc.</p>
                      </div>
                      <span className="badge badge-high-demand">Pending</span>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Cloud Computing Credits</p>
                        <p className="text-sm text-gray-500">Requested from CloudServices Ltd.</p>
                      </div>
                      <span className="badge badge-verified">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
