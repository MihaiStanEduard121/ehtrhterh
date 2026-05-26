import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  MessageSquare, 
  MapPin, 
  ChevronRight, 
  Activity, 
  RefreshCw, 
  AlertCircle,
  BarChart3,
  Calendar,
  History,
  CheckCircle,
  HelpCircle,
  ArrowRightLeft,
  Shield,
  Cookie,
  Scale,
  AlertTriangle,
  Info,
  Mail,
  ArrowLeft
} from "lucide-react";

import { BorderReport, ChatMessage, Direction, EtaInfo, LiveStats } from "./types";
import CheckTime from "./components/CheckTime";
import LiveChat from "./components/LiveChat";
import ReportTime from "./components/ReportTime";
import Statistics from "./components/Statistics";
import Planner from "./components/Planner";
import ReportsHistory from "./components/ReportsHistory";

// Legal & Compliance Imports
import PrivacyPolicy from "./components/PrivacyPolicy";
import CookiesPolicy from "./components/CookiesPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import DisclaimerPage from "./components/DisclaimerPage";
import AboutUs from "./components/AboutUs";
import ContactPage from "./components/ContactPage";
import CookieConsent from "./components/CookieConsent";

interface LiveToast {
  id: string;
  type: "chat" | "report";
  text: string;
  author?: string;
}

