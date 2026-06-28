import { useState } from "react";
import { Send, Download, Copy, FileText, Lightbulb, Zap } from "lucide-react";

export default function GrantAssistant() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your AI-powered grant writing assistant. I can help you craft compelling grant applications tailored to your organization's needs. What would you like help with today?",
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

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on your organization's profile, here's a tailored grant proposal outline:\n\n1. Executive Summary - Clearly state your mission\n2. Problem Statement - Quantify the challenge\n3. Proposed Solution - Detail resource usage\n4. Impact Metrics - Define measurable outcomes\n5. Timeline - Implementation schedule\n\nWould you like me to develop any section?",
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
      name: "Healthcare AI Grant",
      description: "For healthcare organizations deploying AI solutions",
      icon: "🏥",
    },
    {
      name: "Environmental Data Grant",
      description: "For environmental organizations needing data resources",
      icon: "🌍",
    },
  ];

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-card border-b border-gray-300 py-8">
        <div className="container-page flex-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Grant Writing Assistant</h1>
            <p className="text-gray-700 mt-1">AI-powered help for crafting compelling grant applications</p>
          </div>
          <button className="btn btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Draft
          </button>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="card flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary text-white"
                          : "bg-sunken text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-sunken px-4 py-3 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2 pt-4 border-t border-gray-300">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask for help with your grant..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Templates
              </h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    className="card text-left hover:border-primary transition-all w-full"
                  >
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Drafts */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Recent Drafts
              </h3>
              <div className="space-y-2">
                <div className="card">
                  <p className="text-sm font-medium text-gray-900">Education Initiative Grant</p>
                  <p className="text-xs text-gray-500 mt-1">Updated 2 hours ago</p>
                  <div className="flex gap-2 mt-3">
                    <button className="btn btn-secondary btn-sm flex-1">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
