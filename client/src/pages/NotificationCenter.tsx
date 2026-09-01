import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Check, RefreshCw, Zap, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "approvals" | "matches">("all");

  const { data: serverNotifications, refetch, isLoading } = trpc.collaboration.getLiveNotifications.useQuery({
    userId: 1,
  });

  const [localNotifications, setLocalNotifications] = useState<any[]>([]);

  // Initialize or synchronize local state
  const notificationsList = localNotifications.length > 0 ? localNotifications : (serverNotifications || []);

  const unreadCount = notificationsList.filter((n: any) => !n.read).length;

  const filteredNotifications = notificationsList.filter((n: any) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "approvals") return n.type === "request_approved" || n.type === "message_received";
    if (activeTab === "matches") return n.type === "new_match";
    return true;
  });

  const handleMarkAsRead = (id: number) => {
    const next = notificationsList.map((n: any) => (n.id === id ? { ...n, read: true } : n));
    setLocalNotifications(next);
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    const next = notificationsList.map((n: any) => ({ ...n, read: true }));
    setLocalNotifications(next);
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: number) => {
    const next = notificationsList.filter((n: any) => n.id !== id);
    setLocalNotifications(next);
    toast.success("Notification dismissed");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "request_approved":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "message_received":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "new_match":
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1D9E75] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Real-Time Stream
              </span>
              <span className="text-xs text-gray-500">Live Activity & Telemetry</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
            <p className="text-xs text-gray-500">
              Real-time updates on resource request approvals, live chat messages, and semantic matchmaker alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Mark All Read
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: "all", label: "All Activity" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "approvals", label: "Approvals & Messages" },
            { id: "matches", label: "Matchmaker Alerts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#1D9E75] text-[#1D9E75]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400 text-xs">
            <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" /> Loading real-time alerts...
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notif: any) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 shadow-xs ${
                  notif.read ? "bg-white border-gray-200" : "bg-emerald-50/30 border-emerald-200 ring-1 ring-emerald-100"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                    <div className="text-[10px] text-gray-400 mt-1">{notif.timestamp || "Just now"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.actionUrl && (
                    <a
                      href={notif.actionUrl}
                      className="px-2.5 py-1 rounded bg-white hover:bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 inline-flex items-center gap-1 cursor-pointer"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1 text-gray-400 hover:text-emerald-700 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No notifications in this filter.
          </div>
        )}
      </div>
    </div>
  );
}
