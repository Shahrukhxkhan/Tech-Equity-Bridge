import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Download, Copy, Zap, FileText, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function GrantAssistant() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your AI-powered grant writing assistant. I can help you craft compelling grant applications tailored to your organization's needs and the resources you're seeking. What would you like help with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on your organization's profile and the resources you're seeking, here's a tailored grant proposal outline:\n\n1. **Executive Summary**: Clearly state your mission and the specific need\n2. **Problem Statement**: Quantify the challenge with data\n3. **Proposed Solution**: Detail how the resources will be used\n4. **Impact Metrics**: Define measurable outcomes\n5. **Timeline**: Provide implementation schedule\n\nWould you like me to help you develop any of these sections?",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const templates = [
    {
      name: "Education Technology Grant",
      description: "For organizations seeking tech resources for educational initiatives",
      icon: "📚",
    },
    {
      name: "Healthcare AI Deployment",
      description: "For healthcare non-profits implementing AI solutions",
      icon: "🏥",
    },
    {
      name: "Environmental Data Initiative",
      description: "For environmental organizations needing data and analytics tools",
      icon: "🌍",
    },
    {
      name: "Social Services Technology",
      description: "For social service organizations improving service delivery with tech",
      icon: "🤝",
    },
  ];

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
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Grant Writing Assistant</h2>
          <p className="text-muted-foreground">
            AI-powered help crafting compelling grant applications and resource requests
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="card-elegant h-96 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Grant Writing Chat
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-secondary/10 text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/10 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <Separator />
              <div className="p-4 flex gap-2">
                <Textarea
                  placeholder="Ask for help with your grant..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-12 resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="btn-elegant-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full btn-elegant-outline justify-start gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  New Draft
                </Button>
                <Button className="w-full btn-elegant-outline justify-start gap-2 text-sm">
                  <Copy className="w-4 h-4" />
                  Load Template
                </Button>
                <Button className="w-full btn-elegant-outline justify-start gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Export as PDF
                </Button>
              </CardContent>
            </Card>

            {/* Recent Drafts */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Recent Drafts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-2">
                  <div className="p-2 rounded border border-border hover:bg-secondary/5 cursor-pointer transition">
                    <p className="font-medium text-sm">Education Initiative Grant</p>
                    <p className="text-xs text-muted-foreground">Modified 2 days ago</p>
                  </div>
                  <div className="p-2 rounded border border-border hover:bg-secondary/5 cursor-pointer transition">
                    <p className="font-medium text-sm">Healthcare AI Proposal</p>
                    <p className="text-xs text-muted-foreground">Modified 1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Templates Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Grant Templates</h3>
            <p className="text-muted-foreground text-sm">
              Start with a template tailored to your sector and needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card key={template.name} className="card-elegant hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full btn-elegant-outline text-sm py-2">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="card-elegant bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Grant Writing Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Be Specific</h4>
              <p className="text-sm text-muted-foreground">
                Clearly define the problem, your solution, and expected outcomes with concrete metrics
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Show Impact</h4>
              <p className="text-sm text-muted-foreground">
                Demonstrate how the resources will create measurable social impact and reach
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Tell Your Story</h4>
              <p className="text-sm text-muted-foreground">
                Share compelling narratives about your organization and the communities you serve
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
