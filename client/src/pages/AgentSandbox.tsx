import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Play, Sparkles, Zap, Clock, Cpu, Copy, Check, RefreshCw, Sliders, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface AgentPreset {
  id: "multilingual_health" | "grant_screener" | "data_extractor" | "literacy_tutor" | "custom";
  name: string;
  donorName: string;
  donorTier: string;
  category: string;
  description: string;
  defaultPrompt: string;
  defaultLanguage?: string;
}

const AGENT_PRESETS: AgentPreset[] = [
  {
    id: "multilingual_health",
    name: "Multilingual Health Intake & Translation Agent",
    donorName: "Nexus DeepMind Labs",
    donorTier: "founding_partner",
    category: "AI Agents",
    description: "Autonomous agent specialized in clinical intake, symptom entity extraction, and real-time multilingual translation across 42 languages.",
    defaultPrompt: "Patient is an elderly Spanish-speaking grandmother with mild abdominal discomfort for 3 days. She needs help enrolling in the weekend community clinic health fair.",
    defaultLanguage: "Spanish",
  },
  {
    id: "grant_screener",
    name: "CivicAI Grant Screener & RFP Evaluator",
    donorName: "CivicAI Systems",
    donorTier: "impact_ally",
    category: "Tools",
    description: "Evaluates non-profit project readiness against funder guidelines, scoring compliance and recommending strategic section highlights.",
    defaultPrompt: "Evaluate our non-profit's eligibility for the $150,000 Metropolitan Health Foundation grant. We have 501(c)(3) status and serve 15,000+ underserved families annually.",
  },
  {
    id: "data_extractor",
    name: "Census & Demographics ETL Extractor",
    donorName: "DataViz Solutions",
    donorTier: "impact_ally",
    category: "Data",
    description: "Converts unstructured municipal records, transit schedules, and survey text into structured JSON schemas for GIS mapping.",
    defaultPrompt: "Extract transit dependency, limited English proficiency percentages, and poverty levels from our neighborhood community survey transcript for Census Tract 06075017802.",
  },
  {
    id: "literacy_tutor",
    name: "Youth Literacy Tutor Assistant",
    donorName: "Nexus DeepMind Labs",
    donorTier: "founding_partner",
    category: "AI Agents",
    description: "Adaptive reading comprehension engine generating scaffolded quizzes, vocabulary explanations, and reflection prompts for K-8 learners.",
    defaultPrompt: "Create a 4th-grade reading passage about community urban tree canopies with 3 comprehension questions and vocabulary definitions.",
  },
  {
    id: "custom",
    name: "Custom Donor Agent Sandbox",
    donorName: "Open Sandbox",
    donorTier: "equity_champion",
    category: "Custom",
    description: "Execute arbitrary prompts and custom payloads against donor-allocated inference endpoints to evaluate real-time SLA behavior.",
    defaultPrompt: "Analyze the following operational workflow and provide a 3-phase technical implementation roadmap for civic data sharing.",
  },
];

