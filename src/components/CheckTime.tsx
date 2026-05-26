import { motion } from "motion/react";
import { Clock, AlertTriangle, CheckCircle, Flame, Truck, Car, Navigation2, ShieldCheck } from "lucide-react";
import { EtaInfo, TrafficStatus } from "../types";

interface CheckTimeProps {
  direction: "RO_BG" | "BG_RO";
  eta: EtaInfo;
  onlineCount: number;
}

export default function CheckTime({ direction, eta, onlineCount }: CheckTimeProps) {
  // Helpers to assign color styles based on TrafficStatus
  const getStatusStyles = (status: TrafficStatus) => {
    switch (status) {
      case "fluid":
        return {
          textColor: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
          shadowColor: "shadow-emerald-500/10",
          badgeColor: "bg-emerald-500/20 text-emerald-300",
          pulseColor: "bg-emerald-400",
          label: "FLUID",
          etaDesc: "Trecere rapidă, timp minim de control."
        };
      case "mediu":
        return {
          textColor: "text-amber-400",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20",
          shadowColor: "shadow-amber-500/10",
          badgeColor: "bg-amber-500/20 text-amber-300",
          pulseColor: "bg-amber-400",
          label: "MEDIU",
          etaDesc: "Cozi lejere în vama de frontieră."
        };
      case "aglomerat":
        return {
          textColor: "text-rose-400",
          bgColor: "bg-rose-500/10",
          borderColor: "border-rose-500/20",
          shadowColor: "shadow-rose-500/10",
          badgeColor: "bg-rose-500/20 text-rose-300",
          pulseColor: "bg-rose-400",
          label: "AGLOMERAT",
          etaDesc: "Timp crescut de așteptare, coloane active."
        };
    }
  };

  const carStyles = getStatusStyles(eta.carStatus);
  const truckStyles = getStatusStyles(eta.truckStatus);

  // Romania to Bulgaria vs Bulgaria to Romania metadata
  const details = direction === "RO_BG" 
    ? {
        start: "Giurgiu (RO)",
        end: "Ruse (BG)",
        fromFlag: "🇷🇴",
        toFlag: "🇧🇬",
        pestePod: "Sensul de deplasare spre Bulgaria transbordează taxa de pod în RON (la Giurgiu) sau online.",
        coordonate: "Punct vamal Giurgiu – Ruse I (Podul Prieteniei)"
      }
    : {
        start: "Ruse (BG)",
        end: "Giurgiu (RO)",
        fromFlag: "🇧🇬",
        toFlag: "🇷🇴",
        pestePod: "Sensul spre România percepe taxa în EUR/BGN la ghieșul Ruse înainte de traversare.",
        coordonate: "Punct vamal Ruse – Giurgiu I (Podul Prieteniei)"
      };

  return (
    <div id="check-time-tab" className="space-y-6">
      {/* Overview Bridge Section */}
      <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{details.fromFlag}</span>
              <span className="text-slate-400 font-mono text-xs tracking-wider">PUNCT FRONTIERĂ</span>
              <span className="text-xl">{details.toFlag}</span>
            </div>
            <h3 className="text-2xl font-bold font-sans tracking-tight text-slate-100 mt-1">
              {details.start} → {details.end}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Navigation2 size={13} className="text-slate-500 rotate-45" />
              {details.coordonate}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/45 border border-slate-700/50 rounded-xl px-4 py-2 text-xs text-slate-300 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{onlineCount} Șoferi Live acuma pe platformă</span>
          </div>
        </div>

        {/* Dynamic Vector Bridge Art with Visual Vehicles Flow */}
        <div className="mt-6 border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-mono">Simularea traficului pe Podul Prieteniei</p>
          <div className="h-20 bg-slate-950/70 border border-slate-800 rounded-xl relative flex items-center justify-between px-6 overflow-hidden">
            {/* Danube bridge structures background */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none flex items-center justify-around">
              <div className="border-l border-r border-t border-slate-100 h-14 w-24 rounded-t-lg" />
              <div className="border-l border-r border-t border-slate-100 h-14 w-24 rounded-t-lg" />
              <div className="border-l border-r border-t border-slate-100 h-14 w-24 rounded-t-lg" />
            </div>

            {/* River water bottom fill */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-cyan-950/20 border-t border-cyan-900/10 scroll-smooth" />

            {/* Left and Right custom border gates */}
            <div className="flex flex-col items-center justify-center z-10 text-center">
              <span className="text-sm font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-200">
                {direction === "RO_BG" ? "RO" : "BG"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Vamă</span>
            </div>

            {/* Visual Highway Lane & animated items flow */}
            <div className="flex-1 mx-4 h-1 bg-slate-800 rounded relative group">
              {/* Dynamic traveling dots indicating congestion */}
              <motion.div
                initial={{ left: direction === "RO_BG" ? "-10%" : "110%" }}
                animate={{ left: direction === "RO_BG" ? "110%" : "-10%" }}
                transition={{
                  repeat: Infinity,
                  duration: eta.carStatus === "aglomerat" ? 12 : eta.carStatus === "mediu" ? 7 : 4,
                  ease: "linear"
                }}
                className={`absolute -top-2 p-1 rounded-full text-xs shadow-md ${
                  eta.carStatus === "aglomerat" 
                    ? "bg-rose-500 text-white" 
                    : eta.carStatus === "mediu" 
                    ? "bg-amber-500 text-slate-900" 
                    : "bg-emerald-500 text-white"
                }`}
              >
                <Car size={12} />
              </motion.div>

              <motion.div
                initial={{ left: direction === "RO_BG" ? "-25%" : "125%" }}
                animate={{ left: direction === "RO_BG" ? "125%" : "-25%" }}
                transition={{
                  repeat: Infinity,
                  duration: eta.truckStatus === "aglomerat" ? 18 : eta.truckStatus === "mediu" ? 11 : 7,
                  ease: "linear",
                  delay: 2.5
                }}
                className={`absolute -top-2.5 p-1 rounded text-[10px] shadow-md ${
                  eta.truckStatus === "aglomerat" 
                    ? "bg-rose-600 text-white" 
                    : eta.truckStatus === "mediu" 
                    ? "bg-amber-500 text-slate-900" 
                    : "bg-emerald-500 text-white"
                }`}
              >
                <Truck size={12} />
              </motion.div>

              {/* Lane status stripe */}
              <div className={`absolute inset-x-0 bottom-0 h-1 rounded ${
                eta.carStatus === "aglomerat" 
                  ? "bg-red-500/50" 
                  : eta.carStatus === "mediu" 
                  ? "bg-amber-500/50" 
                  : "bg-emerald-500/50"
              }`} />
            </div>

            <div className="flex flex-col items-center justify-center z-10 text-center">
              <span className="text-sm font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-200">
                {direction === "RO_BG" ? "BG" : "RO"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wait Timers Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARS CARD */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-2xl border ${carStyles.borderColor} ${carStyles.shadowColor} border-t-4 p-6 shadow-lg flex flex-col justify-between`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl" />
          
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
                  <Car size={20} />
                </div>
                <h4 className="font-semibold text-slate-200">Autoturisme</h4>
              </div>
              <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full font-mono ${carStyles.badgeColor}`}>
                {carStyles.label}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className={`text-6xl font-extrabold tracking-tight font-sans ${carStyles.textColor}`}>
                {eta.carWaitMinutes}
              </span>
              <span className="text-xl font-medium text-slate-400">minute</span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={12} />
              <span>Timp mediu de trecere</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-1.5">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              {carStyles.etaDesc}
            </p>
          </div>
        </motion.div>

        {/* TRUCKS CARD */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-2xl border ${truckStyles.borderColor} ${truckStyles.shadowColor} border-t-4 p-6 shadow-lg flex flex-col justify-between`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl">
                  <Truck size={20} />
                </div>
                <h4 className="font-semibold text-slate-200">TIR / Camioane</h4>
              </div>
              <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full font-mono ${truckStyles.badgeColor}`}>
                {truckStyles.label}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className={`text-6xl font-extrabold tracking-tight font-sans ${truckStyles.textColor}`}>
                {eta.truckWaitMinutes}
              </span>
              <span className="text-xl font-medium text-slate-400">minute</span>
            </div>

            {/* Conver to hours for truck driver readability */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 justify-between">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Timp mediu de trecere
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500 uppercase">
                (~{(eta.truckWaitMinutes / 60).toFixed(1)} ore)
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-1.5">
              {eta.truckStatus === "aglomerat" ? (
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              )}
              {truckStyles.etaDesc}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Useful Alert Info Footer */}
      <div className="bg-slate-950/40 rounded-xl border border-slate-800/60 p-4 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck size={16} className="text-cyan-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">Informații adiționale Podul Prieteniei (Giurgiu-Ruse)</p>
          <p className="leading-relaxed">{details.pestePod}</p>
          <p className="text-[10px] text-slate-500">
            *Datele live se recalculează dinamic pe baza rapoartelor șoferilor aflați în tranzit combinat cu evoluția istorică din ultimii ani.
          </p>
        </div>
      </div>
    </div>
  );
}
