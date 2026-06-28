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
      <Route path="/grant-assistant" component={GrantAssistant} />
      <Route path="/grants" component={GrantAssistant} />
      <Route path="/notifications" component={NotificationCenter} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
