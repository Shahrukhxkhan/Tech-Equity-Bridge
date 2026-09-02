import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Bell, Plus, Trash2, Send, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, Zap, Globe } from "lucide-react";
import { toast } from "sonner";

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebhookSettingsModal({ isOpen, onClose }: WebhookSettingsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<"slack" | "discord" | "teams" | "generic">("slack");
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "RESOURCE_REQUEST_APPROVED",
    "NEW_HIGH_MATCH_RESOURCE",
  ]);

  const { data: webhooks, refetch, isLoading } = trpc.infrastructure.getWebhooks.useQuery(undefined, {
    enabled: isOpen,
  });

  const saveMutation = trpc.infrastructure.saveWebhook.useMutation({
    onSuccess: () => {
      setShowAddForm(false);
      setName("");
      setUrl("");
      refetch();
      toast.success("Webhook integration configured successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save webhook");
    },
  });

  const deleteMutation = trpc.infrastructure.deleteWebhook.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Webhook integration removed");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete webhook");
    },
  });

  const testMutation = trpc.infrastructure.testWebhook.useMutation({
    onSuccess: (data) => {
      toast.success(`Test payload delivered to ${data.platform.toUpperCase()} (${data.latencyMs}ms)`);
    },
    onError: (err) => {
      toast.error(err.message || "Webhook delivery test failed");
    },
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !url.trim()) {
      toast.error("Please provide both a name and webhook endpoint URL");
      return;
    }
    saveMutation.mutate({
      name,
      platform,
      url,
      enabledEvents: selectedEvents as any,
      isActive: true,
    });
  };

  const handleToggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const getPlatformBadge = (plat: string) => {
    switch (plat) {
      case "slack":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#4A154B]/10 text-[#4A154B]">Slack</span>;
      case "discord":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5865F2]/10 text-[#5865F2]">Discord</span>;
      case "teams":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6264A7]/10 text-[#6264A7]">MS Teams</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">HTTPS Webhook</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-600" /> Real-Time ChatOps
              </span>
              <span className="text-xs text-gray-500">Slack • Discord • Microsoft Teams</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Webhook Notification Integrations</h3>
          </div>

          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Webhooks List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" /> Loading configured endpoints...
            </div>
          ) : webhooks && webhooks.length > 0 ? (
            webhooks.map((hook: any) => (
              <div
                key={hook.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white transition-all space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900">{hook.name}</span>
                      {getPlatformBadge(hook.platform)}
                    </div>
                    <span className="text-[11px] font-mono text-gray-500 truncate block max-w-md">
                      {hook.url}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => testMutation.mutate({ platform: hook.platform, url: hook.url })}
                      disabled={testMutation.isPending}
                      className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-[#1D9E75]" /> Test
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate({ id: hook.id })}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Remove Webhook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-100">
                  {hook.enabledEvents?.map((ev: string) => (
                    <span key={ev} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 text-gray-600">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">No webhooks configured yet.</div>
          )}

          {/* Add New Webhook Form */}
          {showAddForm ? (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3 text-xs">
              <h4 className="font-bold text-gray-900">Configure New Outgoing Webhook</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Integration Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Slack #community-grants"
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                  >
                    <option value="slack">Slack Incoming Webhook</option>
                    <option value="discord">Discord Webhook</option>
                    <option value="teams">Microsoft Teams Connector</option>
                    <option value="generic">Generic HTTPS Endpoint</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Webhook Target URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.your-org.com/webhooks/listener"
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Triggering Events:</label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    { id: "RESOURCE_REQUEST_APPROVED", label: "Capacity Request Approved" },
                    { id: "NEW_HIGH_MATCH_RESOURCE", label: "95%+ Resource Match Alert" },
                    { id: "COALITION_MILESTONE_COMPLETED", label: "Coalition Milestone Completed" },
                    { id: "PLEDGE_UNDER_DELIVERY_ALERT", label: "Donor Pledge Remediation Alert" },
                  ].map((evt) => (
                    <label key={evt.id} className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(evt.id)}
                        onChange={() => handleToggleEvent(evt.id)}
                        className="accent-[#1D9E75]"
                      />
                      <span>{evt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Integration
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-xl border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer bg-white"
            >
              <Plus className="w-4 h-4" /> Add Webhook Channel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
