import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Activity, Database, Cpu, Clock, CheckCircle2, AlertTriangle, RefreshCw, X, Play, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

interface SystemHealthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemHealthDrawer({ isOpen, onClose }: SystemHealthDrawerProps) {
  const { data: health, refetch: refetchHealth, isLoading: isHealthLoading } =
    trpc.infrastructure.getSystemHealth.useQuery(undefined, { enabled: isOpen });

  const { data: workerData, refetch: refetchJobs, isLoading: isJobsLoading } =
    trpc.infrastructure.getWorkerJobs.useQuery(undefined, { enabled: isOpen });

  const enqueueMutation = trpc.infrastructure.enqueueJob.useMutation({
    onSuccess: (data) => {
      refetchJobs();
      toast.success(`Job ${data.id} enqueued to background queue`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to enqueue background job");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="bg-white max-w-lg w-full h-full p-6 shadow-2xl overflow-y-auto space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#1D9E75]" /> Telemetry Probe
                </span>
                <span className="text-xs text-gray-500">Live Production Health</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Infrastructure Health & Workers</h3>
            </div>

            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 text-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Health Card */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-gray-900">Database Connection Pool</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {health?.database.status === "connected_external" ? "MySQL Pool Active" : "In-Memory Resilient"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-gray-100">
                <div className="text-[10px] text-gray-400">Pool Limit</div>
                <div className="font-bold text-gray-900 mt-0.5">{health?.database.pool.connectionLimit || 10}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-100">
                <div className="text-[10px] text-gray-400">Active Conns</div>
                <div className="font-bold text-purple-700 mt-0.5">{health?.database.pool.activeConnections || 1}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-100">
                <div className="text-[10px] text-gray-400">Query Latency</div>
                <div className="font-bold text-emerald-600 mt-0.5">{health?.database.latencyMs} ms</div>
              </div>
            </div>
          </div>

          {/* Background Worker Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1D9E75]" />
                <span className="text-xs font-bold text-gray-900">Async Worker Queue (BullMQ)</span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                {workerData?.stats.activeWorkers || 4} Workers Active
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-[10px] text-gray-400">Total Jobs</div>
                <div className="font-bold text-gray-900">{workerData?.stats.total || 3}</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] text-emerald-700">Completed</div>
                <div className="font-bold text-emerald-800">{workerData?.stats.completed || 3}</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-[10px] text-amber-700">Pending</div>
                <div className="font-bold text-amber-800">{workerData?.stats.pending || 0}</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-[10px] text-gray-400">Concurrency</div>
                <div className="font-bold text-gray-900">{workerData?.stats.concurrencyLimit || 10}</div>
              </div>
            </div>

            {/* Quick Enqueue Buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                Trigger Asynchronous Worker Job:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => enqueueMutation.mutate({ type: "RUN_SLA_BENCHMARKS", priority: "high" })}
                  disabled={enqueueMutation.isPending}
                  className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" /> Run SLA Probes
                </button>
                <button
                  onClick={() => enqueueMutation.mutate({ type: "GENERATE_MONTHLY_CSR_REPORTS", priority: "medium" })}
                  disabled={enqueueMutation.isPending}
                  className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[#1D9E75] text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" /> Auto-Generate CSR
                </button>
              </div>
            </div>

            {/* Recent Jobs Feed */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-semibold text-gray-600 block">Recent Job Telemetry:</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {workerData?.jobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-gray-800">{job.id} • {job.type}</div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(job.createdAt).toLocaleTimeString()} • Priority: {job.priority}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Uptime: {Math.floor((health?.uptimeSeconds || 120) / 60)} mins</span>
          <span>Heap: {health?.memory.heapUsedMb} MB</span>
        </div>
      </div>
    </div>
  );
}
