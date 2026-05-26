import { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react";
import { Direction, PlanningEstimation, TrafficStatus } from "../types";

interface PlannerProps {
  direction: Direction;
}

export default function Planner({ direction }: PlannerProps) {
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
  const [predictions, setPredictions] = useState<PlanningEstimation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/predictions?direction=${direction}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load planner data");
        return res.json();
      })
      .then((data: PlanningEstimation[]) => {
        setPredictions(data);
      })
      .catch((err) => console.error("Error loading planner recommendations:", err))
      .finally(() => setLoading(false));
  }, [direction]);

  // Find prediction for the selected hour
  const activePred = predictions.find((p) => {
    const hr = parseInt(p.hourStamp.split(":")[0]);
    return hr === selectedHour;
  }) || null;

  const getStatusColor = (status: TrafficStatus) => {
    switch (status) {
      case "fluid":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "mediu":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "aglomerat":
        return "text-rose-400 bg-rose-500/10 border-rose-500/12";
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { text: "Foarte Ridicată", style: "text-emerald-400" };
    if (score >= 70) return { text: "Ridicată", style: "text-cyan-400" };
    return { text: "Moderată (Estimare istorică)", style: "text-slate-400" };
  };

  const currentHourText = selectedHour < 10 ? `0${selectedHour}:00` : `${selectedHour}:00`;

  return (
    <div id="planner-tab" className="space-y-6">
      {/* Intro Slider */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />

        <div className="mb-6">
          <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calendar size={18} className="text-cyan-400" />
            Planificator Inteligent de Călătorie
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Alege ora la care dorești să traversezi granița Giurgiu - Ruse și vezi estimarea inteligentă calculated din rapoartele live și trendurile anuale.
          </p>
        </div>

        {/* Horizontal Hour Slots Selector */}
        <div className="space-y-2.5">
          <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest">
            Alege Ora de Plecare ({currentHourText})
          </label>
          
          <div className="flex gap-1.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {Array.from({ length: 24 }).map((_, h) => {
              const isActive = h === selectedHour;
              const formatted = `${h.toString().padStart(2, "0")}:00`;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedHour(h)}
                  className={`px-3 py-2 rounded-xl transition-all font-mono text-xs font-semibold shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-slate-200 text-slate-900 border border-slate-100 font-bold"
                      : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {formatted}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading || !activePred ? (
        <div className="h-44 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-center">
          <span className="text-slate-500 font-mono text-xs animate-pulse">Se computes analiza de predicție...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selected Hour Details */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800/80 pb-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full font-bold">
                PROGNOZĂ TRAFIC LA ORA {activePred.hourStamp}
              </span>
              <h5 className="text-slate-200 mt-2.5 font-sans font-semibold text-sm">Previziune estimată pe baza datelor curente</h5>
            </div>

            {/* Car & Truck predicted eta cards */}
            <div className="space-y-4">
              {/* Car */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">🚗 Autoturisme (Cars)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-100">{activePred.predictedCarMinutes}</span>
                    <span className="text-[10px] text-slate-500">minute</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded border font-mono uppercase ${getStatusColor(activePred.carStatus)}`}>
                  {activePred.carStatus}
                </span>
              </div>

              {/* Truck */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">🚛 Camioane (Trucks)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-100">{activePred.predictedTruckMinutes}</span>
                    <span className="text-[10px] text-slate-500">minute</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded border font-mono uppercase ${getStatusColor(activePred.truckStatus)}`}>
                  {activePred.truckStatus}
                </span>
              </div>
            </div>

            {/* Confidence metric */}
            <div className="bg-slate-950/30 p-4 border border-slate-800/60 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Acuratețe predicție model</span>
                <span className={`font-mono font-semibold ${getConfidenceLevel(activePred.confidenceScore).style}`}>
                  {getConfidenceLevel(activePred.confidenceScore).text} ({activePred.confidenceScore}%)
                </span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activePred.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tips for Selected hour */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h5 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                <Clock size={16} className="text-cyan-400" />
                Plan bun de drum?
              </h5>
              
              <div className="space-y-3.5 mt-2">
                {activePred.predictedCarMinutes <= 20 ? (
                  <div className="flex gap-2.5 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <p>
                      <strong>Alegere excelentă!</strong> La ora {activePred.hourStamp} controlul de documente decurge rapid spre ambele sensuri. Te poți aștepta la un timp minim de așteptare.
                    </p>
                  </div>
                ) : activePred.predictedCarMinutes <= 45 ? (
                  <div className="flex gap-2.5 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    <HelpCircle size={16} className="shrink-0 mt-0.5" />
                    <p>
                      <strong>Asigură timp tampon!</strong> La ora {activePred.hourStamp} pot apărea mici blocaje regulate pe pod sau aglomerări temporare la ghișeele de plată a taxei.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2.5 text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    <HelpCircle size={16} className="shrink-0 mt-0.5" />
                    <p>
                      <strong>Aglomerare ridicată!</strong> Îți recomandăm să deviezi deplasarea cu 2-3 ore mai târziu sau mai devreme dacă este posibil. Vei scuti peste 30 de minute de coadă în vama Giurgiu-Ruse.
                    </p>
                  </div>
                )}

                <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block">Comparație cu Baseline Istoric ({activePred.hourStamp}):</span>
                  <div className="flex justify-between font-mono">
                    <span>🚗 Turisme istoric:</span>
                    <span>{activePred.baseHistoricalCar} min</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>🚛 Camioane istoric:</span>
                    <span>{activePred.baseHistoricalTruck} min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono mt-4 leading-relaxed flex gap-1.5">
              <ShieldCheck size={13} className="text-slate-500 shrink-0 mt-0.5" />
              <span>*Predictive model incorporates active moving hour alerts to align historical data trends to instant weather/border states.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
