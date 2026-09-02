import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, Key, Leaf, CheckCircle2, Sparkles, Lock, RefreshCw, Copy, Check, FileCheck, Award, ExternalLink, Cpu, Database, Eye, Code, Zap } from "lucide-react";
import { toast } from "sonner";
import RoleAccessBadge from "@/components/RoleAccessBadge";

export default function Web3EsgVault() {
  const [activeTab, setActiveTab] = useState<"did" | "zk" | "carbon">("zk");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // zk-Proof Generator State
  const [donorName, setDonorName] = useState("Nexus DeepMind Labs");
  const [resourceTitle, setResourceTitle] = useState("NVIDIA A100 GPU Cluster Allocation");
  const [uptimePct, setUptimePct] = useState(99.8);
  const [latencyMs, setLatencyMs] = useState(340);
  const [tokThroughput, setTokThroughput] = useState(155);

  // Carbon Offset Mint State
  const [carbonDonor, setCarbonDonor] = useState("Nexus DeepMind Labs");
  const [carbonNonprofit, setCarbonNonprofit] = useState("Community Health Net");
  const [gpuHours, setGpuHours] = useState(1500);
  const [energySource, setEnergySource] = useState<any>("Hydroelectric");

  const { data: credentials, refetch: refetchCreds } = trpc.web3Esg.getVerifiableCredentials.useQuery();
  const { data: zkProofs, refetch: refetchZk } = trpc.web3Esg.getZkProofs.useQuery();
  const { data: carbonReceipts, refetch: refetchCarbon } = trpc.web3Esg.getCarbonOffsets.useQuery();

  const verifyCredMutation = trpc.web3Esg.verifyCredential.useMutation({
    onSuccess: (data) => {
      toast.success(`W3C Verifiable Credential verified! Signature: ${data.signatureType}`);
    },
    onError: (err) => {
      toast.error(err.message || "Credential verification failed");
    },
  });

  const generateZkMutation = trpc.web3Esg.generateZkProof.useMutation({
    onSuccess: (data) => {
      refetchZk();
      toast.success(`zk-SNARK Compute SLA Proof generated (${data.proofId})`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate zk-proof");
    },
  });

  const verifyZkMutation = trpc.web3Esg.verifyZkProof.useMutation({
    onSuccess: (data) => {
      toast.success(`zk-SNARK Circuit verified! Groth16 / BN254 mathematical proof valid.`);
    },
    onError: (err) => {
      toast.error(err.message || "zk-Proof verification failed");
    },
  });

  const mintCarbonMutation = trpc.web3Esg.mintCarbonOffset.useMutation({
    onSuccess: (data) => {
      refetchCarbon();
      toast.success(`On-chain Carbon Offset NFT Minted! Tx: ${data.transactionHash.substring(0, 14)}...`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to mint carbon offset");
    },
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
    toast.success("Hash copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-purple-600" /> Web3 & Cryptographic Trust Layer
              </span>
              <span className="text-xs text-gray-500">zk-SNARKs • W3C DIDs • L2 Carbon Offsets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Verifiable ESG & Zero-Knowledge Vault
            </h1>
            <p className="text-xs text-gray-500">
              Cryptographically prove corporate SLA compute delivery with zk-SNARKs, verify non-profit 501(c)(3) DIDs, and mint on-chain green carbon offsets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RoleAccessBadge />
            <a href="/dashboard" className="btn btn-primary btn-sm text-xs py-2 px-3">
              Dashboard
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex gap-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("zk")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "zk"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. Zero-Knowledge SLA Compute Proofs (zk-SNARKs)
          </button>
          <button
            onClick={() => setActiveTab("did")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "did"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. W3C Decentralized Identifiers & 501(c)(3) VCs
          </button>
          <button
            onClick={() => setActiveTab("carbon")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "carbon"
                ? "border-[#1D9E75] text-[#1D9E75]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            3. On-Chain Impact Carbon Offsets (Base L2 / Polygon)
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* TAB 1: Zero-Knowledge SLA Compute Proofs */}
        {activeTab === "zk" && (
          <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700 uppercase">
                    zk-SNARK Groth16 / BN254 Circuit
                  </span>
                  <span className="text-xs text-slate-400">Zero-Knowledge SLA Verification</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Privacy-Preserving Proofs of Compute Delivery
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Allows tech donors to cryptographically prove that their donated GPU cluster delivered &gt;99.5% uptime and &lt;2s latency without leaking private cluster IP addresses, model weights, or sensitive telemetry.
                </p>
              </div>

              {/* Live zk-Proof Trigger */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3 min-w-[280px]">
                <span className="text-[11px] font-bold text-slate-300 block">
                  Generate zk-Compute Proof:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Uptime</span>
                    <span className="font-bold text-emerald-400">{uptimePct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">p95 Latency</span>
                    <span className="font-bold text-purple-400">{latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Throughput</span>
                    <span className="font-bold text-blue-400">{tokThroughput} t/s</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    generateZkMutation.mutate({
                      donorName,
                      resourceTitle,
                      metrics: { uptimePct, p95LatencyMs: latencyMs, throughputTokPerSec: tokThroughput },
                    })
                  }
                  disabled={generateZkMutation.isPending}
                  className="w-full py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {generateZkMutation.isPending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                  )}
                  Synthesize zk-Proof
                </button>
              </div>
            </div>

            {/* Proofs Feed Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Verified zk-SLA Proof Ledger</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zkProofs?.map((proof: any) => (
                  <div
                    key={proof.proofId}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-gray-900 text-sm">{proof.proofId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mathematically Valid
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 font-semibold">{proof.donorName}</div>
                      <div className="text-[11px] text-gray-500">{proof.resourceTitle}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Uptime Proof:</span>
                        <span className="font-bold text-emerald-700">&gt; {proof.provenClaims.uptimeThresholdPct}% (Verified)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Latency Bound:</span>
                        <span className="font-bold text-purple-700">&lt; {proof.provenClaims.maxP95LatencyMs}ms</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Confidentiality:</span>
                        <span className="font-bold text-blue-700">Weights &amp; IPs Zero-Knowledge Hidden</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-gray-500 truncate max-w-[200px]">
                        {proof.verificationHash}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(proof.verificationHash, proof.proofId)}
                          className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          title="Copy zk-Hash"
                        >
                          {copiedHash === proof.proofId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => verifyZkMutation.mutate({ proofId: proof.proofId })}
                          className="px-2.5 py-1 rounded bg-purple-50 text-purple-800 font-semibold border border-purple-200 hover:bg-purple-100 text-[10px] cursor-pointer"
                        >
                          Verify Circuit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: W3C Verifiable Credentials & DIDs */}
        {activeTab === "did" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">W3C Decentralized Identifiers &amp; 501(c)(3) VCs</h3>
                <p className="text-xs text-gray-500">
                  Standard W3C JSON-LD digital credentials signed with Ed25519 cryptographic keys.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Trust Registry: Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {credentials?.map((vc: any) => (
                <div
                  key={vc.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        {vc.type[1]}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <Award className="w-3 h-3" /> ESG Score: {vc.credentialSubject.esgImpactScore}/100
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{vc.credentialSubject.organizationName}</h3>
                    <div className="text-xs text-gray-500 font-mono">
                      DID: {vc.credentialSubject.id}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Tax Exemption Status:</span>
                      <span className="font-bold text-gray-800">{vc.credentialSubject.taxExemptStatus}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">EIN Tax Number:</span>
                      <span className="font-mono text-gray-800">{vc.credentialSubject.einTaxNumber}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Beneficiaries Served:</span>
                      <span className="font-bold text-purple-700">
                        {vc.credentialSubject.cumulativeBeneficiariesServed?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400 font-mono">
                      Sig: {vc.proof.type}
                    </span>
                    <button
                      onClick={() => verifyCredMutation.mutate({ credentialId: vc.id })}
                      className="px-3 py-1.5 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <FileCheck className="w-3.5 h-3.5" /> Verify Signature
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: On-Chain Impact Carbon Offsets */}
        {activeTab === "carbon" && (
          <div className="space-y-6">
            {/* Mint New Carbon Offset Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" /> Renewable Compute Matching
                  </span>
                  <span className="text-xs text-gray-500">Base L2 &amp; Polygon ESG Mint</span>
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Convert Clean GPU Hours to Tokenized ESG Carbon Credits
                </h3>
                <p className="text-xs text-gray-500 max-w-xl">
                  Automatically calculates metric tons of CO2e avoided from donated renewable GPU capacity and mints verified Soulbound Impact NFTs.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() =>
                    mintCarbonMutation.mutate({
                      donorName: carbonDonor,
                      nonprofitPartner: carbonNonprofit,
                      gpuHoursDonated: gpuHours,
                      renewableEnergySource: energySource,
                    })
                  }
                  disabled={mintCarbonMutation.isPending}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {mintCarbonMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Leaf className="w-4 h-4 fill-current" />
                  )}
                  Mint Carbon Offset NFT (15.0 tCO2e)
                </button>
              </div>
            </div>

            {/* Minted Receipts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {carbonReceipts?.map((receipt: any) => (
                <div
                  key={receipt.receiptId}
                  className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {receipt.network} • Token #{receipt.tokenId}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5" /> {receipt.metricTonsCo2Avoided} tCO2e Avoided
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{receipt.donorName}</h3>
                    <div className="text-xs text-gray-500">Partner: {receipt.nonprofitPartner}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Clean Energy Used:</span>
                      <span className="font-bold text-emerald-800">{receipt.cleanEnergyMwhUsed} MWh ({receipt.renewableEnergySource})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Block Height:</span>
                      <span className="text-gray-700">#{receipt.blockNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Contract:</span>
                      <span className="text-gray-700 truncate max-w-[180px]">{receipt.contractAddress}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-400 text-[10px] truncate max-w-[200px]">
                      Tx: {receipt.transactionHash}
                    </span>
                    <button
                      onClick={() => handleCopy(receipt.transactionHash, receipt.receiptId)}
                      className="text-xs text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedHash === receipt.receiptId ? "Copied" : "Copy Tx Hash"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
