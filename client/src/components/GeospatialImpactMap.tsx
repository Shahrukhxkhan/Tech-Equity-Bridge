import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { MapPin, Globe, Users, Cpu, ShieldCheck, Sparkles, Filter, Building2, CheckCircle2, RefreshCw } from "lucide-react";

interface GeospatialImpactMapProps {
  onSelectProject?: (project: any) => void;
}

export default function GeospatialImpactMap({ onSelectProject }: GeospatialImpactMapProps) {
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<any | null>(null);

  const { data: projects, isLoading } = trpc.analytics.getGeospatialProjects.useQuery();

  const filteredProjects = projects?.filter((p: any) => {
    const matchSector = selectedSector === "All" || p.sector === selectedSector;
    const matchCategory = selectedCategory === "All" || p.resourceCategory === selectedCategory;
    return matchSector && matchCategory;
  }) || [];

  const totalBeneficiaries = filteredProjects.reduce((sum: number, p: any) => sum + p.beneficiariesServed, 0);

  // Map lat/lng roughly to SVG coordinate space for continental US
  // lat: ~25 to ~50 (Y axis inverted), lng: ~-125 to ~-65 (X axis)
  const getSvgCoords = (lat: number, lng: number) => {
    const x = ((lng - (-125)) / ((-65) - (-125))) * 780 + 30;
    const y = ((50 - lat) / (50 - 25)) * 380 + 30;
    return { x: Math.max(30, Math.min(810, x)), y: Math.max(30, Math.min(410, y)) };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI Agents":
        return "#1D9E75";
      case "GPU Compute":
        return "#8B5CF6";
      case "Data & GIS":
        return "#3B82F6";
      default:
        return "#F59E0B";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden space-y-5 p-5 sm:p-6">
      {/* Top Controls & Metrics Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#1D9E75]" /> Geospatial Telemetry
            </span>
            <span className="text-xs text-gray-500">Regional Impact Nodes</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Interactive Non-Profit Deployment Map</h3>
        </div>

        {/* Aggregate Counter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100 text-center">
            <div className="text-[10px] text-gray-500 font-medium">Active Deployment Hubs</div>
            <div className="text-sm font-bold text-gray-900">{filteredProjects.length} Cities</div>
          </div>
          <div className="bg-emerald-50/60 px-3.5 py-1.5 rounded-xl border border-emerald-100 text-center">
            <div className="text-[10px] text-emerald-800 font-medium">Residents Impacted</div>
            <div className="text-sm font-bold text-[#1D9E75]">{totalBeneficiaries.toLocaleString()}+</div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Sector filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-gray-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Sector:
          </span>
          {["All", "Healthcare", "Education", "Transit & GIS", "Food Security", "Digital Inclusion"].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedSector === sec
                  ? "bg-[#1D9E75] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Category legend */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" /> AI Agents
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> GPU Compute
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Data & GIS
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Tools
          </span>
        </div>
      </div>

      {/* Interactive Map Visualizer Canvas/SVG */}
      <div className="relative bg-[#0F172A] rounded-xl overflow-hidden border border-gray-800 h-[420px] shadow-inner">
        {/* Map Grid Background Texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Continental US SVG Schematic Silhouette */}
        <svg viewBox="0 0 850 450" className="w-full h-full">
          {/* Stylized US Outline Path */}
          <path
            d="M 60 110 Q 150 100 240 105 Q 350 110 440 90 Q 560 70 680 80 Q 770 90 810 130 Q 820 180 770 230 Q 750 280 740 330 Q 700 370 630 360 Q 520 370 420 360 Q 320 380 230 350 Q 140 340 80 270 Q 50 200 60 110 Z"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Regional Connection Mesh lines between major hubs */}
          <line x1="80" y1="180" x2="280" y2="300" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="280" y1="300" x2="480" y2="150" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="480" y1="150" x2="720" y2="130" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="480" y1="150" x2="560" y2="280" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

          {/* Project Node Pins */}
          {filteredProjects.map((project: any) => {
            const { x, y } = getSvgCoords(project.coordinates[0], project.coordinates[1]);
            const isSelected = activeProject?.id === project.id;
            const color = getCategoryColor(project.resourceCategory);

            return (
              <g
                key={project.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => {
                  setActiveProject(project);
                  if (onSelectProject) onSelectProject(project);
                }}
              >
                {/* Radar pulse ping */}
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill={color}
                  opacity="0.25"
                  className="animate-ping"
                  style={{ animationDuration: "2.5s" }}
                />
                {/* Node Outer Ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "9" : "7"}
                  fill="#0F172A"
                  stroke={color}
                  strokeWidth={isSelected ? "3" : "2"}
                />
                {/* Node Center Core */}
                <circle cx={x} cy={y} r="4" fill={color} />

                {/* City Label */}
                <text
                  x={x}
                  y={y + 18}
                  fill="#94A3B8"
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight="600"
                  className="select-none pointer-events-none drop-shadow-md"
                >
                  {project.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Project Interactive Floating Card */}
        {activeProject && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-xl p-4 text-white shadow-2xl space-y-2 z-10">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D9E75]">
                  {activeProject.city}, {activeProject.state} • {activeProject.sector}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">{activeProject.projectName}</h4>
                <p className="text-xs text-slate-400">{activeProject.organizationName}</p>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
              {activeProject.impactHighlight}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-300">
              <div className="bg-slate-800/80 p-2 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Beneficiaries</span>
                <span className="font-bold text-emerald-400">{activeProject.beneficiariesServed.toLocaleString()}+</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Primary Donor</span>
                <span className="font-bold text-purple-300 truncate block">{activeProject.primaryDonor}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
