import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Send, MessageSquare, Shield, Building2, Clock, CheckCircle2, Paperclip, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LiveEvaluationChatProps {
  requestId?: number;
  requestTitle?: string;
  donorName?: string;
  nonprofitName?: string;
  isEmbedded?: boolean;
}

export default function LiveEvaluationChat({
  requestId = 1,
  requestTitle = "Multilingual Health Translation Agent Allocation",
  donorName = "Dr. Aris Thorne (Nexus DeepMind)",
  nonprofitName = "Elena Rostova (Community Health Net)",
  isEmbedded = false,
}: LiveEvaluationChatProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<"donor" | "nonprofit">("nonprofit");

  const { data: messages, refetch, isLoading } = trpc.collaboration.getThreadMessages.useQuery({
    requestId,
  });

  const sendMutation = trpc.collaboration.sendMessage.useMutation({
    onSuccess: () => {
      setInputMessage("");
      refetch();
      toast.success("Message sent to evaluation thread");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message");
    },
  });

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendMutation.mutate({
      requestId,
      senderId: currentUserRole === "donor" ? 1 : 2,
      senderName: currentUserRole === "donor" ? donorName : nonprofitName,
      senderRole: currentUserRole,
      content: inputMessage,
    });
  };

  const handleQuickTemplate = (text: string) => {
    setInputMessage(text);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col ${isEmbedded ? "h-full" : "min-h-[580px]"}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 rounded-t-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Live Evaluation Thread
            </span>
            <span className="text-xs text-gray-500">Request #{requestId}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 leading-snug">{requestTitle}</h3>
        </div>

        {/* Role Switcher for Interactive Demo */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-lg text-xs self-start sm:self-auto">
          <span className="text-[10px] text-gray-400 font-medium px-1">Active Persona:</span>
          <button
            onClick={() => setCurrentUserRole("nonprofit")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              currentUserRole === "nonprofit"
                ? "bg-[#1D9E75] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Non-Profit
          </button>
          <button
            onClick={() => setCurrentUserRole("donor")}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              currentUserRole === "donor"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Donor Reviewer
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F9FAF9]/40">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-xs">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading live messages...
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg: any) => {
            const isDonor = msg.senderRole === "donor";
            const isMyRole = msg.senderRole === currentUserRole;

            return (
              <div key={msg.id} className={`flex flex-col ${isMyRole ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-gray-500">
                  {isDonor ? (
                    <Shield className="w-3 h-3 text-purple-600" />
                  ) : (
                    <Building2 className="w-3 h-3 text-[#1D9E75]" />
                  )}
                  <span className="font-semibold text-gray-700">{msg.senderName}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div
                  className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isMyRole
                      ? isDonor
                        ? "bg-purple-700 text-white rounded-br-xs"
                        : "bg-[#1D9E75] text-white rounded-br-xs"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No messages yet. Send the first inquiry or clarification!
          </div>
        )}
      </div>

      {/* Quick Templates Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-gray-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Quick Replies:
        </span>
        {currentUserRole === "nonprofit" ? (
          <>
            <button
              onClick={() => handleQuickTemplate("Can we schedule a 15-minute onboarding sync with your technical mentor?")}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 truncate cursor-pointer"
            >
              Request Onboarding Sync
            </button>
            <button
              onClick={() => handleQuickTemplate("We have completed tablet hardware configuration and passed local safety testing.")}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 truncate cursor-pointer"
            >
              Confirm Readiness
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleQuickTemplate("Your capacity request is approved! We have provisioned your GPU cluster credentials.")}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 truncate cursor-pointer"
            >
              Approve Capacity
            </button>
            <button
              onClick={() => handleQuickTemplate("Could you clarify the expected weekly query volume across your 4 clinic sites?")}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 truncate cursor-pointer"
            >
              Ask Query Volume
            </button>
          </>
        )}
      </div>

      {/* Input Strip */}
      <div className="p-3 bg-white border-t border-gray-100 rounded-b-xl flex items-center gap-2">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder={`Message as ${currentUserRole === "donor" ? "Donor Reviewer" : "Non-Profit Requester"} (Press Enter to send)...`}
          className="flex-1 p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1D9E75] resize-none"
        />
        <button
          onClick={handleSend}
          disabled={sendMutation.isPending || !inputMessage.trim()}
          className={`p-2.5 rounded-lg text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer ${
            currentUserRole === "donor" ? "bg-purple-700 hover:bg-purple-800" : "bg-[#1D9E75] hover:bg-[#16815f]"
          }`}
        >
          {sendMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
