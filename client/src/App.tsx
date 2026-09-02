import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import CoalitionBuilder from "@/pages/CoalitionBuilder";
import ImpactTracker from "@/pages/ImpactTracker";
import GrantAssistant from "@/pages/GrantAssistant";
import NotificationCenter from "@/pages/NotificationCenter";
import AdminDashboard from "@/pages/AdminDashboard";
import ImpactWall from "@/pages/ImpactWall";
import PledgeMonitor from "@/pages/PledgeMonitor";
import AgentSandbox from "@/pages/AgentSandbox";
import A2ANegotiator from "@/pages/A2ANegotiator";
import IamManagement from "@/pages/IamManagement";
import EdgeMesh from "@/pages/EdgeMesh";
import Web3EsgVault from "@/pages/Web3EsgVault";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/coalition" component={CoalitionBuilder} />
      <Route path="/impact" component={ImpactTracker} />
      <Route path="/impact-map" component={ImpactTracker} />
      <Route path="/impact-analytics" component={ImpactTracker} />
      <Route path="/impact-wall" component={ImpactWall} />
      <Route path="/directory" component={ImpactWall} />
      <Route path="/impact-wall/:slug" component={ImpactWall} />
      <Route path="/donors" component={ImpactWall} />
      <Route path="/sandbox" component={AgentSandbox} />
      <Route path="/agent-sandbox" component={AgentSandbox} />
      <Route path="/a2a" component={A2ANegotiator} />
      <Route path="/a2a-negotiator" component={A2ANegotiator} />
      <Route path="/grant-assistant" component={GrantAssistant} />
      <Route path="/grants" component={GrantAssistant} />
      <Route path="/notifications" component={NotificationCenter} />
      <Route path="/iam" component={IamManagement} />
      <Route path="/iam-admin" component={IamManagement} />
      <Route path="/sso" component={IamManagement} />
      <Route path="/edge" component={EdgeMesh} />
      <Route path="/edge-mesh" component={EdgeMesh} />
      <Route path="/offline-clinic" component={EdgeMesh} />
      <Route path="/web3-esg" component={Web3EsgVault} />
      <Route path="/zk-proofs" component={Web3EsgVault} />
      <Route path="/did-credentials" component={Web3EsgVault} />
      <Route path="/carbon-offsets" component={Web3EsgVault} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/pledges" component={PledgeMonitor} />
      <Route path="/admin/pledge-monitor" component={PledgeMonitor} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
