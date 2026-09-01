import { useState } from "react";
import { Zap, Shield, Award, Crown, CheckCircle2, ChevronDown, ChevronUp, Sparkles, ArrowRight, Play } from "lucide-react";

interface SemanticMatchCardProps {
  match: {
    resourceId: number;
    resourceTitle: string;
    resourceCategory: string;
    donorName: string;
    donorTier: string;
    overallScore: number;
    dimensions: {
      missionAlignment: number;
      capabilityFit: number;
      sectorRelevance: number;
      capacityMatch: number;
    };
    synergyRationale: string;
    suggestedUseCases: string[];
  };
  onRequest?: (resourceId: number, title: string) => void;
  onLaunchSandbox?: (resourceId: number, title: string, category: string) => void;
}

export default function SemanticMatchCard({ match, onRequest, onLaunchSandbox }: SemanticMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "founding_partner":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Crown className="w-3 h-3 mr-1 text-amber-500" /> Founding Partner
          </span>
        );
      case "equity_champion":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Award className="w-3 h-3 mr-1 text-purple-600" /> Equity Champion
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Shield className="w-3 h-3 mr-1 text-[#1D9E75]" /> Impact Ally
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-gray-100 text-gray-700">
              {match.resourceCategory}
            </span>
            {getTierBadge(match.donorTier)}
          </div>
          <h3 className="text-base font-semibold text-gray-900 leading-snug">
            {match.resourceTitle}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Offered by {match.donorName}</p>
        </div>

        {/* Big Overall Match Score Ring */}
        <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-100 px-3.5 py-2 rounded-xl shrink-0">
          <div className="text-right">
            <div className="text-xs text-emerald-800 font-medium">Semantic Match</div>
            <div className="text-[10px] text-emerald-600">v2 Vector Engine</div>
          </div>
          <div className="text-2xl font-bold text-[#1D9E75]">{match.overallScore}%</div>
        </div>
      </div>

      {/* 4-Dimensional Breakdown Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-gray-50/80 border border-gray-100 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1 text-gray-600">
            <span className="text-[11px] font-medium">Mission Fit</span>
            <span className="font-semibold text-gray-900">{match.dimensions.missionAlignment}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#1D9E75] h-1.5 rounded-full" style={{ width: `${match.dimensions.missionAlignment}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-gray-600">
            <span className="text-[11px] font-medium">Skill Fit</span>
            <span className="font-semibold text-gray-900">{match.dimensions.capabilityFit}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${match.dimensions.capabilityFit}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-gray-600">
            <span className="text-[11px] font-medium">Sector Relevance</span>
            <span className="font-semibold text-gray-900">{match.dimensions.sectorRelevance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${match.dimensions.sectorRelevance}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-gray-600">
            <span className="text-[11px] font-medium">Capacity Match</span>
            <span className="font-semibold text-gray-900">{match.dimensions.capacityMatch}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${match.dimensions.capacityMatch}%` }} />
          </div>
        </div>
      </div>

      {/* AI Synergy Rationale Banner */}
      <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs text-gray-700 space-y-1">
        <div className="font-semibold text-[#1D9E75] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> AI Synergy Insight
        </div>
        <p className="leading-relaxed text-gray-600">{match.synergyRationale}</p>
      </div>

      {/* Collapsible Details */}
      {isExpanded && (
        <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
          <div className="font-medium text-gray-800">Recommended Organizational Use Cases:</div>
          <ul className="space-y-1 text-gray-600">
            {match.suggestedUseCases?.map((useCase, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Action Strip */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-900 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <>
              Hide details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Why is this a match? <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {onLaunchSandbox && (
            <button
              onClick={() => onLaunchSandbox(match.resourceId, match.resourceTitle, match.resourceCategory)}
              className="py-1.5 px-3 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" /> Test in Sandbox
            </button>
          )}

          {onRequest && (
            <button
              onClick={() => onRequest(match.resourceId, match.resourceTitle)}
              className="py-1.5 px-3 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Request Capacity <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
