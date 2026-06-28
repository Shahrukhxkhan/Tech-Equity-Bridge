import { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Archive, Settings, Zap } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "match",
    title: "New Resource Match",
    message: "TechCorp Inc. has shared an AI agent that matches your needs",
    timestamp: "2 hours ago",
    read: false,
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "request",
    title: "Request Approved",
    message: "Your request for Cloud Computing Credits has been approved",
    timestamp: "1 day ago",
    read: false,
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "coalition",
    title: "Coalition Invitation",
    message: "You've been invited to join the Education Tech Alliance",
    timestamp: "3 days ago",
    read: true,
    icon: Info,
  },
  {
    id: 4,
    type: "impact",
    title: "Impact Milestone",
    message: "Congratulations! Your organization has reached 1,000 people impacted",
    timestamp: "1 week ago",
    read: true,
    icon: CheckCircle,
  },
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "matches") return n.type === "match";
    if (activeTab === "requests") return n.type === "request";
    return true;
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-8">
        <div className="container-page flex-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Notifications</h1>
            <p className="text-gray-700 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="btn btn-secondary">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </button>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "matches", label: "Matches" },
            { id: "requests", label: "Requests" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-all ${
                activeTab === tab.id ? "nav-pill-active" : "nav-pill-inactive"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="card text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`card flex items-start gap-4 ${
                    !notification.read ? "bg-primary-light border-primary" : ""
                  }`}
                >
                  <div className="flex-center w-10 h-10 rounded-lg bg-sunken flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="btn btn-ghost btn-sm"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="btn btn-ghost btn-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
