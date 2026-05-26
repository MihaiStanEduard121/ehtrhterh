import { useState } from "react";
import { BorderReport, VehicleType } from "../types";
import { Clock, Car, Truck, ArrowRightLeft, Calendar, Filter, HelpCircle } from "lucide-react";

interface ReportsHistoryProps {
  reports: BorderReport[];
  direction: "RO_BG" | "BG_RO";
}

type TimeFilter = "all" | "today" | "24h";
type VehicleFilter = "all" | "car" | "truck";

export default function ReportsHistory({ reports, direction }: ReportsHistoryProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  // Filter reports by active direction and selected filter arrays
  const filteredReports = reports.filter((r) => {
    // 1. Direction Filter
    if (r.direction !== direction) return false;

    // 2. Vehicle Filter
    if (vehicleFilter !== "all" && r.vehicleType !== vehicleFilter) return false;

    // 3. Time Filter
    const timeMs = new Date(r.timestamp).getTime();
    if (timeFilter === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      if (timeMs < todayStart.getTime()) return false;
    } else if (timeFilter === "24h") {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (timeMs < oneDayAgo) return false;
    }

    return true;
  });

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const ms = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(ms / 60000);
      if (mins < 1) return "Chiar acum";
      if (mins < 60) return `acum ${mins} min`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `acum ${hrs} ore`;
      const days = Math.floor(hrs / 24);
      return `acum ${days} zile`;
    } catch (e) {
      return "";
    }
  };

  // Convert minutes to readable hour values
  const getReadableMinutes = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ""}`;
  };

  return (
    <div id="reports-history-tab" className="space-y-6">
      {/* Filtering Header Card */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Filter size={15} />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Filtrează Rapoarte</h4>
            <p className="text-[10px] text-slate-500 font-mono">Sortează rapoartele live trimise de colegii din trafic</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Selector */}
          <div className="flex bg-slate-950/80 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                timeFilter === "all" ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Toate
            </button>
            <button
              onClick={() => setTimeFilter("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                timeFilter === "today" ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Azi
            </button>
            <button
              onClick={() => setTimeFilter("24h")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                timeFilter === "24h" ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Ultimul 24h
            </button>
          </div>

          {/* Vehicle Selector */}
          <div className="flex bg-slate-950/80 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setVehicleFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                vehicleFilter === "all" ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Vehicule
            </button>
            <button
              onClick={() => setVehicleFilter("car")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                vehicleFilter === "car" ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Autoturisme
            </button>
            <button
              onClick={() => setVehicleFilter("truck")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                vehicleFilter === "truck" ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Camioane
            </button>
          </div>
        </div>
      </div>

      {/* Reports List Wrapper */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Clock size={36} className="text-slate-600 mx-auto animate-pulse" />
            <p className="text-sm font-semibold text-slate-300">Niciun raport înregistrat</p>
            <p className="text-xs text-slate-500">
              Nu s-au găsit rapoarte active pentru selecțiile curente de filtrare pe acest sens de mers.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all gap-4"
              >
                {/* Vehicle type & timing icon */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    report.vehicleType === "car" 
                      ? "bg-cyan-500/10 text-cyan-400" 
                      : "bg-violet-500/10 text-violet-400"
                  }`}>
                    {report.vehicleType === "car" ? <Car size={16} /> : <Truck size={16} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {report.vehicleType === "car" ? "Autoturism" : "TIR / Camion"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium bg-slate-950/60 border border-slate-850 px-2 py-0.5 rounded-full uppercase">
                        {getRelativeTime(report.timestamp)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      ID Raport: {report.id} • Anonim
                    </span>
                  </div>
                </div>

                {/* Duration report value */}
                <div className="text-right flex items-center gap-3">
                  <div className="space-y-0.5">
                    <span className={`text-lg font-bold font-mono ${
                      report.vehicleType === "car" 
                        ? report.minutes <= 24 ? "text-emerald-400" : report.minutes <= 45 ? "text-amber-400" : "text-rose-400"
                        : report.minutes <= 90 ? "text-emerald-400" : report.minutes <= 210 ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {getReadableMinutes(report.minutes)}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block tracking-wider">TIMP RAPORTAT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Counter notice */}
      <div className="text-right text-[10px] text-slate-500 font-mono">
        Se afișează {filteredReports.length} rapoarte din baza de date locală pe sensul de mers curent.
      </div>
    </div>
  );
}
