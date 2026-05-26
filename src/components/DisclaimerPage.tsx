import React from "react";
import { AlertTriangle, ShieldCheck, HeartHandshake, FileWarning } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3 text-red-400 mb-2">
          <AlertTriangle size={28} />
          <span className="text-xs uppercase font-mono tracking-widest bg-red-950/60 text-red-400 px-2.5 py-1 rounded-md">
            Declarație Exonerare Răspundere
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Disclaimer Legal & Informativ
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Ultima actualizare: 26 Mai 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Important Warning Alert Box */}
        <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl flex items-start gap-3">
          <FileWarning className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-200/90 font-mono leading-relaxed">
            ATENȚIE: Sursa datelor afișate pe acest site este 100% neoficială și bazată pe modele crowd-sourced. Această platformă nu este sponsorizată, asociată sau aprobată în vreun fel de Poliția de Frontieră Română ori Agenția Vamală din Bulgaria.
          </p>
        </div>

        {/* 1. Orientativ */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-sm inline-block" />
            1. Caracter pur informativ și orientativ
          </h3>
          <p>
            Informațiile privind timpul de așteptare exprimate în minute sau ore, precum și starea generală a traficului (fluid, mediu, aglomerat) sunt exclusiv estimări de probabilitate. 
          </p>
          <p>
            Traficul la frontieră se poate schimba radical în decurs de câteva minute din cauza unor factori imprevizibili precum: blocarea sistemelor IT vamale, controale amănunțite ale vehiculelor suspecte, greve de personal, accidente sau condiții meteo adverse. Prin urmare, cifrele noastre reprezintă o medie inteligentă calculată din ultimele raportări ale șoferilor și nu o certitudine matematică.
          </p>
        </section>

        {/* 2. No warranties */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-sm inline-block" />
            2. Absența completă a garanțiilor
          </h3>
          <p>
            Platforma este oferită „AȘA CUM ESTE” (As Is) și „AȘA CUM ESTE DISPONIBILĂ” (As Available). Nu garantăm în niciun fel că:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400 pl-2">
            <li>Aplicația va funcționa neîntrerupt, fără erori tehnice sau deconectări de bază de date.</li>
            <li>Informațiile sunt în totalitate 100% corecte și actuale în orice secundă.</li>
            <li>Algoritmul de prediciție a aglomerației viitoare va aproxima cu acuratețe de fiecare dată.</li>
          </ul>
        </section>

        {/* 3. Reclame*/}
        <section className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <HeartHandshake size={16} className="text-cyan-400" />
            Monetizare, Afiliere și Reclame Terțe
          </h3>
          <p className="text-slate-400 text-xs md:text-sm">
            Pentru a finanța cheltuielile lunare de infrastructură Cloud Run, hosting, stocare Firestore și certificate SSL necesare rulării platformei live în regim permanent, afișăm reclame prin <strong>Google AdSense</strong> și script-ul Anti-Adblock de la <strong>Adcash</strong>. 
          </p>
          <p className="text-slate-400 text-xs md:text-sm">
            Prezența unor reclame pe platformă nu reprezintă o recomandare sau o susținere directă a produselor sau serviciilor promoted de către sistemul terț de publicitate. Vizitatorii sunt singurii responsabili pentru interacțiunea lor cu bannerele publicitare.
          </p>
        </section>

        {/* 4. Contact oficial */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            Unde puteți găsi datele oficiale?
          </h3>
          <p>
            Dacă aveți transporturi sensibile, de mărfuri periculoase sau sunteți sub presiune de timp, vă recomandăm insistent să consultați paralel și resursele oficiale puse la dispoziție de autoritățile statului:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-cyan-400 pl-2 font-mono">
            <li>
              <a href="https://www.politiadefrontiera.ro/ro/traficonline/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Poliția de Frontieră Română - Trafic Online
              </a>
            </li>
            <li>
              <a href="https://customs.bg" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Inspectoratul Vamal Central din Bulgaria (Customs.bg)
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
