import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Award, Download, Zap } from "lucide-react";

export default function ImpactTracker() {
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
          <Button className="btn-elegant-outline">Sign In</Button>
        </div>
      </header>

      <div className="container-responsive py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Impact Tracker</h2>
            <p className="text-muted-foreground">
              Measure, visualize, and share the real-world outcomes of resource sharing
            </p>
          </div>
          <Button className="btn-elegant-primary gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                People Impacted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">125K+</div>
              <p className="text-xs text-muted-foreground mt-1">+15% this quarter</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4" />
                Resources Shared
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">847</div>
              <p className="text-xs text-muted-foreground mt-1">Across 156 organizations</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Projects Enabled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">342</div>
              <p className="text-xs text-muted-foreground mt-1">+42 this month</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Platform Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2.3M</div>
              <p className="text-xs text-muted-foreground mt-1">Estimated resource value</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donors">Donors</TabsTrigger>
            <TabsTrigger value="nonprofits">Non-Profits</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>
                  Monthly trends in resource sharing and impact
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 opacity-20" />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Top Resource Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "AI Agents", count: 234 },
                    { name: "Computing Resources", count: 189 },
                    { name: "Data & Datasets", count: 156 },
                    { name: "Software Tools", count: 128 },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Sectors Served</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Education", count: 45 },
                    { name: "Healthcare", count: 38 },
                    { name: "Environment", count: 32 },
                    { name: "Social Services", count: 28 },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Top Donors</CardTitle>
                <CardDescription>
                  Organizations contributing the most resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "TechCorp Inc.", resources: 45, impact: "1,200+ people" },
                    { name: "CloudServices Ltd.", resources: 38, impact: "850+ people" },
                    { name: "DataViz Solutions", resources: 32, impact: "650+ people" },
                  ].map((donor) => (
                    <div key={donor.name} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-muted-foreground">{donor.impact}</p>
                      </div>
                      <Badge>{donor.resources} resources</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Non-Profits Tab */}
          <TabsContent value="nonprofits" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Most Active Non-Profits</CardTitle>
                <CardDescription>
                  Organizations receiving and utilizing the most resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Global Education Initiative", resources: 12, impact: "5,000+ students" },
                    { name: "Rural Healthcare Network", resources: 8, impact: "2,300+ patients" },
                    { name: "Environmental Research Collective", resources: 15, impact: "20+ projects" },
                  ].map((org) => (
                    <div key={org.name} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.impact}</p>
                      </div>
                      <Badge>{org.resources} resources</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outcomes Tab */}
          <TabsContent value="outcomes" className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Reported Outcomes</CardTitle>
                <CardDescription>
                  Real-world impact stories from the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <div key={idx} className="pb-4 border-b border-border last:border-0">
                    <p className="font-medium">{outcome.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{outcome.org}</p>
                    <Badge className="mt-2 bg-success/10 text-success border-success/20">
                      {outcome.metric}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