export default function App() {
  const [direction, setDirection] = useState<Direction>("RO_BG");
  const [activeTab, setActiveTab] = useState<string>("chat"); // Default active is Chat Live as requested
  const [cookieConsentForceOpen, setCookieConsentForceOpen] = useState(false);
  
  // Realtime engine statistics state
  const [onlineCount, setOnlineCount] = useState<number>(100);
  const [recentReports, setRecentReports] = useState<BorderReport[]>([]);
  const [etaRO_BG, setEtaRO_BG] = useState<EtaInfo>({
    direction: "RO_BG",
    carWaitMinutes: 15,
    truckWaitMinutes: 120,
    carStatus: "fluid",
    truckStatus: "mediu",
    totalReports24h: 15,
    lastUpdated: new Date().toISOString()
  });
  const [etaBG_RO, setEtaBG_RO] = useState<EtaInfo>({
    direction: "BG_RO",
    carWaitMinutes: 15,
    truckWaitMinutes: 125,
    carStatus: "fluid",
    truckStatus: "mediu",
    totalReports24h: 18,
    lastUpdated: new Date().toISOString()
  });

  // UI status update timers
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  
  // Dynamic sliding overlay toasts
  const [toasts, setToasts] = useState<LiveToast[]>([]);

  // 1. Fetch live status on load
  const fetchStatus = () => {
    fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch live status");
        return res.json();
      })
      .then((data: LiveStats) => {
        setOnlineCount(data.onlineCount);
        setEtaRO_BG(data.etaRO_BG);
        setEtaBG_RO(data.etaBG_RO);
        setRecentReports(data.recentReports);
        setSecondsSinceUpdate(0);
      })
      .catch((err) => console.error("Error fetching live status:", err));
  };

  useEffect(() => {
    fetchStatus();
    
    // Auto pull backup timer every 20 seconds to guarantee consistency
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  // 2. Setup Server-Sent Events (SSE) stream listener for 100% actual real-time synced experiences
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onopen = () => {
      console.log("Realtime event sync channel active!");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "user-count") {
          setOnlineCount(data.onlineCount);
        } else if (data.type === "chat") {
          // Add a temporary slide Toast for incoming driver feedback
          const chatMsg = data.message as ChatMessage;
          // Trigger toast alert
          triggerToast({
            id: `toast_chat_${Date.now()}_${Math.random()}`,
            type: "chat",
            author: chatMsg.username,
            text: chatMsg.text
          });
        } else if (data.type === "report") {
          const report = data.report as BorderReport;
          // Refresh list and local calculations
          setEtaRO_BG(data.etaRO_BG);
          setEtaBG_RO(data.etaBG_RO);
          setRecentReports((prev) => [report, ...prev].slice(0, 50));
          setSecondsSinceUpdate(0);

          // Trigger report toast alert
          const readableMins = report.minutes >= 60 
            ? `${Math.floor(report.minutes / 60)}h ${report.minutes % 60 > 0 ? `${report.minutes % 60}m` : ""}` 
            : `${report.minutes} min`;
          triggerToast({
            id: `toast_rep_${Date.now()}_${Math.random()}`,
            type: "report",
            text: `Coleg în trafic raportat: ${readableMins} la ${report.vehicleType === "car" ? "Autoturisme" : "Camioane"} (${report.direction === "RO_BG" ? "RO→BG" : "BG→RO"})`
          });
        }
      } catch (err) {
        // parsing error
      }
    };

    eventSource.onerror = () => {
      // Automatic reconnection is handled by browser EventSource
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Update counter timer "Actualizat în X sec..."
  useEffect(() => {
    const elapsedInterval = setInterval(() => {
      setSecondsSinceUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(elapsedInterval);
  }, []);

  const triggerToast = (toast: LiveToast) => {
    setToasts((prev) => [...prev, toast]);
    // Dismiss automatically after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 4500);
  };

  const handleManualRefresh = () => {
    fetchStatus();
    triggerToast({
      id: `toast_refresh_${Date.now()}`,
      type: "report",
      text: "Datele live au fost reîmprospătate cu succes de pe server."
    });
  };

  // Callback from ReportTime to instantly refresh parent
  const handleReportSubmitted = (newReport: BorderReport) => {
    fetchStatus();
  };

  const activeEta = direction === "RO_BG" ? etaRO_BG : etaBG_RO;

  const currentDirectionLabel = direction === "RO_BG" ? "România 🇷🇴 → Bulgaria 🇧🇬" : "Bulgaria 🇧🇬 → România 🇷🇴";

  // List of Tab Items exactly matching specifications
  const tabItems = [
    { id: "chat", label: "Chat Live", icon: MessageSquare },
    { id: "check", label: "Verifică Timpul", icon: Clock },
    { id: "report", label: "Raportează Timpul", icon: Activity },
    { id: "stats", label: "Statistici", icon: BarChart3 },
    { id: "planner", label: "Planificator", icon: Calendar },
    { id: "history", label: "Istoric Rapoarte", icon: History }
  ];

  return (
    <div className="min-h-screen bg-[#060b19] selection:bg-cyan-500 selection:text-slate-900 pb-16">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.04),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.05),transparent_50%)]" />

      {/* DYNAMIC TOP-RIGHT LIVE TOAST OVERLAYS */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none space-y-2.5 max-w-[320px] sm:max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl flex items-start gap-3 backdrop-blur-md"
            >
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                toast.type === "chat" ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"
              }`}>
                {toast.type === "chat" ? <MessageSquare size={14} /> : <AlertCircle size={14} />}
              </div>
              <div className="space-y-0.5">
                {toast.author && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                    {toast.author} (Coleg)
                  </span>
                )}
                <p className="text-xs text-slate-300 leading-normal line-clamp-2">
                  {toast.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CORE CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        
        {/* HEADER SECTION */}
        <header id="main-header" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">BORDER LIVE MONITOR</span>
            </div>
            
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white mt-1.5 font-sans">
              Timp Așteptare Giurgiu – Ruse
            </h1>
            
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin size={12} className="text-slate-500" />
              <span>Trecerea graniței de la Giurgiu la Ruse</span> • 
              <span className="font-semibold text-cyan-400"> {currentDirectionLabel}</span>
            </p>
          </div>

          {/* Actualizat counter widget on the upper right */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button 
              onClick={handleManualRefresh}
              className="p-2 border border-slate-850 bg-slate-950/40 rounded-lg hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Reîmprospătează manual"
            >
              <RefreshCw size={14} className="hover:rotate-45 transition-transform" />
            </button>

            <div className="text-right bg-slate-950/60 border border-slate-850 rounded-xl px-3.5 py-1.5 font-mono text-xs shadow-inner shrink-0">
              <span className="text-slate-500 font-medium text-[10px] block uppercase tracking-wider">REÎMPROSPĂTARE</span>
              <span className="text-slate-300 font-semibold block mt-0.5">
                Actualizat acum {secondsSinceUpdate} sec
              </span>
            </div>
          </div>
        </header>

        {/* DIRECTION SEGMENTED CONTROLLER (RO_BG vs BG_RO) */}
        <div id="direction-segmented" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-1.5 flex gap-2.5 max-w-lg mx-auto shadow-lg relative">
          <button
            type="button"
            onClick={() => {
              setDirection("RO_BG");
              triggerToast({
                id: `dir_chg_${Date.now()}`,
                type: "report",
                text: "S-a comutat pe sensul de mers România 🇷🇴 către Bulgaria 🇧🇬"
              });
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
              direction === "RO_BG"
                ? "bg-slate-100 text-[#0f172a] font-extrabold shadow-md transform scale-[1.01]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🇷🇴 RO</span>
            <ChevronRight size={12} className={direction === "RO_BG" ? "text-cyan-600" : "text-slate-600"} />
            <span>🇧🇬 BG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDirection("BG_RO");
              triggerToast({
                id: `dir_chg_${Date.now()}`,
                type: "report",
                text: "S-a comutat pe sensul de mers Bulgaria 🇧🇬 către România 🇷🇴"
              });
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
              direction === "BG_RO"
                ? "bg-slate-100 text-[#0f172a] font-extrabold shadow-md transform scale-[1.01]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🇧🇬 BG</span>
            <ChevronRight size={12} className={direction === "BG_RO" ? "text-cyan-600" : "text-slate-600"} />
            <span>🇷🇴 RO</span>
          </button>
        </div>

        {/* NAVIGATION TAB BAR SYSTEM */}
        <nav id="navbar-tabs" className="border-b border-slate-800 pb-1 overflow-x-auto scrollbar-none flex gap-1 bg-slate-950/30 p-1 rounded-xl">
          {tabItems.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 shadow-md shadow-cyan-900/5 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <IconComponent size={14} className={isActive ? "text-cyan-300 animate-pulse" : "text-slate-500"} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* CONTAINER FOR TAB VIEW SCREEN */}
        {["privacy", "cookies", "terms", "disclaimer", "about", "contact"].includes(activeTab) && (
          <div className="mb-4 flex items-center justify-between bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Ești pe o pagină legală / asistență.</span>
            </div>
            <button
              onClick={() => setActiveTab("chat")}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-900/35 transition-all"
            >
              <ArrowLeft size={13} />
              <span>Înapoi la monitorizare live</span>
            </button>
          </div>
        )}

        {/* CONTAINER FOR TAB VIEW SCREEN */}
        <main className="min-h-[460px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}_${direction}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeTab === "chat" && (
                <LiveChat direction={direction} onlineCount={onlineCount} />
              )}
              {activeTab === "check" && (
                <CheckTime direction={direction} eta={activeEta} onlineCount={onlineCount} />
              )}
              {activeTab === "report" && (
                <ReportTime direction={direction} onReportSubmitted={handleReportSubmitted} />
              )}
              {activeTab === "stats" && (
                <Statistics direction={direction} recentReports={recentReports} />
              )}
              {activeTab === "planner" && (
                <Planner direction={direction} />
              )}
              {activeTab === "history" && (
                <ReportsHistory reports={recentReports} direction={direction} />
              )}
              {activeTab === "privacy" && (
                <PrivacyPolicy />
              )}
              {activeTab === "cookies" && (
                <CookiesPolicy />
              )}
              {activeTab === "terms" && (
                <TermsAndConditions />
              )}
              {activeTab === "disclaimer" && (
                <DisclaimerPage />
              )}
              {activeTab === "about" && (
                <AboutUs />
              )}
              {activeTab === "contact" && (
                <ContactPage />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* APP FOOTER DETAILS */}
        <footer className="pt-10 border-t border-slate-900 flex flex-col gap-6 text-xs text-slate-500 pb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Mission / Logo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Timp Așteptare Giurgiu - Ruse</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Monitorizare în timp real bazată pe rapoarte din rândul șoferilor de camioane și autoturisme. O platformă independentă de asistență rutieră la trecerea frontierei.
              </p>
            </div>

            {/* Compliance Links */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono block">Pagini Legale</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button 
                  onClick={() => setActiveTab("privacy")} 
                  className={`hover:text-cyan-400 cursor-pointer text-left ${activeTab === "privacy" ? "text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Politică Confidențialitate
                </button>
                <button 
                  onClick={() => setActiveTab("cookies")} 
                  className={`hover:text-cyan-400 cursor-pointer text-left ${activeTab === "cookies" ? "text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Politică Cookies
                </button>
                <button 
                  onClick={() => setActiveTab("terms")} 
                  className={`hover:text-cyan-400 cursor-pointer text-left ${activeTab === "terms" ? "text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Termeni și Condiții
                </button>
                <button 
                  onClick={() => setActiveTab("disclaimer")} 
                  className={`hover:text-cyan-400 cursor-pointer text-left ${activeTab === "disclaimer" ? "text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Disclaimer / Declarație
                </button>
              </div>
            </div>

            {/* Support Links */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono block font-mono">Comunitate & Ads</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button 
                  onClick={() => setActiveTab("about")} 
                  className={`hover:text-cyan-400 cursor-pointer text-left ${activeTab === "about" ? "text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Despre Noi
                </button>
                <button 
                  onClick={() => setActiveTab("contact")} 
                  className={`hover:text-cyan-400 cursor-pointer text-left ${activeTab === "contact" ? "text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Contact Form
                </button>
                <button 
                  onClick={() => setCookieConsentForceOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer text-left flex items-center gap-1"
                >
                  <Cookie size={11} className="animate-pulse" />
                  <span>Preferințe Cookies</span>
                </button>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  LIVE SYSTEM
                </span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
            <span>© 2026 Giurgiu-Ruse Live Traffic reports. Toate drepturile rezervate.</span>
            <div className="flex items-center gap-2">
              <span>Aliniat GDPR & ePrivacy</span>
              <span>•</span>
              <span>Optim pentru Google AdSense</span>
            </div>
          </div>

        </footer>

        {/* Global Cookie Consent System Floating overlay */}
        <CookieConsent 
          forceOpen={cookieConsentForceOpen} 
          onCloseForceOpen={() => setCookieConsentForceOpen(false)} 
        />

      </div>
    </div>
  );
}
