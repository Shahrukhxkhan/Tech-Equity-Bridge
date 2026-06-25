import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Archive, Settings, Zap } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "match",
    title: "New Resource Match",
    message: "TechCorp Inc. has shared an AI agent that matches your organization's needs",
    timestamp: "2 hours ago",
    read: false,
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "request",
    title: "Request Approved",
    message: "Your request for Cloud Computing Credits has been approved by CloudServices Ltd.",
    timestamp: "1 day ago",
    read: false,
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "coalition",
    title: "Coalition Invitation",
    message: "You've been invited to join the Education Tech Alliance coalition",
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
  {
    id: 5,
    type: "message",
    title: "New Message",
    message: "Global Education Initiative sent you a message about resource implementation",
    timestamp: "1 week ago",
    read: true,
    icon: Info,
  },
];

export default function NotificationCenter() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container-responsive flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Tech-Equity Bridge</h1>
          </div>
          <Button className="btn-elegant-outline">Sign In</Button>
        </div>
      </header>

      <div className="container-responsive py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="w-8 h-8" />
              Notification Center
            </h2>
            <p className="text-muted-foreground">
              Stay updated on matches, requests, coalitions, and platform activity
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-elegant-outline gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Notifications */}
          <div className="lg:col-span-3 space-y-4">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  All
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="coalitions">Coalitions</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {NOTIFICATIONS.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <Card
                      key={notification.id}
                      className={`card-elegant cursor-pointer hover:shadow-md transition-all ${
                        !notification.read ? "border-primary/30 bg-primary/5" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="matches" className="space-y-3">
                {NOTIFICATIONS.filter((n) => n.type === "match").map((notification) => (
                  <Card key={notification.id} className="card-elegant">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="requests" className="space-y-3">
                {NOTIFICATIONS.filter((n) => n.type === "request").map((notification) => (
                  <Card key={notification.id} className="card-elegant">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="coalitions" className="space-y-3">
                {NOTIFICATIONS.filter((n) => n.type === "coalition").map((notification) => (
                  <Card key={notification.id} className="card-elegant">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Info className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="impact" className="space-y-3">
                {NOTIFICATIONS.filter((n) => n.type === "impact").map((notification) => (
                  <Card key={notification.id} className="card-elegant">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Notification Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{NOTIFICATIONS.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>New matches</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Request updates</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Coalition invites</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Impact milestones</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Email notifications</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full btn-elegant-outline justify-start gap-2 text-sm">
                <Archive className="w-4 h-4" />
                Archive All
              </Button>
              <Button className="w-full btn-elegant-outline justify-start gap-2 text-sm">
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
