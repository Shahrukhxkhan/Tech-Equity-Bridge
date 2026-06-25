import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

export default function AdminDashboard() {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container-responsive flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Tech-Equity Bridge</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary">Admin</Badge>
            <Button className="btn-elegant-outline">Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="container-responsive py-8 space-y-8">
        {/* Page Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Platform oversight, user management, and moderation tools
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">342</div>
              <p className="text-xs text-muted-foreground mt-1">+28 this week</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">12</div>
              <p className="text-xs text-muted-foreground mt-1">Resources & users</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Platform Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2.3M</div>
              <p className="text-xs text-muted-foreground mt-1">Estimated resources</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">94%</div>
              <p className="text-xs text-muted-foreground mt-1">Platform stability</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
            <TabsTrigger value="matches">Match Quality</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage platform users and verify accounts</CardDescription>
                  </div>
                  <Input placeholder="Search users..." className="w-48" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/5 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.type} • Joined {user.joined}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            user.status === "verified"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                        >
                          {user.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                        <Button className="btn-elegant-outline text-sm py-1">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Queue Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Resource Moderation Queue</CardTitle>
                <CardDescription>Review and approve resources before they go live</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moderationQueue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/5 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.donor} • Submitted {item.submitted}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "pending"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : item.status === "flagged"
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : "bg-success/10 text-success border-success/20"
                          }
                        >
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "flagged"
                              ? "Flagged"
                              : "Approved"}
                        </Badge>
                        {item.status === "pending" && (
                          <>
                            <Button className="btn-elegant-primary text-sm py-1">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button className="btn-elegant-outline text-sm py-1">
                              <AlertCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {item.status === "flagged" && (
                          <>
                            <Button className="btn-elegant-primary text-sm py-1">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button className="btn-elegant-outline text-sm py-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Match Quality Tab */}
          <TabsContent value="matches" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Match Quality Review</CardTitle>
                <CardDescription>Monitor and improve matching algorithm performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Average Match Score</p>
                    <p className="text-3xl font-bold">8.2/10</p>
                    <p className="text-xs text-muted-foreground mt-1">+0.3 from last week</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Acceptance Rate</p>
                    <p className="text-3xl font-bold">76%</p>
                    <p className="text-xs text-muted-foreground mt-1">Matches accepted by recipients</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Matches</h4>
                  <div className="space-y-2">
                    {[
                      { donor: "TechCorp Inc.", recipient: "Global Education Initiative", score: 9.1 },
                      { donor: "CloudServices Ltd.", recipient: "Rural Healthcare Network", score: 8.7 },
                      { donor: "DataViz Solutions", recipient: "Environmental Research", score: 7.9 },
                    ].map((match, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-secondary/5 rounded">
                        <div>
                          <p className="text-sm font-medium">{match.donor}</p>
                          <p className="text-xs text-muted-foreground">{match.recipient}</p>
                        </div>
                        <Badge variant="secondary">{match.score}/10</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Key performance indicators and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">User Growth</h4>
                    <div className="h-40 bg-secondary/5 rounded flex items-center justify-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 opacity-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Resource Sharing Trends</h4>
                    <div className="h-40 bg-secondary/5 rounded flex items-center justify-center text-muted-foreground">
                      <TrendingUp className="w-12 h-12 opacity-20" />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="p-3 border border-border rounded">
                    <p className="text-xs text-muted-foreground mb-1">Avg. Response Time</p>
                    <p className="text-2xl font-bold">2.4h</p>
                  </div>
                  <div className="p-3 border border-border rounded">
                    <p className="text-xs text-muted-foreground mb-1">Request Success Rate</p>
                    <p className="text-2xl font-bold">82%</p>
                  </div>
                  <div className="p-3 border border-border rounded">
                    <p className="text-xs text-muted-foreground mb-1">Active Coalitions</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
