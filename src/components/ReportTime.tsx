import React, { useState, useEffect } from "react";
import { Clock, Truck, Car, Navigation, ShieldAlert, Award, ChevronRight } from "lucide-react";
import { BorderReport, Direction, VehicleType } from "../types";

interface ReportTimeProps {
  direction: "RO_BG" | "BG_RO";
  onReportSubmitted: (report: BorderReport) => void;
}

export default function ReportTime({ direction, onReportSubmitted }: ReportTimeProps) {
  const [minutes, setMinutes] = useState<number>(15);
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockSecondsLeft, setBlockSecondsLeft] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Load remaining block time from local storage if existing
  useEffect(() => {
    const checkBlock = () => {
      const lastReportTimes = localStorage.getItem(`gr_last_report_${direction}_${vehicleType}`);
      if (lastReportTimes) {
        const diff = Date.now() - parseInt(lastReportTimes);
        if (diff < 120000) {
          // Less than 2 minutes
          const secondsLeft = Math.ceil((120000 - diff) / 1000);
          setBlockSecondsLeft(secondsLeft);
        } else {
          setBlockSecondsLeft(0);
        }
      } else {
        setBlockSecondsLeft(0);
      }
    };

    checkBlock();
    const interval = setInterval(checkBlock, 1000);
    return () => clearInterval(interval);
  }, [direction, vehicleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blockSecondsLeft > 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorText(null);
    setSuccessInfo(null);

    let savedUserId = localStorage.getItem("gr_user_id");
    if (!savedUserId) {
      savedUserId = `usr_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("gr_user_id", savedUserId);
    }

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minutes,
          vehicleType,
          direction,
          userId: savedUserId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "A apărut o eroare la salvare.");
      }

      const resJson = await response.json();
      
      // Save last report timestamp for anti-spam check
      localStorage.setItem(`gr_last_report_${direction}_${vehicleType}`, Date.now().toString());
      setSuccessInfo(`Raport trimis cu succes! Timp înregistrat: ${minutes} min.`);
      onReportSubmitted(resJson.report);
    } catch (err: any) {
      setErrorText(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset fast updates
  const setQuickValue = (val: number) => {
    setMinutes(val);
  };

  const adjustMinutes = (delta: number) => {
    setMinutes(prev => Math.max(1, Math.min(600, prev + delta)));
  };

  const currentPresetChoices = vehicleType === "car" 
    ? [10, 15, 20, 30, 45, 60] 
    : [60, 90, 120, 180, 240, 360];

  return (
    <div id="report-time-tab" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="mb-6">
        <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Award size={18} className="text-amber-400" />
          Raportează timpul tău de așteptare
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Ajută comunitatea de șoferi! Raportul tău va actualiza în mod direct media timpilor de așteptare live la graniță.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DIRECTION CONFIRMATION BANNER */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400 uppercase font-mono text-[10px] tracking-wider">Direcție activă:</span>
            <span className="font-semibold text-cyan-400">
              {direction === "RO_BG" ? "🇷🇴 România → 🇧🇬 Bulgaria" : "🇧🇬 Bulgaria → 🇷🇴 România"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 italic">*Schimbă din toggle de sus, dacă e greșit</span>
        </div>

        {/* VEHICLE TYPE SELECTOR */}
        <div>
          <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Tipul de vehicul
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setVehicleType("car")}
              className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                vehicleType === "car"
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/5"
                  : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              <Car size={18} />
              <div className="text-left">
                <span className="block font-semibold">Autoturism</span>
                <span className="block text-[10px] font-normal text-slate-500">Turism, SUV, Moto</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVehicleType("truck")}
              className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                vehicleType === "truck"
                  ? "bg-violet-500/10 border-violet-500 text-violet-300 shadow-md shadow-violet-500/5"
                  : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              <Truck size={18} />
              <div className="text-left">
                <span className="block font-semibold">TIR / Camion</span>
                <span className="block text-[10px] font-normal text-slate-500">Marfă, Autotractoare</span>
              </div>
            </button>
          </div>
        </div>

        {/* MINUTES DISPLAY & ESTIMATION */}
        <div>
          <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Timp estimat de așteptare
          </label>
          
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => adjustMinutes(-5)}
                className="w-10 h-10 rounded-full border border-slate-850 hover:border-slate-700 hover:bg-slate-850 text-slate-300 font-bold transition-colors cursor-pointer text-lg flex items-center justify-center"
              >
                -
              </button>

              <div className="min-w-32">
                <div className="text-4xl font-extrabold text-slate-100 font-mono tracking-tight">
                  {minutes}
                </div>
                <div className="text-xs text-slate-500 font-medium font-sans mt-0.5">MINUTES WAITING</div>
              </div>

              <button
                type="button"
                onClick={() => adjustMinutes(5)}
                className="w-10 h-10 rounded-full border border-slate-850 hover:border-slate-700 hover:bg-slate-850 text-slate-300 font-bold transition-colors cursor-pointer text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Slider with step of 5 */}
            <input
              type="range"
              min={1}
              max={vehicleType === "car" ? 180 : 480}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />

            {/* QUICK PRESETS CHOICE BUTTONS */}
            <div>
              <p className="text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-wide">Selectare rapidă</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {currentPresetChoices.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQuickValue(val)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                      minutes === val
                        ? "bg-slate-200 border-slate-100 text-slate-900"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {val >= 60 ? `${Math.floor(val/60)}h ${val%60 > 0 ? `${val%60}m` : ""}` : `${val} min`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK STATUS INDICATORS */}
        {errorText && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 rounded-xl p-3.5 flex items-start gap-2.5 font-sans leading-relaxed">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{errorText}</span>
          </div>
        )}

        {successInfo && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 rounded-xl p-3.5 flex items-start gap-2.5 font-sans leading-relaxed">
            <span>✅ {successInfo}</span>
          </div>
        )}

        {/* ACTION SUBMIT BUTTON WITH ANTI SPAM BLOCK COUNTDOWN */}
        <div>
          {blockSecondsLeft > 0 ? (
            <button
              type="button"
              disabled
              className="w-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold py-3.5 rounded-xl cursor-not-allowed text-center space-y-1 block font-mono"
            >
              <span className="block uppercase tracking-wider font-semibold">Te-ai grăbit! Păstrează cooldown-ul</span>
              <span className="block text-[11px] font-normal text-slate-500">Poți raporta din nou peste {blockSecondsLeft} secunde.</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-100 hover:bg-white text-slate-900 font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-white/5 disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs text-center cursor-pointer uppercase tracking-wider"
            >
              Transmitere raport vamă
              <ChevronRight size={14} />
            </button>
          )}
          <p className="text-[10px] text-slate-500 font-mono text-center mt-3 leading-relaxed">
            *Rapoartele false sau rău intenționate sunt filtrate automat de algoritmul nostru de spike detection.
          </p>
        </div>
      </form>
    </div>
  );
}
