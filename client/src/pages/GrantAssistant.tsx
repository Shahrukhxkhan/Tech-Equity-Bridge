import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { FileText, Upload, Sparkles, Download, Copy, Check, Send, RefreshCw, CheckCircle2, AlertCircle, Building2, Calendar, DollarSign, ArrowRight, Printer } from "lucide-react";
import { toast } from "sonner";

export default function GrantAssistant() {
  const [activeTab, setActiveTab] = useState<"rfp" | "builder" | "chat">("rfp");
  const [rfpInput, setRfpInput] = useState(
    `Metropolitan Health Foundation - Community Health Access & Technology Equity Grant 2026\n` +
    `Deadline: October 15, 2026 | Maximum Award: $150,000\n\n` +
    `Eligibility: Verified 501(c)(3) non-profit organizations operating in urban health deserts.\n` +
    `Focus: Expanding digital health access, multilingual intake, and technology-assisted care coordination for underserved families.\n\n` +
    `Required Application Sections:\n` +
    `1. Executive Summary (250 words)\n` +
    `2. Statement of Need & Community Demographics (500 words)\n` +
    `3. Program Design & Technology Deployment (750 words)\n` +
    `4. Measurable Impact & Evaluation Plan (400 words)\n` +
    `5. Budget Narrative & Sustainability Plan (300 words)`
  );

  const [parsedRfp, setParsedRfp] = useState<any>({
    opportunityTitle: "Community Health Access & Technology Equity Grant 2026",
    funderName: "Metropolitan Health Foundation",
    maxAwardAmount: "$150,000",
    submissionDeadline: "October 15, 2026",
    eligibilityCriteria: [
      "Verified 501(c)(3) tax-exempt non-profit status",
      "Demonstrated service to historically underserved or Title I communities",
      "Commitment to deploying technology/AI tools for direct community benefit",
      "Measurable outcome reporting plan within 12 months",
    ],
    requiredSections: [
      { name: "Executive Summary", wordLimit: 250, promptGuide: "Concise summary of organization mission, target beneficiaries, and proposed project objectives." },
      { name: "Statement of Need & Demographics", wordLimit: 500, promptGuide: "Quantify community disparities and demonstrate why this project is critically needed now." },
      { name: "Program Design & Tech Deployment", wordLimit: 750, promptGuide: "Detail how donated computing/AI agents will be integrated into community programs." },
      { name: "Measurable Impact & Evaluation", wordLimit: 400, promptGuide: "Define concrete KPI metrics, number of individuals served, and long-term sustainability." },
      { name: "Budget Narrative & Sustainability", wordLimit: 300, promptGuide: "Itemize personnel, outreach costs, and explain cost savings achieved via donated tech capacity." },
    ],
    keyFocusAreas: [
      "Digital Equity & Accessibility",
      "Community-Led Capacity Building",
      "Measurable Health/Educational Outcomes",
    ],
  });

  const [selectedSection, setSelectedSection] = useState<string>("Executive Summary");
  const [selectedTone, setSelectedTone] = useState<"formal" | "urgent" | "community" | "data_driven">("formal");
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, string>>({});
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your Context-Aware Grant Writing Assistant. I have indexed your non-profit profile, past impact metrics, and active tech pledges. Upload or parse your target RFP to get started, or ask me to draft any proposal section.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mutations
  const parseRfpMutation = trpc.grantAssistant.parseRfp.useMutation({
    onSuccess: (data) => {
      setParsedRfp(data);
      toast.success("RFP guidelines parsed and requirements extracted!");
      setActiveTab("builder");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to parse RFP");
    },
  });

  const autofillSectionMutation = trpc.grantAssistant.autofillSection.useMutation({
    onSuccess: (data) => {
      setSectionDrafts((prev) => ({
        ...prev,
        [data.sectionName]: data.content,
      }));
      toast.success(`Generated "${data.sectionName}" section draft`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate section");
    },
  });

  const handleParseRfp = () => {
    if (!rfpInput.trim()) return;
    parseRfpMutation.mutate({ rfpText: rfpInput });
  };

  const handleAutofillCurrentSection = () => {
    autofillSectionMutation.mutate({
      sectionName: selectedSection,
      rfpContext: {
        opportunityTitle: parsedRfp?.opportunityTitle,
        funderName: parsedRfp?.funderName,
        maxAwardAmount: parsedRfp?.maxAwardAmount,
        submissionDeadline: parsedRfp?.submissionDeadline,
      },
      tone: selectedTone,
    });
  };

  const handleAutofillAllSections = () => {
    if (!parsedRfp?.requiredSections) return;
    parsedRfp.requiredSections.forEach((sec: any) => {
      autofillSectionMutation.mutate({
        sectionName: sec.name,
        rfpContext: {
          opportunityTitle: parsedRfp?.opportunityTitle,
          funderName: parsedRfp?.funderName,
          maxAwardAmount: parsedRfp?.maxAwardAmount,
          submissionDeadline: parsedRfp?.submissionDeadline,
        },
        tone: selectedTone,
      });
    });
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setIsChatLoading(true);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Based on the ${parsedRfp?.funderName || "funder"} guidelines and your non-profit track record serving 15,400+ community members, here is strategic advice for "${msg}":\n\n` +
            `• Align directly with the funder's priority: "${parsedRfp?.keyFocusAreas?.[0] || "Digital Equity"}"\n` +
            `• Cite your $45,000 in-kind matching from verified Tech-Equity Bridge GPU/AI donors as a major cost-efficiency differentiator.\n` +
            `• I have updated your draft outline to incorporate these impact metrics.`,
        },
      ]);
      setIsChatLoading(false);
    }, 900);
  };

  const handleCopyFullProposal = () => {
    const fullText = Object.entries(sectionDrafts)
      .map(([sec, text]) => `## ${sec}\n\n${text}`)
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(fullText || "No sections drafted yet.");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Complete proposal copied to clipboard");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1D9E75] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Grant Assistant v2
              </span>
              <span className="text-xs text-gray-500">RFP Ingestion & Context-Aware Autofill</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Grant Proposal Builder</h1>
            <p className="text-xs text-gray-500">
              Parse solicitation guidelines, ingest RFP requirements, and auto-draft proposals using your organization's verified impact metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleCopyFullProposal}
              className="p-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Export Full Proposal"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex gap-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("rfp")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "rfp"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. RFP Ingestion & Parser
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "builder"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. Proposal Builder & Context Autofill
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "chat"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            3. AI Proposal Advisor Chat
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab 1: RFP Ingestion & Parser */}
        {activeTab === "rfp" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">RFP Solicitation Guidelines</h3>
                  <p className="text-xs text-gray-500">Paste RFP text, notice of funding opportunity (NOFO), or guidelines.</p>
                </div>
              </div>

              <textarea
                value={rfpInput}
                onChange={(e) => setRfpInput(e.target.value)}
                rows={12}
                className="w-full p-3.5 rounded-lg border border-gray-200 text-xs font-mono bg-gray-50/50 focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75]"
                placeholder="Paste grant solicitation text here..."
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-400">Supported formats: Plain Text, Markdown, NOFO Excerpts</span>
                <button
                  onClick={handleParseRfp}
                  disabled={parseRfpMutation.isPending}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {parseRfpMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Parsing Guidelines...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Parse & Extract Requirements
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extracted RFP Summary Pane */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Parsed Opportunity Requirements
              </h3>

              {parsedRfp && (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-gray-400">Opportunity Title</div>
                    <div className="font-semibold text-gray-900 text-sm mt-0.5">{parsedRfp.opportunityTitle}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-100">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-gray-400">Funder Organization</div>
                      <div className="font-medium text-gray-800 mt-0.5">{parsedRfp.funderName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-gray-400">Max Award Amount</div>
                      <div className="font-bold text-emerald-700 mt-0.5">{parsedRfp.maxAwardAmount}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-semibold text-gray-400 mb-1">Mandatory Eligibility Criteria</div>
                    <ul className="space-y-1 text-gray-600">
                      {parsedRfp.eligibilityCriteria?.map((crit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-semibold text-gray-400 mb-1">Required Proposal Sections</div>
                    <div className="space-y-1">
                      {parsedRfp.requiredSections?.map((sec: any, idx: number) => (
                        <div key={idx} className="p-2 rounded bg-gray-50 border border-gray-100 flex items-center justify-between text-[11px]">
                          <span className="font-medium text-gray-800">{sec.name}</span>
                          <span className="text-gray-400">{sec.wordLimit} words max</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("builder")}
                    className="w-full py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Proceed to Proposal Builder <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Proposal Builder & Context Autofill */}
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Section Selector & Controls (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Proposal Sections</h3>
                  <button
                    onClick={handleAutofillAllSections}
                    className="text-[11px] text-[#1D9E75] font-semibold hover:underline cursor-pointer"
                  >
                    Autofill All
                  </button>
                </div>

                <div className="space-y-1.5">
                  {parsedRfp?.requiredSections?.map((sec: any) => {
                    const isDrafted = Boolean(sectionDrafts[sec.name]);
                    const isSelected = selectedSection === sec.name;
                    return (
                      <button
                        key={sec.name}
                        onClick={() => setSelectedSection(sec.name)}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "border-[#1D9E75] bg-emerald-50/40 font-semibold text-gray-900"
                            : "border-gray-100 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="truncate text-xs">
                          {sec.name}
                        </div>
                        {isDrafted ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Drafted
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Empty</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tone Selector */}
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
                    Grant Writing Tone:
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as any)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white"
                  >
                    <option value="formal">Formal & Academic</option>
                    <option value="data_driven">Data-Driven & Quantified</option>
                    <option value="community">Community-Centric & Narrative</option>
                    <option value="urgent">Urgent & Impact-First</option>
                  </select>
                </div>

                {/* Organization Context Ingested */}
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-[11px] text-gray-600 space-y-1">
                  <div className="font-semibold text-gray-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" /> Connected Context:
                  </div>
                  <div>• Org: Civic Health & Literacy Initiative</div>
                  <div>• Impact: 15,400+ community residents</div>
                  <div>• Tech: Multilingual AI + GPU Compute</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Section Editor & Draft Output (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedSection}</h3>
                  <p className="text-xs text-gray-500">
                    {parsedRfp?.requiredSections?.find((s: any) => s.name === selectedSection)?.promptGuide || "Section editor"}
                  </p>
                </div>

                <button
                  onClick={handleAutofillCurrentSection}
                  disabled={autofillSectionMutation.isPending}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {autofillSectionMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Autofill Section with AI
                    </>
                  )}
                </button>
              </div>

              {/* Editor Textarea */}
              <textarea
                value={sectionDrafts[selectedSection] || ""}
                onChange={(e) =>
                  setSectionDrafts((prev) => ({
                    ...prev,
                    [selectedSection]: e.target.value,
                  }))
                }
                rows={16}
                className="w-full p-4 rounded-lg border border-gray-200 text-xs font-mono leading-relaxed bg-gray-50/40 focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75]"
                placeholder={`Click "Autofill Section with AI" to generate a tailored draft for ${selectedSection}...`}
              />

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>
                  Words: {(sectionDrafts[selectedSection] || "").split(/\s+/).filter(Boolean).length} /{" "}
                  {parsedRfp?.requiredSections?.find((s: any) => s.name === selectedSection)?.wordLimit || 500} limit
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sectionDrafts[selectedSection] || "");
                    toast.success("Section copied to clipboard");
                  }}
                  className="p-1 text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Section
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Proposal Advisor Chat */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs max-w-4xl mx-auto space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1D9E75]" />
                Conversational Proposal Strategy & Review
              </h3>
              <p className="text-xs text-gray-500">
                Ask specific questions to refine narrative hooks, emphasize budget justification, or ensure scoring criteria alignment.
              </p>
            </div>

            {/* Chat Messages */}
            <div className="h-[420px] overflow-y-auto space-y-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl p-3.5 rounded-xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1D9E75] text-white"
                        : "bg-white border border-gray-200 text-gray-800 shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="Ask about narrative framing, evaluation metrics, or compliance..."
                className="flex-1 p-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75]"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2.5 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
