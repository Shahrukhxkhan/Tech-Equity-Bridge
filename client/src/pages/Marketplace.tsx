import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, Share2, Zap, Database, Brain, Cpu } from "lucide-react";

const SAMPLE_RESOURCES = [
  {
    id: 1,
    title: "AI Content Moderation Agent",
    donor: "TechCorp Inc.",
    category: "AI Agent",
    description: "Production-ready AI agent for content moderation with 99.2% accuracy",
    availability: "Available",
    impact: "Helping 5+ organizations",
    icon: Brain,
  },
  {
    id: 2,
    title: "Cloud Computing Credits",
    donor: "CloudServices Ltd.",
    category: "Compute",
    description: "$50K in annual cloud computing resources for non-profits",
    availability: "Limited",
    impact: "Supporting 12 projects",
    icon: Cpu,
  },
  {
    id: 3,
    title: "Data Analytics Platform",
    donor: "DataViz Solutions",
    category: "Tool",
    description: "Enterprise data analytics platform with custom dashboards",
    availability: "Available",
    impact: "Enabling 8 organizations",
    icon: Database,
  },
];

export default function Marketplace() {
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
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Resource Marketplace</h2>
          <p className="text-muted-foreground">
            Discover AI agents, tools, datasets, and computing resources from leading tech companies
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-10"
            />
          </div>
          <Button className="btn-elegant-outline gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="compute">Compute</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAMPLE_RESOURCES.map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <Card key={resource.id} className="card-elegant hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {resource.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription className="text-sm">{resource.donor}</CardDescription>
                        </div>
                        <button className="text-muted-foreground hover:text-primary transition">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-foreground">{resource.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{resource.impact}</span>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {resource.availability}
                        </Badge>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 btn-elegant-primary text-sm py-2">
                          Request
                        </Button>
                        <Button className="btn-elegant-outline text-sm py-2">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>AI Agents coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tools coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="compute" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Compute resources coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Datasets coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