export default function AgentSandbox() {
  const [selectedAgent, setSelectedAgent] = useState<AgentPreset>(AGENT_PRESETS[0]);
  const [inputPrompt, setInputPrompt] = useState(AGENT_PRESETS[0].defaultPrompt);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [copied, setCopied] = useState(false);
  const [lastExecution, setLastExecution] = useState<any>(null);

  const executeMutation = trpc.agentSandbox.executeAgent.useMutation({
    onSuccess: (data) => {
      setLastExecution(data);
      toast.success(`Agent executed in ${data.latencyMs}ms (${data.tokenCount} tokens)`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to execute agent");
    },
  });

  const handleSelectPreset = (preset: AgentPreset) => {
    setSelectedAgent(preset);
    setInputPrompt(preset.defaultPrompt);
    if (preset.defaultLanguage) setSelectedLanguage(preset.defaultLanguage);
    setLastExecution(null);
  };

  const handleRun = () => {
    if (!inputPrompt.trim()) return;
    executeMutation.mutate({
      agentType: selectedAgent.id,
      inputPrompt,
      parameters: {
        temperature,
        language: selectedLanguage,
      },
    });
  };

  const handleCopy = () => {
    if (lastExecution?.output) {
      navigator.clipboard.writeText(lastExecution.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Output copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Interactive Playground
              </span>
              <span className="text-xs text-gray-500">Live AI Agent Sandbox</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">In-Browser AI Agent Testbed</h1>
            <p className="text-xs text-gray-500">
              Test-run donated AI models, translation bots, and ETL extractors with live telemetry before requesting capacity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a href="/marketplace" className="btn btn-secondary btn-sm text-xs py-2 px-3">
              Browse Marketplace
            </a>
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-2 px-3">
              Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Preset Agent Selector Pills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Select Donor AI Agent Preset:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {AGENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedAgent.id === preset.id
                    ? "border-[#1D9E75] bg-emerald-50/40 ring-1 ring-[#1D9E75] shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-xs font-bold text-gray-900 truncate mb-0.5">{preset.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{preset.donorName}</div>
                <div className="mt-2 text-[10px] font-semibold text-[#1D9E75] uppercase">
                  {preset.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Playground Grid: Controls + Input vs Live Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Prompt Editor & Parameters (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-5">
            {/* Agent Info Banner */}
            <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{selectedAgent.name}</h3>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{selectedAgent.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-gray-500">Committed by:</span>
                  <span className="text-[10px] font-bold text-gray-800">{selectedAgent.donorName}</span>
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">Test Input / Prompt Payload</label>
                <span className="text-[10px] text-gray-400">{inputPrompt.length} characters</span>
              </div>
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-lg border border-gray-200 text-xs font-mono bg-gray-50/50 focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75]"
                placeholder="Enter sample text or test instructions for the AI agent..."
              />
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Temperature</span>
                  <span className="font-mono text-gray-500">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#1D9E75] cursor-pointer"
                />
                <span className="text-[10px] text-gray-400">Lower = more deterministic & factual</span>
              </div>

              {selectedAgent.id === "multilingual_health" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Target Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 text-xs bg-white"
                  >
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="Mandarin">Mandarin (中文)</option>
                    <option value="Vietnamese">Vietnamese (Tiếng Việt)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="Tagalog">Tagalog</option>
                  </select>
                </div>
              )}
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero-cost sandbox telemetry probe
              </div>

              <button
                onClick={handleRun}
                disabled={executeMutation.isPending || !inputPrompt.trim()}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {executeMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Executing Agent...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    Execute Test Query
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Telemetry & Live Output Pane (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Live Telemetry Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-xs">
                <div className="text-[10px] text-gray-500 font-medium">p95 Latency</div>
                <div className="text-sm font-bold text-gray-900 mt-0.5">
                  {lastExecution?.latencyMs ? `${lastExecution.latencyMs} ms` : "—"}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-xs">
                <div className="text-[10px] text-gray-500 font-medium">Tokens Processed</div>
                <div className="text-sm font-bold text-purple-700 mt-0.5">
                  {lastExecution?.tokenCount ? lastExecution.tokenCount : "—"}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-xs">
                <div className="text-[10px] text-gray-500 font-medium">Cost to Org</div>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">$0.00 (Donated)</div>
              </div>
            </div>

            {/* Output Box */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1D9E75]" />
                    Model Output & Diagnostics
                  </span>
                  {lastExecution?.output && (
                    <button
                      onClick={handleCopy}
                      className="p-1 text-gray-500 hover:text-gray-900 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>

                {lastExecution?.output ? (
                  <div className="text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3.5 rounded-lg border border-gray-100 max-h-[320px] overflow-y-auto">
                    {lastExecution.output}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400 text-xs">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Click "Execute Test Query" to run this agent live.
                  </div>
                )}
              </div>

              {/* Action Banner */}
              {lastExecution?.output && (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Satisfied with response quality?</span>
                  <a
                    href={`/marketplace`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-[#1D9E75] hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold cursor-pointer"
                  >
                    Request Full Capacity <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
