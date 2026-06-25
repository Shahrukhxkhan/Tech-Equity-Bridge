import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageSquare, TrendingUp, Zap } from "lucide-react";

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
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Coalition Builder</h2>
            <p className="text-muted-foreground">
              Unite multiple non-profits to amplify impact and access larger resource packages
            </p>
          </div>

          <Button className="btn-elegant-primary gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Create Coalition
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Input placeholder="Search coalitions..." />
        </div>

        {/* Coalitions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_COALITIONS.map((coalition) => (
            <Card key={coalition.id} className="card-elegant hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle>{coalition.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {coalition.goal}
                    </CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-bold text-lg">{coalition.members}</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{coalition.resources}</div>
                    <div className="text-xs text-muted-foreground">Resources</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {coalition.impact}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 btn-elegant-primary text-sm py-2">
                    Join
                  </Button>
                  <Button className="btn-elegant-outline text-sm py-2">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="card-elegant bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Why Join a Coalition?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Amplified Impact</h4>
              <p className="text-sm text-muted-foreground">
                Combined resources reach more organizations and create greater social impact
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Shared Expertise</h4>
              <p className="text-sm text-muted-foreground">
                Learn from peer organizations and collaborate on implementation
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Better Negotiation</h4>
              <p className="text-sm text-muted-foreground">
                Access larger resource packages and negotiate better terms together
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
