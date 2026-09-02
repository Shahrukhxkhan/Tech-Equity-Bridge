import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Cpu, Wifi, WifiOff, Radio, RefreshCw, Play, CheckCircle2, Shield, Battery, HardDrive, Smartphone, Server, Laptop, Sparkles, Clock, Globe, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import RoleAccessBadge from "@/components/RoleAccessBadge";

export default function EdgeMesh() {
  const [networkState, setNetworkState] = useState<"online" | "satellite_intermittent" | "airgapped_offline">("airgapped_offline");
  const [selectedModelId, setSelectedModelId] = useState("MODEL-MEDTRIAGE-Q4");
  const [selectedNodeId, setSelectedNodeId] = useState("NODE-RURAL-01");
  const [inputPrompt, setInputPrompt] = useState("Patient presents with 48h persistent wheezing and cough, difficulty speaking full sentences.");
  const [lastInferenceResult, setLastInferenceResult] = useState<any | null>(null);

  const { data: models, isLoading: isModelsLoading } = trpc.edgeMesh.getQuantizedModels.useQuery();
  const { data: edgeNodes, refetch: refetchNodes, isLoading: isNodesLoading } = trpc.edgeMesh.getEdgeNodes.useQuery();
  const { data: crdtRecords, refetch: refetchRecords, isLoading: isRecordsLoading } = trpc.edgeMesh.getCrdtRecords.useQuery();

  const runInferenceMutation = trpc.edgeMesh.runLocalInference.useMutation({
    onSuccess: (data) => {
      setLastInferenceResult(data);
      refetchRecords();
      refetchNodes();
      toast.success(`Offline inference completed (${data.executionTimeMs}ms • 0 bytes network used)`);
    },
    onError: (err) => {
      toast.error(err.message || "Local inference failed");
    },
  });

  const syncMutation = trpc.edgeMesh.syncMeshToCloud.useMutation({
    onSuccess: (data) => {
      refetchRecords();
      refetchNodes();
      toast.success(`CRDT Mesh Synchronized! ${data.reconciledRecordsCount} records merged to cloud ledger`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to reconcile CRDT mesh");
    },
  });

  const handleRunInference = () => {
    if (!inputPrompt.trim()) {
      toast.error("Please provide clinical input or text");
      return;
    }
    runInferenceMutation.mutate({
      modelId: selectedModelId,
      inputPrompt,
      nodeId: selectedNodeId,
    });
  };

  const selectedModel = models?.find(m => m.id === selectedModelId) || models?.[0];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "tablet": return Smartphone;
      case "raspberry_pi": return Server;
      default: return Laptop;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#1D9E75]" /> Edge Compute Mesh & CRDT Sync
              </span>
              <span className="text-xs text-gray-500">Air-Gapped & Low-Connectivity Field Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Offline-First Edge Compute Mesh
            </h1>
            <p className="text-xs text-gray-500">
              Run quantized INT4/INT8 clinical & translation models locally on clinic tablets, with automated Peer-to-Peer CRDT cloud convergence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RoleAccessBadge />
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-2 px-3">
              Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Network Simulation Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              networkState === "airgapped_offline"
                ? "bg-amber-100 text-amber-800"
                : networkState === "satellite_intermittent"
                ? "bg-blue-100 text-blue-800"
                : "bg-emerald-100 text-emerald-800"
            }`}>
              {networkState === "airgapped_offline" ? (
                <WifiOff className="w-5 h-5" />
              ) : networkState === "satellite_intermittent" ? (
                <Radio className="w-5 h-5" />
              ) : (
                <Wifi className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                Simulated Clinic Connectivity:
                <span className="capitalize font-mono text-[11px] px-2 py-0.5 rounded bg-gray-100">
                  {networkState.replace("_", " ")}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {networkState === "airgapped_offline"
                  ? "Zero cloud access. Inference running 100% on local tablet RAM/CPU. In-take records queued in local CRDT vector store."
                  : networkState === "satellite_intermittent"
                  ? "High packet loss (40%). Local edge model preferred; P2P mesh synchronization active."
                  : "Cloud uplink active. Ready for automatic CRDT ledger reconciliation."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setNetworkState("airgapped_offline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                networkState === "airgapped_offline"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              Air-Gapped Offline
            </button>
            <button
              onClick={() => setNetworkState("satellite_intermittent")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                networkState === "satellite_intermittent"
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              Satellite (Intermittent)
            </button>
            <button
              onClick={() => setNetworkState("online")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                networkState === "online"
                  ? "bg-[#1D9E75] text-white border-[#1D9E75] shadow-xs"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              Connected (Cloud Uplink)
            </button>
          </div>
        </div>

        {/* Top Grid: Local Model Runner & Active Node Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quantized Model Runner (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#1D9E75]" /> On-Device Quantized Model Playground
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                WASM / ONNX Embedded
              </span>
            </div>

            {/* Model Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {models?.map((m: any) => {
                const isSelected = m.id === selectedModelId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#1D9E75] bg-emerald-50/40 text-emerald-950 ring-1 ring-[#1D9E75]"
                        : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-purple-700 block mb-0.5">
                        {m.quantization}
                      </span>
                      <div className="font-bold text-xs leading-tight truncate">{m.name}</div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">
                      {m.memoryFootprintMb} MB RAM
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Model Specs */}
            {selectedModel && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="font-bold">{selectedModel.name}</span>
                  <span className="font-mono text-[11px] text-gray-500">Latency: ~{selectedModel.avgInferenceLatencyMs}ms</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{selectedModel.description}</p>
              </div>
            )}

            {/* Input Prompt */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Patient Intake / Triage Prompt (Air-Gapped):
              </label>
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={handleRunInference}
              disabled={runInferenceMutation.isPending}
              className="w-full py-2.5 rounded-xl bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {runInferenceMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Executing Quantized Weights on Local CPU...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Offline Edge Inference (0 Network Bytes)
                </>
              )}
            </button>

            {/* Output Result */}
            {lastInferenceResult && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-emerald-400 pb-1.5 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Output Generated On-Device
                  </span>
                  <span className="text-slate-400">{lastInferenceResult.executionTimeMs}ms • {lastInferenceResult.memoryUsedMb}MB</span>
                </div>
                <p className="whitespace-pre-wrap text-slate-200 text-[11px] leading-relaxed">
                  {lastInferenceResult.output}
                </p>
              </div>
            )}
          </div>

          {/* Right: Remote Edge Nodes Mesh (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-600" /> Rural Clinic Nodes Mesh
                </span>
                <span className="text-[10px] text-gray-400">P2P Vector State</span>
              </div>

              <div className="space-y-2.5">
                {edgeNodes?.map((node: any) => {
                  const DeviceIcon = getDeviceIcon(node.deviceType);
                  return (
                    <div
                      key={node.id}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <DeviceIcon className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold text-gray-900 leading-tight">{node.deviceName}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{node.clinicLocation}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                          node.connectionStatus === "airgapped_offline"
                            ? "bg-amber-100 text-amber-800"
                            : node.connectionStatus === "satellite_intermittent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {node.connectionStatus.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-100">
                        <span>RAM: {node.ramGb}GB</span>
                        <span>Battery: {node.batteryLevelPct}%</span>
                        <span className="font-semibold text-purple-700">
                          {node.pendingCrdtRecordsCount} Local Queued
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sync Reconciler CTA */}
            <div className="pt-2">
              <button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {syncMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Merging CRDT Vector Clocks...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    Sync Mesh to Cloud Audit Ledger
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: P2P CRDT Sync Queue & Cryptographic Ledger */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1D9E75]" />
                P2P CRDT Offline Intake Ledger (Lamport Clocks)
              </h4>
              <p className="text-xs text-gray-500">
                Guarantees conflict-free convergence when rural tablets reconnect to the cloud ledger.
              </p>
            </div>

            <span className="text-xs text-gray-500 font-mono">
              Total Records: {crdtRecords?.length || 0}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
                  <th className="p-3 font-bold">Record ID</th>
                  <th className="p-3 font-bold">Origin Edge Node</th>
                  <th className="p-3 font-bold">Category</th>
                  <th className="p-3 font-bold">Language / Translation</th>
                  <th className="p-3 font-bold">Lamport Clock</th>
                  <th className="p-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {crdtRecords?.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{rec.id}</td>
                    <td className="p-3 text-gray-600">{rec.nodeId}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-sans font-medium text-[10px]">
                        {rec.triageCategory}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-gray-700 max-w-xs truncate">
                      {rec.primaryLanguage} • {rec.translatedSummary}
                    </td>
                    <td className="p-3 text-purple-700 font-bold">L:{rec.lamportTimestamp}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                        rec.syncStatus === "synced_to_cloud"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {rec.syncStatus === "synced_to_cloud" ? "Synced to Cloud" : "Locally Queued"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
