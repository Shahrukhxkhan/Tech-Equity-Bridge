import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, Building2, Users, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0E1512]">
      {/* Navigation */}
      <nav className="border-b border-[#1E2B25] bg-[#0E1512]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container-page flex-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-medium text-lg !text-white">Tech-Equity Bridge</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm !text-gray-300">Welcome, {user?.name}</span>
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

      {/* Hero Section with Integrated Stats Bar (DARK) */}
      <section className="bg-[#0E1512] !text-white py-20 md:py-28 border-b border-[#1E2B25]">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-medium !text-white mb-6 tracking-tight">
              Bridge the digital divide
            </h1>
            <p className="text-lg !text-gray-300 mb-8 leading-relaxed">
              Connect tech companies with non-profits. Share AI agents, computing resources, and digital tools to amplify social impact at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/onboarding?role=donor" className="btn btn-primary">
                I'm a Tech Donor <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a href="/onboarding?role=nonprofit" className="btn border border-primary text-primary hover:bg-primary-light/10">
                I'm a Non-Profit <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          {/* Integrated Primary Stats Bar */}
          <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-[#1E2B25] grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-semibold !text-[#1D9E75] mb-1">500+</div>
              <div className="text-sm font-medium !text-gray-300">Tech Donors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold !text-[#1D9E75] mb-1">1,200+</div>
              <div className="text-sm font-medium !text-gray-300">Non-Profits Helped</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold !text-[#E5A035] mb-1">50K+</div>
              <div className="text-sm font-medium !text-gray-300">People Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (LIGHT) */}
      <section className="bg-[#F8F9F8] py-20 border-b border-gray-200">
        <div className="container-section">
          <h2 className="text-3xl font-medium !text-gray-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-center w-10 h-10 rounded-md bg-primary-light">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-lg !text-gray-900">Smart matching</h3>
              </div>
              <p className="text-sm !text-gray-700 leading-relaxed">
                AI-powered algorithm connects donors with non-profits based on needs and capacity.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-center w-10 h-10 rounded-md bg-secondary-light">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-medium text-lg !text-gray-900">Instant access</h3>
              </div>
              <p className="text-sm !text-gray-700 leading-relaxed">
                Deploy AI agents and tools immediately after approval. No setup delays.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-center w-10 h-10 rounded-md bg-accent-light">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-medium text-lg !text-gray-900">Impact tracking</h3>
              </div>
              <p className="text-sm !text-gray-700 leading-relaxed">
                Measure and visualize real-world outcomes. Transparent reporting for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Tech Donors (DARK) */}
      <section className="bg-[#121B17] !text-white py-20 border-b border-[#1E2B25]">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-[#8C85FF]" />
                <span className="text-xs font-semibold uppercase tracking-wider !text-[#8C85FF]">For tech donors</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-medium !text-white mb-4">
                Build your CSR narrative
              </h3>
              <p className="!text-gray-300 mb-6 leading-relaxed">
                List your AI agents, computing resources, and tools. Track impact, reach, and outcomes. Build authentic CSR stories with real data.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#1D9E75] flex-shrink-0 mt-0.5" />
                  <span className="text-sm !text-gray-300">Verified non-profit recipients</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-[#1D9E75] flex-shrink-0 mt-0.5" />
                  <span className="text-sm !text-gray-300">Comprehensive impact metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#1D9E75] flex-shrink-0 mt-0.5" />
                  <span className="text-sm !text-gray-300">Direct communication with recipients</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#19241F] rounded-xl p-8 border border-[#26372F] shadow-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#26372F]">
                  <span className="text-sm !text-gray-300">Resources shared</span>
                  <span className="text-2xl font-semibold !text-[#8C85FF]">847</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#26372F]">
                  <span className="text-sm !text-gray-300">Organizations helped</span>
                  <span className="text-2xl font-semibold !text-[#1D9E75]">1,200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm !text-gray-300">Platform value</span>
                  <span className="text-2xl font-semibold !text-[#E5A035]">$2.3M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Non-Profits (LIGHT) */}
      <section className="bg-[#F1F5F2] py-20 border-b border-gray-200">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm order-2 md:order-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm !text-gray-700">Resources received</span>
                  <span className="text-2xl font-semibold text-primary">342</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm !text-gray-700">Projects enabled</span>
                  <span className="text-2xl font-semibold text-primary">125+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm !text-gray-700">People impacted</span>
                  <span className="text-2xl font-semibold text-accent">50K+</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">For non-profits</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-medium !text-gray-900 mb-4">
                Access technology at scale
              </h3>
              <p className="!text-gray-700 mb-6 leading-relaxed">
                Discover AI agents, tools, and computing resources. Join coalitions for larger requests. Get AI-powered grant writing assistance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm !text-gray-700">Smart matching to your needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm !text-gray-700">Coalition building for joint requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm !text-gray-700">Track and report outcomes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Platform Features (LIGHT) */}
      <section className="bg-[#F8F9F8] py-20 border-b border-gray-200">
        <div className="container-section">
          <h2 className="text-3xl font-medium !text-gray-900 text-center mb-12">
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
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
                <h4 className="font-medium text-lg !text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm !text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (DARK) */}
      <section className="bg-[#0E1512] !text-white py-20 border-b border-[#1E2B25]">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-medium !text-white mb-6">
            Ready to make an impact?
          </h2>
          <p className="!text-gray-300 mb-8 leading-relaxed">
            Join hundreds of tech companies and non-profits already using Tech-Equity Bridge to create meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/onboarding?role=donor" className="btn btn-primary">
              Get Started as a Donor
            </a>
            <a href="/onboarding?role=nonprofit" className="btn border border-primary text-primary hover:bg-primary-light/10">
              Get Started as a Non-Profit
            </a>
          </div>
        </div>
      </section>

      {/* Footer (DARK) */}
      <footer className="bg-[#09100D] border-t border-[#1E2B25] py-12 !text-gray-300">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-medium !text-white">Tech-Equity Bridge</span>
              </div>
              <p className="text-sm !text-gray-400">
                Connecting tech donors with non-profits for social impact.
              </p>
            </div>
            <div>
              <h4 className="font-medium !text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/marketplace" className="!text-gray-300 hover:text-primary transition-colors">Marketplace</a></li>
                <li><a href="/coalition" className="!text-gray-300 hover:text-primary transition-colors">Coalition Builder</a></li>
                <li><a href="/impact" className="!text-gray-300 hover:text-primary transition-colors">Impact Tracker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium !text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="!text-gray-300 hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="!text-gray-300 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="!text-gray-300 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium !text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="!text-gray-300 hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="!text-gray-300 hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1E2B25] pt-8 text-center text-sm !text-gray-400">
            <p>&copy; 2026 Tech-Equity Bridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
