import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, Settings, ShieldCheck, X, Check, ArrowRight, HelpCircle } from "lucide-react";

interface CookieConsentProps {
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export interface ConsentConfig {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export default function CookieConsent({ forceOpen = false, onCloseForceOpen }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  const [preferencesMode, setPreferencesMode] = useState(false);

  // Preference switches
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Check if consent has already been saved
    const savedConsent = localStorage.getItem("timp_vama_cookie_consent");
    if (savedConsent) {
      try {
        const parsed: ConsentConfig = JSON.parse(savedConsent);
        // Apply Gtag Update State
        updateGoogleConsent(parsed);
        
        if (forceOpen) {
          setAnalytics(parsed.analytics);
          setMarketing(parsed.marketing);
          setPreferencesMode(true);
          setVisible(true);
        }
      } catch (e) {
        setVisible(true);
      }
    } else {
      setVisible(true);
    }
  }, [forceOpen]);

  const updateGoogleConsent = (consent: ConsentConfig) => {
    try {
      const anyWindow = window as any;
      if (anyWindow.gtag) {
        anyWindow.gtag("consent", "update", {
          ad_storage: consent.marketing ? "granted" : "denied",
          ad_user_data: consent.marketing ? "granted" : "denied",
          ad_personalization: consent.marketing ? "granted" : "denied",
          analytics_storage: consent.analytics ? "granted" : "denied"
        });
        console.log("Adcash & Google Consent updated:", consent);
      } else {
        // Fallback dataLayer push if loaded asynchronously
        anyWindow.dataLayer = anyWindow.dataLayer || [];
        anyWindow.dataLayer.push({
          event: "consent_update",
          consent_states: {
            ad_storage: consent.marketing ? "granted" : "denied",
            ad_user_data: consent.marketing ? "granted" : "denied",
            ad_personalization: consent.marketing ? "granted" : "denied",
            analytics_storage: consent.analytics ? "granted text" : "denied"
          }
        });
      }
    } catch (e) {
      console.warn("Consent Mode execution error:", e);
    }
  };

  const handleAcceptAll = () => {
    const config: ConsentConfig = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    saveAndClose(config);
  };

  const handleRejectAll = () => {
    const config: ConsentConfig = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    saveAndClose(config);
  };

  const handleSaveSelected = () => {
    const config: ConsentConfig = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString()
    };
    saveAndClose(config);
  };

  const saveAndClose = (config: ConsentConfig) => {
    localStorage.setItem("timp_vama_cookie_consent", JSON.stringify(config));
    updateGoogleConsent(config);
    setVisible(false);
    setPreferencesMode(false);
    if (onCloseForceOpen) {
      onCloseForceOpen();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="cookie-consent-banner"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col gap-4 backdrop-blur-md"
        >
          {/* Main Consent Banner View */}
          {!preferencesMode ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                  <Cookie size={24} className="animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                    Respectăm intimitatea dumneavoastră!
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    Utilizăm cookie-uri proprii și tehnologii terțe (Adcash, Google Analytics) pentru a asigura buna operare tehnică a platformei de trecere a vămii Giurgiu-Ruse, a analiza audiența și a afișa mesaje publicitare relevante. Aveți libertatea de a vă alege preferințele de stocare conform GDPR.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
                <button
                  type="button"
                  onClick={() => setPreferencesMode(true)}
                  className="py-2 px-3 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Settings size={13} />
                  <span>Configurare</span>
                </button>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="py-2 px-3 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-900/30 transition-all cursor-pointer shrink-0"
                >
                  Refuză tot
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="py-2.5 px-4 rounded-lg text-xs font-bold text-[#0f172a] bg-slate-100 hover:bg-white transition-all shadow-md cursor-pointer shrink-0"
                >
                  Acceptă tot
                </button>
              </div>
            </div>
          ) : (
            // Advanced Customization Preferences Drawer Page
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 leading-none">
                  <ShieldCheck size={16} className="text-cyan-400" />
                  Administrare Preferințe Cookies (GDPR)
                </h4>
                <button
                  type="button"
                  onClick={() => setPreferencesMode(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Switches Container Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Necessary */}
                <div className="bg-slate-950/45 p-3.5 border border-slate-850 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Necesare</span>
                    <span className="text-[9px] font-bold text-emerald-450 bg-emerald-950/50 px-1.5 py-0.5 rounded uppercase">Activ</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Necesare securității, reținerii deciziilor și integrității datelor pe chat-ul Giurgiu-Ruse. Nu pot fi dezactivate.
                  </p>
                </div>

                {/* 2. Google Analytics */}
                <div className="bg-slate-955/45 p-3.5 border border-slate-850 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Analitice</span>
                    <button
                      type="button"
                      onClick={() => setAnalytics(!analytics)}
                      className={`h-5 w-9 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                        analytics ? "bg-cyan-500" : "bg-slate-800"
                      }`}
                    >
                      <span className={`h-4 w-4 bg-white rounded-full block transition-transform shadow ${
                        analytics ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Măsoară anonimizat tranzitul audienței prin Google Analytics pentru a ști orele cele mai active și a optimiza serverele.
                  </p>
                </div>

                {/* 3. Marketing Ads */}
                <div className="bg-slate-955/45 p-3.5 border border-slate-850 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Marketing</span>
                    <button
                      type="button"
                      onClick={() => setMarketing(!marketing)}
                      className={`h-5 w-9 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                        marketing ? "bg-amber-500" : "bg-slate-800"
                      }`}
                    >
                      <span className={`h-4 w-4 bg-white rounded-full block transition-transform shadow ${
                        marketing ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Afișează reclame prin rețeaua publicitară autorizată Adcash. Permite personalizarea anunțurilor conform intereselor dumneavoastră.
                  </p>
                </div>

              </div>

              {/* Selection footer menu */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                <span>Stare: Selectivă conform standardelor IAB și RGPD.</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferencesMode(false)}
                    className="py-1.5 px-3 border border-slate-800 rounded bg-slate-950 text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    Anulează
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSelected}
                    className="py-1.5 px-4 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Check size={11} />
                    <span>Salvează</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
