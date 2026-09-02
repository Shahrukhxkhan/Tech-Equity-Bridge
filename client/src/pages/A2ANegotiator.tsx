import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Bot, Play, Sparkles, ShieldCheck, CheckCircle2, Copy, Check, Clock, Cpu, ArrowRight, RefreshCw, Zap, Moon, Sun, Key } from "lucide-react";
import { toast } from "sonner";

export default function A2ANegotiator() {
  const [nonprofitName, setNonprofitName] = useState("Community Health Net");
  const [mission, setMission] = useState("Deploying autonomous multilingual triage agents for underserved health clinics.");
  const [sector, setSector] = useState("Healthcare & Immigration");
  const [requestedHours, setRequestedHours] = useState(1500);
  const [flexOffPeak, setFlexOffPeak] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [currentSession, setCurrentSession] = useState<any | null>(null);

  const { data: scheduleData, refetch: refetchSchedule, isLoading: isScheduleLoading } =
    trpc.a2a.getSmartSchedule.useQuery();

  const startNegotiationMutation = trpc.a2a.startNegotiation.useMutation({
    onSuccess: (data) => {
      setCurrentSession(data);
      refetchSchedule();
      toast.success("Autonomous consensus reached & API key provisioned!");
    },
    onError: (err) => {
      toast.error(err.message || "Negotiation failed");
    },
  });

  const rebalanceMutation = trpc.a2a.triggerSmartRebalance.useMutation({
    onSuccess: (data) => {
      refetchSchedule();
      toast.success(data.status);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to trigger smart rebalancing");
    },
  });

  const handleStartNegotiation = () => {
    startNegotiationMutation.mutate({
      nonprofitProfile: {
        name: nonprofitName,
        mission,
        sector,
        requestedHours,
      },
      resourceOffer: {
        id: 1,
        title: "NVIDIA A100 GPU Cluster Allocation",
        donor: "Nexus DeepMind Labs",
        donorTier: "founding_partner",
        maxCapacity: 5000,
      },
      preferences: {
        flexOffPeak,
        targetBeneficiaries: 15400,
      },
    });
  };

  const handleCopyKey = () => {
    if (currentSession?.provisionedCredentials?.apiKey) {
      navigator.clipboard.writeText(currentSession.provisionedCredentials.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
      toast.success("API Key copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-purple-600" /> A2A Negotiation Engine
              </span>
              <span className="text-xs text-gray-500">Autonomous Agent-to-Agent Capacity Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Autonomous AI Capacity Negotiator
            </h1>
            <p className="text-xs text-gray-500">
              Non-Profit Grant Navigator AI autonomously negotiates with Corporate Donor CSR Allocator AI to agree on off-peak compute windows and provision API keys.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a href="/marketplace" className="btn btn-secondary btn-sm text-xs py-2 px-3">
              Marketplace
            </a>
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-2 px-3">
              Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Main Terminal & Visualizer Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Parameters & Triggers (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#1D9E75]" /> Non-Profit Bot Config
                </span>
                <span className="text-[10px] text-gray-400">Agent Persona</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={nonprofitName}
                    onChange={(e) => setNonprofitName(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mission Directive</label>
                  <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Sector</label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Target Hours</label>
                    <input
                      type="number"
                      value={requestedHours}
                      onChange={(e) => setRequestedHours(parseInt(e.target.value))}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={flexOffPeak}
                      onChange={(e) => setFlexOffPeak(e.target.checked)}
                      className="accent-[#1D9E75]"
                    />
                    <span className="font-medium text-[11px]">
                      Enable Off-Peak Night Flexibility (20% bonus burst compute)
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleStartNegotiation}
                disabled={startNegotiationMutation.isPending}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {startNegotiationMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Bots Negotiating in Real Time...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    Launch Autonomous A2A Negotiation
                  </>
                )}
              </button>
            </div>

            {/* Target Donor Bot Info */}
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-2">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" /> Counterpart: Nexus DeepMind CSR Bot
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                Autonomous corporate agent configured with $250k ESG allocation mandate, automated safety filters, and night-shift scheduling rules.
              </p>
            </div>
          </div>

          {/* Right Column: Live A2A Multi-Turn Dialogue Terminal (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between min-h-[500px] text-white">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="font-mono text-slate-400 ml-2">a2a-protocol-v2.sock</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Multi-Turn Agent Consensus Engine
              </span>
            </div>

            {/* Transcript Area */}
            <div className="flex-1 py-4 space-y-3.5 overflow-y-auto max-h-[380px] font-mono text-xs">
              {currentSession ? (
                currentSession.dialogTurns.map((turn: any) => {
                  const isNonprofit = turn.role === "nonprofit_agent";
                  const isDonor = turn.role === "donor_agent";
                  const isSystem = turn.role === "system";

                  return (
                    <div
                      key={turn.turnNumber}
                      className={`p-3.5 rounded-xl border space-y-1.5 ${
                        isNonprofit
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                          : isDonor
                          ? "bg-purple-950/40 border-purple-800/60 text-purple-200"
                          : "bg-slate-800/60 border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold flex items-center gap-1.5">
                          {isNonprofit && <Bot className="w-3.5 h-3.5 text-[#1D9E75]" />}
                          {isDonor && <Bot className="w-3.5 h-3.5 text-purple-400" />}
                          {isSystem && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                          {turn.speakerLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Turn {turn.turnNumber} • {turn.action}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap text-[11px] opacity-90">
                        {turn.content}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-500 text-xs">
                  <Bot className="w-10 h-10 mx-auto mb-2 text-slate-600 animate-pulse" />
                  Click "Launch Autonomous A2A Negotiation" to initiate real-time dialogue.
                </div>
              )}
            </div>

            {/* Terminal Provisioned API Keys Reveal Bar */}
            {currentSession?.provisionedCredentials && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    Provisioned Bearer Token & Cluster Endpoint:
                  </span>
                  <button
                    onClick={handleCopyKey}
                    className="text-[11px] text-slate-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey ? "Copied" : "Copy Token"}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
                  <div className="bg-slate-900 p-2 rounded truncate">
                    <span className="text-slate-500">API Key:</span> {currentSession.provisionedCredentials.apiKey}
                  </div>
                  <div className="bg-slate-900 p-2 rounded truncate">
                    <span className="text-slate-500">Endpoint:</span> {currentSession.provisionedCredentials.endpointUrl}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic 24-Hour Smart GPU Scheduling Heatmap */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#1D9E75]" /> Dynamic Smart Scheduler
                </span>
                <span className="text-xs text-gray-500">24-Hour Load Balancer</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Coalition Nighttime GPU Rebalancer
              </h3>
              <p className="text-xs text-gray-500">
                Automatically identifies idle nighttime hours (22:00 - 06:00 UTC) and reallocates compute capacity to active non-profit translation & GIS batches.
              </p>
            </div>

            <button
              onClick={() => rebalanceMutation.mutate()}
              disabled={rebalanceMutation.isPending}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
            >
              {rebalanceMutation.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              )}
              Trigger Smart Rebalance
            </button>
          </div>

          {/* 24-Hour Schedule Heatmap Bars */}
          <div className="space-y-2">
            <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-24 gap-1.5 text-center">
              {scheduleData?.map((slot: any) => {
                const loadPct = Math.round((slot.allocatedGpuHours / slot.totalAvailableGpuHours) * 100);

                return (
                  <div
                    key={slot.hour}
                    className={`p-2 rounded-lg border text-xs flex flex-col justify-between transition-all ${
                      slot.isOffPeak
                        ? "bg-purple-50/60 border-purple-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    title={`${slot.timeLabel} - ${slot.allocatedGpuHours}/${slot.totalAvailableGpuHours} GPU Hours (${loadPct}% load)`}
                  >
                    <div className="flex items-center justify-center gap-0.5 text-[10px] text-gray-500 font-mono">
                      {slot.isOffPeak ? <Moon className="w-2.5 h-2.5 text-purple-600" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
                      <span>{slot.timeLabel.split(":")[0]}h</span>
                    </div>

                    <div className="my-2 h-12 w-full bg-gray-200 rounded-md overflow-hidden flex flex-col-reverse">
                      <div
                        className={`w-full transition-all ${
                          slot.isOffPeak ? "bg-purple-600" : "bg-[#1D9E75]"
                        }`}
                        style={{ height: `${loadPct}%` }}
                      />
                    </div>

                    <div className="text-[9px] font-bold text-gray-800">{loadPct}%</div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-600" /> Off-Peak Night Hours (22:00 - 06:00 UTC)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1D9E75]" /> Standard Daytime Interactive Hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
