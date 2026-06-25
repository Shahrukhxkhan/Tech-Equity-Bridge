import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  FileText,
  Heart,
  MessageSquare,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return <div>Loading...</div>;
  }

  const isDonor = user.role === "donor";

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

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <button
              onClick={() => logout()}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container-responsive py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">
            {isDonor ? "Donor Dashboard" : "Non-Profit Dashboard"}
          </h2>
          <p className="text-muted-foreground">
            {isDonor
              ? "Manage your resources, track impact, and connect with non-profits"
              : "Discover resources, submit requests, and track outcomes"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {isDonor ? (
            <>
              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resources Listed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Organizations Helped
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground mt-1">+4 this quarter</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Impact Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7/10</div>
                  <p className="text-xs text-muted-foreground mt-1">Excellent</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resources Received
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground mt-1">Active resources</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Under review</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Projects Enabled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">+3 this month</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    People Impacted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4K</div>
                  <p className="text-xs text-muted-foreground mt-1">+500 this quarter</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">
              {isDonor ? "My Resources" : "Browse"}
            </TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 pb-4 border-b border-border">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Resource request approved</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-4 border-b border-border">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">New match found</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Impact milestone reached</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isDonor ? (
                    <>
                      <Button className="w-full btn-elegant-primary justify-start gap-2">
                        <Plus className="w-4 h-4" />
                        List New Resource
                      </Button>
                      <Button className="w-full btn-elegant-outline justify-start gap-2">
                        <MessageSquare className="w-4 h-4" />
                        View Messages
                      </Button>
                      <Button className="w-full btn-elegant-outline justify-start gap-2">
                        <BarChart3 className="w-4 h-4" />
                        View Impact
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full btn-elegant-primary justify-start gap-2">
                        <Search className="w-4 h-4" />
                        Browse Resources
                      </Button>
                      <Button className="w-full btn-elegant-outline justify-start gap-2">
                        <FileText className="w-4 h-4" />
                        Grant Assistant
                      </Button>
                      <Button className="w-full btn-elegant-outline justify-start gap-2">
                        <Users className="w-4 h-4" />
                        Coalition Builder
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>
                  {isDonor ? "Your Resources" : "Available Resources"}
                </CardTitle>
                <CardDescription>
                  {isDonor
                    ? "Manage and track your listed resources"
                    : "Browse and request resources from donors"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No resources yet. {isDonor ? "List your first resource" : "Browse available resources"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>
                  {isDonor ? "Resource Requests" : "My Requests"}
                </CardTitle>
                <CardDescription>
                  {isDonor
                    ? "Requests from non-profits for your resources"
                    : "Track your resource requests and their status"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No requests yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communicate with donors and non-profits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
