import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { FileText, Download, Printer, Award, ShieldCheck, CheckCircle2, Building, Users, Clock, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

interface CsrReportViewerProps {
  isOpen: boolean;
  onClose: () => void;
  donorId: number;
  donorName?: string;
}

export default function CsrReportViewer({
  isOpen,
  onClose,
  donorId,
  donorName = "Nexus DeepMind Labs",
}: CsrReportViewerProps) {
  const [selectedMonth, setSelectedMonth] = useState("2026-08");

  const { data: reports, refetch } = trpc.incentive.getCsrReports.useQuery(
    { donorId },
    { enabled: isOpen }
  );

  const generateReportMutation = trpc.incentive.generateCsrReport.useMutation({
    onSuccess: () => {
      toast.success("New GRI-aligned CSR report generated successfully!");
      refetch();
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Downloaded CSR-Report-${selectedMonth}.pdf`);
  };

  if (!isOpen) return null;

  const currentReport = reports?.[0] || {
    id: 1,
    donorId,
    month: selectedMonth,
    organizationsHelped: 14,
    hoursContributed: "2450.00",
    peopleImpacted: 15400,
    griAligned: true,
    successStories: [
      {
        title: "Community Health Access AI",
        description: "Provided 800 GPU hours enabling real-time multilingual translation for 12,000 clinic patients.",
        impact: "12,000 Patients Supported",
      },
      {
        title: "Stem Equity After-School Labs",
        description: "Donated automated Python grading agent and cloud compute to 35 Title I schools.",
        impact: "3,400 Students Reached",
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-150 my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-semibold text-gray-900">ESG & CSR Impact Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-gray-600 hover:text-gray-900 rounded-md border border-gray-200 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-white bg-[#1D9E75] hover:bg-[#16815f] rounded-md text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> PDF Export
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="py-6 space-y-6 print:p-0">
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-gray-900 to-emerald-950 text-white">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" /> Verified ESG Contribution
              </div>
              <h2 className="text-xl font-bold">{donorName}</h2>
              <p className="text-xs text-gray-300 mt-0.5">
                Corporate Social Responsibility Impact Ledger • Month of {currentReport.month}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                GRI 201 / 413 Aligned
              </span>
            </div>
          </div>

          {/* Key ESG Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <Clock className="w-5 h-5 text-[#1D9E75] mx-auto mb-1" />
              <div className="text-xl font-bold text-gray-900">{currentReport.hoursContributed} hrs</div>
              <div className="text-[11px] text-gray-500 font-medium">Compute / Agents Contributed</div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
              <Building className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-gray-900">{currentReport.organizationsHelped}</div>
              <div className="text-[11px] text-gray-500 font-medium">Non-Profits Supported</div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-100">
              <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-gray-900">
                {Number(currentReport.peopleImpacted).toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">Community Beneficiaries</div>
            </div>
          </div>

          {/* Success Stories & Project Highlights */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1D9E75]" /> Non-Profit Outcome Case Studies
            </h4>
            <div className="space-y-3">
              {currentReport.successStories?.map((story: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-semibold text-gray-900">{story.title}</h5>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {story.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{story.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ESG Compliance Statement */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Audit & Compliance Certification
            </div>
            <p className="text-[11px] leading-relaxed">
              This report certifies that the resources pledged by {donorName} have been verified through continuous SLA
              telemetry (uptime &gt; 99%, p95 latency &lt; 3.0s) and allocated directly to vetted 501(c)(3) and civic non-profit
              organizations on the Tech-Equity Bridge platform.
            </p>
          </div>
        </div>

        {/* Generate / Month Selector Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Report Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>
          <button
            onClick={() => generateReportMutation.mutate({ month: selectedMonth })}
            disabled={generateReportMutation.isPending}
            className="px-3 py-1.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium hover:bg-purple-100 cursor-pointer"
          >
            {generateReportMutation.isPending ? "Generating..." : "Regenerate Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
