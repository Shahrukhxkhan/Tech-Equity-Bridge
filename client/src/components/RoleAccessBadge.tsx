import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Shield, ChevronDown, Check, UserCheck, Crown, Activity, Users, FileText, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function RoleAccessBadge() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: currentRole, refetch } = trpc.iam.getCurrentRole.useQuery();

  const switchMutation = trpc.iam.switchRole.useMutation({
    onSuccess: (data) => {
      setIsOpen(false);
      refetch();
      toast.success(`Switched active enterprise persona to ${data.roleTitle}`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to switch persona");
    },
  });

  const roles = [
    {
      id: "csr_executive",
      label: "CSR Executive",
      icon: Crown,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      desc: "ESG certificates, CSR reports, tax write-offs",
    },
    {
      id: "sla_auditor",
      label: "SLA Benchmark Auditor",
      icon: Activity,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      desc: "Technical SLA probes, latency tests, GPU endpoints",
    },
    {
      id: "coalition_lead",
      label: "Coalition Lead",
      icon: Users,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      desc: "Shared compute pool quotas, milestone roadmaps",
    },
    {
      id: "grant_navigator",
      label: "Non-Profit Grant Navigator",
      icon: FileText,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      desc: "RFP autofill proposals, A2A negotiations",
    },
    {
      id: "public_auditor",
      label: "Public / Financial Auditor",
      icon: Search,
      color: "text-slate-700 bg-slate-100 border-slate-300",
      desc: "Read-only immutable cryptographic audit ledgers",
    },
  ];

  const activeRoleObj = roles.find((r) => r.id === currentRole?.role) || roles[0];
  const IconComponent = activeRoleObj.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer ${activeRoleObj.color}`}
      >
        <IconComponent className="w-3.5 h-3.5 shrink-0" />
        <span>{activeRoleObj.label}</span>
        <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 border-b border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">
              Switch Enterprise Persona (RBAC)
            </span>
            <p className="text-[11px] text-gray-500">
              Dynamically simulates access permissions across platform engines.
            </p>
          </div>

          {roles.map((r) => {
            const isSelected = r.id === currentRole?.role;
            const ItemIcon = r.icon;

            return (
              <button
                key={r.id}
                onClick={() => switchMutation.mutate({ role: r.id as any })}
                className={`w-full p-2 rounded-lg text-left transition-all flex items-start justify-between cursor-pointer ${
                  isSelected ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <ItemIcon className="w-3.5 h-3.5 mt-0.5 text-gray-600 shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium leading-tight">{r.label}</div>
                    <div className="text-[10px] text-gray-400 leading-snug mt-0.5">{r.desc}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />}
              </button>
            );
          })}

          <div className="pt-1.5 border-t border-gray-100">
            <a
              href="/iam"
              className="w-full py-1.5 px-2 text-center text-purple-700 hover:text-purple-900 font-semibold text-[11px] block"
            >
              Open Enterprise IAM Console ➔
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
