import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, Building2, Users, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="border-b border-gray-300 bg-card sticky top-0 z-50">
        <div className="container-page flex-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-medium text-lg text-gray-900">Tech-Equity Bridge</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                <a href="/dashboard" className="btn btn-primary btn-sm">
                  Dashboard
                </a>
              </>
            ) : (
              <a href={getLoginUrl()} className="btn btn-primary btn-sm">
                Sign In
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-page py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">
            Bridge the digital divide
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Connect tech companies with non-profits. Share AI agents, computing resources, and digital tools to amplify social impact at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/onboarding?role=donor" className="btn btn-primary">
              I'm a Tech Donor <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a href="/onboarding?role=nonprofit" className="btn btn-secondary">
              I'm a Non-Profit <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="bg-sunken py-12 border-y border-gray-300">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="metric-value metric-value-primary mb-2">500+</div>
              <div className="metric-label">Tech Donors</div>
            </div>
            <div className="text-center">
              <div className="metric-value metric-value-primary mb-2">1,200+</div>
              <div className="metric-label">Non-Profits Helped</div>
            </div>
            <div className="text-center">
              <div className="metric-value metric-value-accent mb-2">50K+</div>
              <div className="metric-label">People Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container-section">
        <h2 className="text-3xl font-medium text-gray-900 text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-center w-10 h-10 rounded-md bg-primary-light">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="card-title">Smart matching</h3>
            </div>
            <p className="text-sm text-gray-700">
              AI-powered algorithm connects donors with non-profits based on needs and capacity.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-center w-10 h-10 rounded-md bg-secondary-light">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="card-title">Instant access</h3>
            </div>
            <p className="text-sm text-gray-700">
              Deploy AI agents and tools immediately after approval. No setup delays.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-center w-10 h-10 rounded-md bg-accent-light">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <h3 className="card-title">Impact tracking</h3>
            </div>
            <p className="text-sm text-gray-700">
              Measure and visualize real-world outcomes. Transparent reporting for all stakeholders.
            </p>
          </div>
        </div>
      </section>

      {/* Features for Donors */}
      <section className="bg-sunken py-16 border-y border-gray-300">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-secondary" />
                <span className="label-micro">For tech donors</span>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                Build your CSR narrative
              </h3>
              <p className="text-gray-700 mb-6">
                List your AI agents, computing resources, and tools. Track impact, reach, and outcomes. Build authentic CSR stories with real data.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Verified non-profit recipients</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Comprehensive impact metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Direct communication with recipients</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 border border-gray-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                  <span className="text-sm text-gray-700">Resources shared</span>
                  <span className="metric-value metric-value-secondary">847</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                  <span className="text-sm text-gray-700">Organizations helped</span>
                  <span className="metric-value metric-value-primary">1,200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Platform value</span>
                  <span className="metric-value metric-value-accent">$2.3M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Non-Profits */}
      <section className="container-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-card rounded-lg p-8 border border-gray-300 order-2 md:order-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                <span className="text-sm text-gray-700">Resources received</span>
                <span className="metric-value metric-value-primary">342</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                <span className="text-sm text-gray-700">Projects enabled</span>
                <span className="metric-value metric-value-primary">125+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">People impacted</span>
                <span className="metric-value metric-value-accent">50K+</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="label-micro">For non-profits</span>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Access technology at scale
            </h3>
            <p className="text-gray-700 mb-6">
              Discover AI agents, tools, and computing resources. Join coalitions for larger requests. Get AI-powered grant writing assistance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Smart matching to your needs</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Coalition building for joint requests</span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Track and report outcomes</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-sunken py-16 border-y border-gray-300">
        <div className="container-section">
          <h2 className="text-3xl font-medium text-gray-900 text-center mb-12">
            Comprehensive platform features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Resource Marketplace", desc: "Browse, search, and request AI agents, tools, datasets, and computing resources" },
              { title: "Smart Matching", desc: "AI-powered algorithm suggests resources based on needs, sector, and capacity" },
              { title: "Coalition Builder", desc: "Unite multiple non-profits to amplify impact and access larger resource packages" },
              { title: "Impact Tracking", desc: "Measure outcomes with comprehensive metrics for donors and non-profits" },
              { title: "Request Workflow", desc: "Full lifecycle from submission through approval to deployment and outcome reporting" },
              { title: "Grant Writing Assistant", desc: "AI-powered assistance for drafting grant applications and resource requests" },
            ].map((feature, idx) => (
              <div key={idx} className="card">
                <h4 className="card-title mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-section">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-medium text-gray-900 mb-6">
            Ready to make an impact?
          </h2>
          <p className="text-gray-700 mb-8">
            Join hundreds of tech companies and non-profits already using Tech-Equity Bridge to create meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/onboarding?role=donor" className="btn btn-primary">
              Get Started as a Donor
            </a>
            <a href="/onboarding?role=nonprofit" className="btn btn-secondary">
              Get Started as a Non-Profit
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-gray-300 py-12">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-900">Tech-Equity Bridge</span>
              </div>
              <p className="text-sm text-gray-700">
                Connecting tech donors with non-profits for social impact.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/marketplace" className="text-gray-700 hover:text-primary">Marketplace</a></li>
                <li><a href="/coalition" className="text-gray-700 hover:text-primary">Coalition Builder</a></li>
                <li><a href="/impact" className="text-gray-700 hover:text-primary">Impact Tracker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-primary">About</a></li>
                <li><a href="#" className="text-gray-700 hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-gray-700 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-primary">Privacy</a></li>
                <li><a href="#" className="text-gray-700 hover:text-primary">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 Tech-Equity Bridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
