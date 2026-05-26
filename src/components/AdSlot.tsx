import React, { useEffect, useState } from "react";
import { ExternalLink, ShieldAlert, BadgeInfo } from "lucide-react";

interface AdSlotProps {
  id: string; // Internal identifier
  zoneId?: string; // Optioanal Adcash zone ID for this specific banner slot
  placement: "top-leaderboard" | "bottom-leaderboard" | "sidebar" | "infeed";
  className?: string;
}

/**
 * AdSlot is a dedicated component optimized exclusively for ADCASH.
 * It provides responsive container placeholders with exact structural heights:
 * - Top & Bottom Leaderboard: 90px to 100px (standard leaderboard space)
 * - Sidebar: 250px to 300px (standard rectangle space)
 * - Infeed Chat/Lists: 105px (standard banner space)
 * 
 * Ensures no content layout shifts (CLS) and integrates with Adcash manual banner calls (runBanner).
 */
export default function AdSlot({ id, zoneId, placement, className = "" }: AdSlotProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adBlockedOrFailed, setAdBlockedOrFailed] = useState(false);

  // Dynamic initialization for Adcash Manual Banners
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    
    // If the developer provided a specific Adcash Zone ID, we attempt to initialize it via aclib.runBanner
    if (zoneId) {
      let attempts = 0;
      const tryInitAdcash = () => {
        const win = window as any;
        if (win.aclib && typeof win.aclib.runBanner === "function") {
          try {
            // Check if container already contains something to avoid duplicate runs
            const container = document.getElementById(`ac_container_${zoneId || id}`);
            if (container && !container.hasChildNodes()) {
              win.aclib.runBanner({
                zoneId: zoneId,
                containerId: `ac_container_${zoneId || id}`
              });
              setAdLoaded(true);
              setAdBlockedOrFailed(false);
            }
          } catch (e) {
            console.warn("Failed to initialize Adcash zone banner:", e);
            setAdBlockedOrFailed(true);
          }
        } else {
          attempts++;
          // If Adcash script is blocked by an ad-blocker or did not load after 10 attempts
          if (attempts > 8) {
            setAdBlockedOrFailed(true);
            clearInterval(checkInterval);
          }
        }
      };

      checkInterval = setInterval(tryInitAdcash, 600);
      tryInitAdcash(); // Run immediately on mount
    } else {
      // By default without custom zoneId, show beautiful custom community ads in Adcash style
      setAdBlockedOrFailed(true);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [id, zoneId]);

  // Specific CSS classes to maintain perfect spacing
  const getResponsiveSizes = () => {
    switch (placement) {
      case "top-leaderboard":
        return "min-h-[90px] sm:min-h-[100px] w-full max-w-4xl mx-auto my-3";
      case "bottom-leaderboard":
        return "min-h-[90px] w-full max-w-4xl mx-auto my-4";
      case "sidebar":
        return "min-h-[250px] w-full md:w-[300px] shrink-0 my-2";
      case "infeed":
        return "min-h-[105px] w-full my-3";
      default:
        return "min-h-[95px] w-full";
    }
  };

  // Pre-configured premium backup ads themed around travel / vama / transport / currency exchange
  const adcashBackups = {
    "top-leaderboard": {
      title: "Publicitate prin Adcash și Direct",
      desc: "Zeci de mii de vizitatori zilnic pe ruta vamală Giurgiu - Ruse. Perfect pentru asigurări, benzinării și servicii auto.",
      cta: "Contact Promovare",
      link: "?tab=contact",
      tag: "ADCASH DIRECT"
    },
    "bottom-leaderboard": {
      title: "Tari Românești & Bulgărești de Asigurări & Tractări?",
      desc: "Plasează-ți bannerul aici pentru a fi văzut de toți șoferii care trec podul Prieteniei.",
      cta: "Închiriază Slot",
      link: "?tab=contact",
      tag: "ANUNȚ PREMIUM"
    },
    "sidebar": {
      title: "Case Schimb, Restaurante & Pensiuni",
      desc: "Vrei ca afacerea ta din Giurgiu sau Ruse să fie listată ca punct de interes promovat în rândul șoferilor de tir și autoturisme?",
      cta: "Bannere Directe",
      link: "?tab=contact",
      tag: "VĂMEȘTI PROMO"
    },
    "infeed": {
      title: "Asigură-te că ai vinieta completată corect!",
      desc: "Verifică validitatea înainte de a trece pe teritoriul Bulgariei pentru a evita amenzile la intrarea în vamă.",
      cta: "Detalii Utile",
      link: "?tab=planner",
      tag: "RECOMANDARE"
    }
  };

  const currentBanner = adcashBackups[placement];

  return (
    <div 
      className={`relative bg-slate-950/60 border border-slate-850/70 rounded-xl overflow-hidden shadow-md flex flex-col justify-center items-center p-3 text-center transition-all ${getResponsiveSizes()} ${className}`}
      id={`ad-wrapper-${id}`}
    >
      {/* Policy Compliant Label strictly for Adcash Network Rules */}
      <div className="absolute top-1 left-2.5 flex items-center gap-1.5 text-[8.5px] font-extrabold text-slate-500 uppercase tracking-widest pointer-events-none font-mono">
        <span className="h-1.5 w-1.5 bg-amber-500 rounded-full inline-block animate-pulse" />
        <span>Reclamă Adcash / Sponsorizat</span>
      </div>

      <div className="absolute top-1 right-2.5 flex items-center gap-1 text-[8px] font-mono text-slate-500 pointer-events-none">
        <span>Zone ID: {zoneId || "Autotag Live"}</span>
      </div>

      {zoneId && !adBlockedOrFailed ? (
        /* LIVE ADCASH BANNER CONTAINER TARGET */
        <div className="w-full h-full flex items-center justify-center py-2">
          <div id={`ac_container_${zoneId || id}`} className="mx-auto w-full flex justify-center items-center" />
        </div>
      ) : (
        /* PROFESSIONAL HIGH-CONVERTING ALTERNATIVE / FALLBACK BANNER WHEN SCRIPT IS BLOCK-DETECTOR RE-ENFORCED */
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-4 text-left px-2 sm:px-4 py-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-slate-800 text-amber-400 font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wide">
                {currentBanner.tag}
              </span>
              <span className="text-xs font-bold text-slate-200">
                {currentBanner.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-2xl leading-normal">
              {currentBanner.desc}
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-1">
            <a
              href={currentBanner.link}
              className="text-[10px] font-bold text-amber-400 bg-amber-950/25 border border-amber-900/40 hover:bg-amber-950/40 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-inner"
            >
              <span>{currentBanner.cta}</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
