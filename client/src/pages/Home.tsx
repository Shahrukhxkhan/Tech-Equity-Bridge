import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Zap, Users, Globe, Heart, Rocket } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-responsive flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Tech-Equity Bridge</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
                <Link href="/dashboard">
                  <Button variant="default">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="outline">Sign In</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container-responsive relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Bridge the <span className="gradient-text">Digital Divide</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect tech donors with non-profit organizations. Share AI agents, computing resources, and digital tools to amplify social impact at scale.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {!isAuthenticated ? (
                <>
                  <a href={`${getLoginUrl()}?role=donor`}>
                    <Button size="lg" className="btn-elegant-primary gap-2">
                      I'm a Tech Donor <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                  <a href={`${getLoginUrl()}?role=nonprofit`}>
                    <Button size="lg" variant="outline" className="gap-2">
                      I'm a Non-Profit <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="btn-elegant-primary gap-2">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Tech Donors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">1,200+</div>
                <div className="text-sm text-muted-foreground">Non-Profits Helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">50K+</div>
                <div className="text-sm text-muted-foreground">People Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container-responsive space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2>How It Works</h2>
            <p className="text-muted-foreground">
              A seamless platform designed for collaboration and impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="card-elegant hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  AI-powered algorithm connects donors with non-profits based on needs and capacity
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="card-elegant hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Instant Access</CardTitle>
                <CardDescription>
                  Deploy AI agents and tools immediately after approval. No setup delays.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="card-elegant hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Impact Tracking</CardTitle>
                <CardDescription>
                  Measure and visualize real-world outcomes. Transparent reporting for all stakeholders.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20">
        <div className="container-responsive space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2>Comprehensive Platform Features</h2>
            <p className="text-muted-foreground">
              Everything you need to share resources and create impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Donors */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>For Tech Donors</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    List your AI agents, tools, and resources. Track impact and reach. Build your CSR narrative.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Coalition Builder</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Multiple non-profits can pool requests for larger resource packages and shared infrastructure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Donor Dashboard</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor requests, approve/decline with messaging, and view real-time impact metrics.
                  </p>
                </div>
              </div>
            </div>

            {/* For Non-Profits */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3>Resource Marketplace</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Browse and search AI agents, tools, datasets, and computing resources tailored to your needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3>Grant Writing Assistant</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-powered tool to draft grant proposals and resource requests with context awareness.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3>Impact Dashboard</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Report outcomes, track projects enabled, and visualize your organization's growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-t border-b border-border">
        <div className="container-responsive text-center space-y-8">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2>Ready to Make an Impact?</h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of organizations bridging the digital divide
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <a href={`${getLoginUrl()}?role=donor`}>
                  <Button size="lg" className="btn-elegant-primary">
                    Start Donating Resources
                  </Button>
                </a>
                <a href={`${getLoginUrl()}?role=nonprofit`}>
                  <Button size="lg" variant="outline">
                    Request Resources
                  </Button>
                </a>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="btn-elegant-primary">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container-responsive">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Tech-Equity Bridge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Democratizing access to advanced technology for social good.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/marketplace" className="hover:text-foreground transition">Marketplace</Link></li>
                <li><Link href="/coalition" className="hover:text-foreground transition">Coalition Builder</Link></li>
                <li><Link href="/impact" className="hover:text-foreground transition">Impact Tracker</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Tech-Equity Bridge. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
