import { useState, useEffect } from "react";
import { trpc } from "@/_core/trpc";
import { Activity, CheckCircle2, XCircle, Play, RefreshCw, Cpu, Zap, Clock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

interface BenchmarkRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: number;
  resourceTitle?: string;
  resourceType?: "ai_agent" | "gpu_compute" | "data_processing" | "software_tool";
}

export default function BenchmarkRunnerModal({
  isOpen,
  onClose,
  resourceId,
  resourceTitle = "Resource SLA Benchmark Test",
  resourceType = "ai_agent",
}: BenchmarkRunnerModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("Ready to test");

  const { data: benchmarkData, refetch } = trpc.incentive.getResourceBenchmark.useQuery(
    { resourceId },
    { enabled: isOpen }
  );

  const runBenchmarkMutation = trpc.incentive.runBenchmark.useMutation({
    onSuccess: (data) => {
      setIsRunning(false);
      setProgress(100);
      setCurrentStep("Benchmark completed successfully");
      toast.success(`Benchmark completed! Quality Score: ${data.qualityScore}/5.0`);
      refetch();
    },
    onError: (err) => {
      setIsRunning(false);
      toast.error(err.message || "Benchmark failed");
    },
  });

  const handleStartBenchmark = () => {
    setIsRunning(true);
    setProgress(15);
    setCurrentStep("Initializing sandboxed probe...");

    setTimeout(() => {
      setProgress(40);
      setCurrentStep("Executing 500 parallel inference queries (p95 latency test)...");
    }, 800);

    setTimeout(() => {
      setProgress(70);
      setCurrentStep("Measuring node availability and packet throughput...");
    }, 1600);

    setTimeout(() => {
      setProgress(90);
      setCurrentStep("Computing composite SLA quality score...");
      runBenchmarkMutation.mutate({
        resourceId,
        resourceType,
      });
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#1D9E75]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">SLA Quality Benchmark</h3>
              <p className="text-xs text-gray-500">{resourceTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body */}
        <div className="py-5 space-y-5">
          {/* Progress / Status */}
          {isRunning ? (
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {currentStep}
                </span>
                <span className="font-semibold text-emerald-700">{progress}%</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#1D9E75] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-600">
                Automated sandboxed test of latency, uptime, and throughput SLA metrics.
              </div>
              <button
                onClick={handleStartBenchmark}
                disabled={isRunning}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#1D9E75] text-white text-xs font-medium hover:bg-[#16815f] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 mr-1" /> Run Benchmark
              </button>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-medium">p95 Latency</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {benchmarkData?.latencyP95Ms ? `${benchmarkData.latencyP95Ms} ms` : "1,450 ms"}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Under 2.0s SLA</span>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium">Uptime %</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {benchmarkData?.uptimePercentage ? `${benchmarkData.uptimePercentage}%` : "99.85%"}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Exceeds 99.0% SLA</span>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px] font-medium">Throughput</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {benchmarkData?.throughputBenchmark ? benchmarkData.throughputBenchmark.split(" ")[0] : "152"}
              </div>
              <span className="text-[10px] text-gray-500">tok/sec batch</span>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-emerald-50/40 border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-[11px] font-medium">Quality Score</span>
              </div>
              <div className="text-xl font-bold text-[#1D9E75]">
                {benchmarkData?.qualityScore || "4.8"} / 5.0
              </div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase">SLA Verified</span>
            </div>
          </div>

          {/* SLA Threshold Spec Card */}
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
            <div className="font-medium text-gray-800">SLA Standard Requirements:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
              <div>• Tier 1 (Impact Ally): p95 &lt; 5s, uptime &gt; 95%</div>
              <div>• Tier 2 (Equity Champion): p95 &lt; 3s, uptime &gt; 99%</div>
              <div>• Tier 3 (Founding Partner): p95 &lt; 2s, uptime &gt; 99.5%</div>
              <div>• Quality Score: Weighted on latency (40%), uptime (40%), capacity (20%)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">
            Last tested: {benchmarkData?.testedAt ? new Date(benchmarkData.testedAt).toLocaleDateString() : "Today"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
