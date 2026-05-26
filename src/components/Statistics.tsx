import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { BorderReport, Direction } from "../types";
import { TrendingUp, Clock, AlertTriangle, CheckCircle, BarChart3, HelpCircle } from "lucide-react";

interface StatisticsProps {
  direction: "RO_BG" | "BG_RO";
  recentReports: BorderReport[];
}

interface ChartHourSlot {
  ora: string;
  turisme: number;
  camioane: number;
}

export default function Statistics({ direction, recentReports }: StatisticsProps) {
  const [chartData, setChartData] = useState<ChartHourSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats summaries
  const [avgCar, setAvgCar] = useState(0);
  const [avgTruck, setAvgTruck] = useState(0);
  const [peakHours, setPeakHours] = useState("");
  const [minWaitCar, setMinWaitCar] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);

  useEffect(() => {
    // We can query the server's /api/predictions endpoint OR parse reports.
    // Query /api/predictions offers the most complete 24h dataset with seamless historical estimates.
    setLoading(true);
    fetch(`/api/predictions?direction=${direction}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load prediction calculations");
        return res.json();
      })
      .then((data: any[]) => {
        const slots: ChartHourSlot[] = data.map((item) => ({
          ora: item.hourStamp,
          turisme: item.predictedCarMinutes,
          camioane: item.predictedTruckMinutes
        }));
        setChartData(slots);

        // Compute averages and insights from predictions
        const cars = slots.map((s) => s.turisme);
        const trucks = slots.map((s) => s.camioane);
        
        const avgC = Math.round(cars.reduce((a, b) => a + b, 0) / cars.length);
        const avgT = Math.round(trucks.reduce((a, b) => a + b, 0) / trucks.length);
        
        setAvgCar(avgC);
        setAvgTruck(avgT);
        setMinWaitCar(Math.min(...cars));

        // Find peak hours
        // Peaks are hours where Car time is in top 20%
        const sortedWithHour = slots
          .map((s) => ({ hour: s.ora, val: s.turisme }))
          .sort((a, b) => b.val - a.val);
        const peakSlots = sortedWithHour.slice(0, 3).map((p) => p.hour.split(":")[0]);
        setPeakHours(`${peakSlots.join(":00, ")}:00`);

        // Total reports in last 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
        const directionReports = recentReports.filter(
          (r) => r.direction === direction && new Date(r.timestamp).getTime() > oneDayAgo
        );
        setTotalReportsCount(directionReports.length);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [direction, recentReports]);

  // Custom styling for tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3.5 rounded-xl shadow-xl text-xs space-y-1 font-sans">
          <p className="font-mono text-xs font-semibold text-slate-400">Ora: {label}</p>
          <p className="text-cyan-400 font-medium">🚗 Autoturisme: <span className="font-mono font-bold text-slate-100">{payload[0].value} min</span></p>
          {payload[1] && (
            <p className="text-violet-400 font-medium">🚛 Camioane: <span className="font-mono font-bold text-slate-100">{payload[1].value} min</span></p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="statistics-tab" className="space-y-6">
      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left relative overflow-hidden shadow-md">
          <p className="text-slate-500 font-mono text-[10px] tracking-wider uppercase">Medie Turisme</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-cyan-300 font-sans">{avgCar}</span>
            <span className="text-[11px] text-slate-500">min</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            <Clock size={10} className="text-slate-500" />
            <span>Pe ultimele 24 de ore</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left relative overflow-hidden shadow-md">
          <p className="text-slate-500 font-mono text-[10px] tracking-wider uppercase">Medie Camioane</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-violet-300 font-sans">{avgTruck}</span>
            <span className="text-[11px] text-slate-500">min</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <span>~{(avgTruck / 60).toFixed(1)} ore</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left relative overflow-hidden shadow-md">
          <p className="text-slate-500 font-mono text-[10px] tracking-wider uppercase">Ore de Vârf</p>
          <div className="mt-1.5 font-bold text-slate-200 text-xs tracking-tight line-clamp-1">
            {peakHours}
          </div>
          <div className="mt-2 text-[10px] text-rose-400 flex items-center gap-1">
            <TrendingUp size={10} />
            <span>Aglomerare maximă</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left relative overflow-hidden shadow-md">
          <p className="text-slate-500 font-mono text-[10px] tracking-wider uppercase text-slate-400">Rapoarte Recente</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-100 font-mono">{totalReportsCount}</span>
            <span className="text-[11px] text-slate-500">șoferi</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle size={10} />
            <span>Ultimul interval de 24h</span>
          </div>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
              <BarChart3 size={16} />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Grafic așteptare ultimele 24h</h4>
              <p className="text-[10px] text-slate-500 font-mono">Evoluția timpilor de tranzit pe intervale orare</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono font-medium">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 block" /> Autoturisme
            </span>
            <span className="flex items-center gap-1.5 text-violet-400">
              <span className="h-2 w-2 rounded-full bg-violet-400 block" /> Camioane
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-72 flex items-center justify-center">
            <span className="text-xs text-slate-500 font-mono animate-pulse">Se încarcă profilul statistic...</span>
          </div>
        ) : (
          <div className="h-72 w-full text-slate-300">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis 
                  dataKey="ora" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false}
                  dx={-5}
                  label={{ value: 'Minute', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="turisme" 
                  stroke="#22d3ee" 
                  strokeWidth={2.5} 
                  dot={false}
                  activeDot={{ r: 5, stroke: '#22d3ee', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="camioane" 
                  stroke="#a78bfa" 
                  strokeWidth={2.5} 
                  dot={false}
                  activeDot={{ r: 5, stroke: '#a78bfa', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Advice footer */}
      <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl text-xs text-slate-400 flex items-start gap-3">
        <HelpCircle size={16} className="text-cyan-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Sfat util de trafic:</strong> Pentru a evita ambuteiajele de pe pod, recomandăm demararea călătoriei în afara orelor de vârf semnalate în grafic. De obicei, intervalele 23:00 - 05:00 oferă cei mai buni timpi de traversare pentru toate tipurile de vehicule.
        </p>
      </div>
    </div>
  );
}
