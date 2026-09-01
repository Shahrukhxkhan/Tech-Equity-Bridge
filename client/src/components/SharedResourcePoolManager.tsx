import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Cpu, Zap, PieChart, Users, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Edit3, Save } from "lucide-react";
import { toast } from "sonner";

interface SharedResourcePoolManagerProps {
  coalitionId?: number;
  coalitionName?: string;
}

export default function SharedResourcePoolManager({
  coalitionId = 1,
  coalitionName = "Education & Healthcare Tech Alliance",
}: SharedResourcePoolManagerProps) {
  const [selectedPoolId, setSelectedPoolId] = useState<number>(101);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMembers, setEditedMembers] = useState<any[]>([]);

  const { data: pools, refetch, isLoading } = trpc.coalitionWorkspace.getResourcePools.useQuery({
    coalitionId,
  });

  const activePool = pools?.find((p: any) => p.id === selectedPoolId) || pools?.[0];

  const updateAllocationMutation = trpc.coalitionWorkspace.updateMemberAllocation.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetch();
      toast.success("Coalition quota allocations updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update allocations");
    },
  });

  const handleStartEdit = () => {
    if (activePool?.allocatedMembers) {
      setEditedMembers(JSON.parse(JSON.stringify(activePool.allocatedMembers)));
      setIsEditing(true);
    }
  };

  const handleMemberAmountChange = (index: number, newAmount: number) => {
    const next = [...editedMembers];
    next[index].allocatedAmount = Number(newAmount) || 0;
    setEditedMembers(next);
  };

  const handleSaveAllocations = () => {
    if (!activePool) return;
    const totalAllocated = editedMembers.reduce((sum, m) => sum + m.allocatedAmount, 0);
    const totalCap = parseFloat(activePool.totalCapacity);

    if (totalAllocated > totalCap) {
      toast.error(`Total allocated (${totalAllocated.toLocaleString()}) exceeds pool capacity (${totalCap.toLocaleString()})`);
      return;
    }

    updateAllocationMutation.mutate({
      poolId: activePool.id,
      memberAllocations: editedMembers,
    });
  };

  const currentMembers = isEditing ? editedMembers : (activePool?.allocatedMembers || []);
  const totalAllocated = currentMembers.reduce((sum: number, m: any) => sum + (m.allocatedAmount || 0), 0);
  const totalCapacityNum = activePool ? parseFloat(activePool.totalCapacity) : 5000;
  const unallocatedAmount = Math.max(0, totalCapacityNum - totalAllocated);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
              Shared Resource Allocator
            </span>
            <span className="text-xs text-gray-500">Collective Pool Governance</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">Coalition Resource Pool Management</h3>
          <p className="text-xs text-gray-500">
            Fairly split and monitor allocated GPU hours and AI query credits across all {coalitionName} member organizations.
          </p>
        </div>

        {/* Pool Switcher Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {pools?.map((pool: any) => (
            <button
              key={pool.id}
              onClick={() => {
                setSelectedPoolId(pool.id);
                setIsEditing(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activePool?.id === pool.id
                  ? "bg-[#1D9E75] text-white border-[#1D9E75] shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {pool.resourceType === "gpu_compute" ? (
                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> GPU Pool</span>
              ) : (
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> AI Agent Quota</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !activePool ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400 text-xs">
          <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" /> Loading shared capacity metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pool Overview & Capacity Bar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800 uppercase">Pool Capacity</span>
                <span className="text-xs font-bold text-[#1D9E75]">{activePool.unit}</span>
              </div>

              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {parseFloat(activePool.totalCapacity).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{activePool.poolName}</div>
              </div>

              {/* Progress Bar of Overall Allocation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Allocated to Members:</span>
                  <span className="font-bold text-gray-900">
                    {totalAllocated.toLocaleString()} / {parseFloat(activePool.totalCapacity).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className="bg-[#1D9E75] h-2.5 transition-all"
                    style={{ width: `${Math.min(100, (totalAllocated / totalCapacityNum) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>{((totalAllocated / totalCapacityNum) * 100).toFixed(1)}% split</span>
                  <span>{unallocatedAmount.toLocaleString()} unassigned</span>
                </div>
              </div>

              {/* Safeguard Note */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All member allocations are governed by smart rate-limiting to prevent quota starvation and ensure 99.8% uptime SLA.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Member Quota Breakdown Table & Sliders (8 cols) */}
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Member Organization Quotas</h4>
                <p className="text-xs text-gray-500">Live usage consumption and assigned capacity per member.</p>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAllocations}
                    disabled={updateAllocationMutation.isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Quotas
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartEdit}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gray-500" /> Edit Split
                </button>
              )}
            </div>

            {/* Member Rows */}
            <div className="space-y-3.5">
              {currentMembers.map((member: any, idx: number) => {
                const usedPct = member.allocatedAmount > 0
                  ? Math.min(100, Math.round((member.usedAmount / member.allocatedAmount) * 100))
                  : 0;

                return (
                  <div
                    key={member.nonprofitId || idx}
                    className="p-3.5 rounded-lg bg-gray-50/80 border border-gray-100 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-gray-900">{member.orgName}</div>
                        <div className="text-[10px] text-gray-500">Contact Lead: {member.contactPerson}</div>
                      </div>

                      {/* Quota display / input */}
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">Assigned Quota:</label>
                          <input
                            type="number"
                            value={member.allocatedAmount}
                            onChange={(e) => handleMemberAmountChange(idx, parseFloat(e.target.value))}
                            className="w-28 p-1.5 text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg text-right"
                          />
                          <span className="text-xs text-gray-400">{activePool.unit.split(" ")[0]}</span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-xs font-bold text-gray-900">
                            {member.usedAmount.toLocaleString()} / {member.allocatedAmount.toLocaleString()} {activePool.unit.split(" ")[0]}
                          </div>
                          <div className="text-[10px] text-gray-500">{usedPct}% consumed</div>
                        </div>
                      )}
                    </div>

                    {/* Member Usage Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          usedPct > 85 ? "bg-red-500" : usedPct > 60 ? "bg-amber-500" : "bg-[#1D9E75]"
                        }`}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
