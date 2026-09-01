import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Download, FileText, ShieldCheck, CheckCircle2, Clock, Copy, Check, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

interface AuditLogExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLogExportModal({ isOpen, onClose }: AuditLogExportModalProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const { data: auditLogs, isLoading } = trpc.analytics.getAuditLogs.useQuery(undefined, {
    enabled: isOpen,
  });

  const exportMutation = trpc.analytics.exportAuditData.useMutation({
    onSuccess: (data, variables) => {
      const mimeType = variables.format === "json" ? "application/json" : "text/csv";
      const filename = `tech_equity_bridge_audit_${Date.now()}.${variables.format}`;
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported compliance audit report (${variables.format.toUpperCase()})`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate compliance export");
    },
  });

  if (!isOpen) return null;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
    toast.success("Verification hash copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#1D9E75]" /> Cryptographic Audit Ledger
              </span>
              <span className="text-xs text-gray-500">GRI 201 / IRS 990 In-Kind Verification</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Platform Compliance & Audit Trail</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-900 text-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Table List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" /> Loading audit ledger entries...
            </div>
          ) : auditLogs && auditLogs.length > 0 ? (
            auditLogs.map((log: any) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white transition-all space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{log.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                      {log.eventType}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(log.timestamp).toUTCString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Actor & Entity:</span>
                    <span className="font-medium text-gray-900">{log.actorName}</span> ({log.actorRole}) ➔{" "}
                    <span className="text-gray-800">{log.targetEntity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">SLA & Status:</span>
                    <span className="font-semibold text-emerald-700">{log.status}</span> • {log.slaCompliance}
                  </div>
                </div>

                {/* Hash row */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-mono text-[10px] text-gray-500">
                  <span className="truncate max-w-sm sm:max-w-md">Hash: {log.verificationHash}</span>
                  <button
                    onClick={() => handleCopyHash(log.verificationHash)}
                    className="p-1 text-gray-400 hover:text-gray-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash === log.verificationHash ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedHash === log.verificationHash ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">No audit records found.</div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-gray-500">
            Compliant with ISO/IEC 27001 & GRI Global Reporting Standards.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportMutation.mutate({ format: "json" })}
              disabled={exportMutation.isPending}
              className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON
            </button>
            <button
              onClick={() => exportMutation.mutate({ format: "csv" })}
              disabled={exportMutation.isPending}
              className="px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV Audit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
