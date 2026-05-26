import React from "react";
import { Info, Users, Compass, Award, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3 text-[#10b981] mb-2">
          <Info size={28} />
          <span className="text-xs uppercase font-mono tracking-widest bg-emerald-950/60 text-[#10b981] px-2.5 py-1 rounded-md">
            Despre Proiect
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Despre Platforma Noastră
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Tranzit rapid, asistență reciprocă și date comunitare transparente.
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Pitch Mission */}
        <p className="text-base text-slate-200">
          <strong>Timp Așteptare Giurgiu – Ruse</strong> s-a născut din nevoia reală a participanților la trafic de a avea acces la informații oneste, proaspete și obiective legate de trecerea podului Prieteniei de la Giurgiu.
        </p>

        {/* Why this is critical */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Compass size={17} className="text-cyan-400" />
            Misiunea Noastră
          </h3>
          <p>
            Vama dintre Giurgiu și Ruse este una dintre cele mai tranzitate și mai dinamice puncte de trecere de la granița României. Şoferii de camioane (TIR-iști), autocarele cu turiști și familiile care călătoresc în concediu spre stațiunile din Bulgaria, Grecia sau Turcia petrec deseori ore bune în coloane interminabile.
          </p>
          <p>
            Platforma noastră își propune să schimbe acest lucru prin <strong>forța comunității (Crowdsourcing)</strong>. Prin adunarea datelor de la persoanele prezente în acel moment la controlul vamal, transformăm incertitudinea într-o estimare de încredere, ajutând șoferii să-și planifice opririle, rutele alternative și programul zilnic.
          </p>
        </section>

        {/* Dynamic Bento Box features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs md:text-sm">
              <Users className="text-cyan-400" size={16} />
              <span>Crowd Intelligence 100% Real</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Ori de câte ori un coleg în trafic trece de bariera de taxare sau de controlul de frontieră, el are ocazia să trimită timpul exact pe care l-a așteptat. Datele sunt agregate instantaneu în estimările din aplicație.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs md:text-sm">
              <Award className="text-emerald-400" size={16} />
              <span>Filtru Anti-Spam și Spike-uri</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Dezvoltăm constant formule matematice de ponderare exponențială. Rapoartele absurde sau false transmise cu scopul de a sabota datele sunt izolate automat de algoritmii noștri pentru a-ți asigura cifre exacte.
            </p>
          </div>
        </div>

        {/* Transparency details for Ads networks and AdSense */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            Transparență pentru utilizatori și rețele publicitare
          </h3>
          <p>
            Această platformă este gratuită, necomercială în sens strict, și nu colectează date cu caracter personal în afara preferințelor de vizualizare voluntare. Suntem devotați respectării reglementărilor Europene expuse în Directiva GDPR și colaborăm activ cu companii publicitare legitime precum Google pentru a oferi reclame controlate, sigure și neinvazive.
          </p>
          <p>
            Prin accesarea platformei, ne ajuți să menținem acest sistem live gratuit și pentru alți colegi români și bulgari aflați în tranzit. Îți mulțumim pentru sprijin!
          </p>
        </section>

        {/* Creator Note */}
        <div className="border-t border-slate-800 pt-5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            Realizat cu <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> de comunitatea șoferilor de pe pod.
          </span>
          <span className="font-mono">Versiune Aplicație v2.4.1</span>
        </div>
      </div>
    </div>
  );
}
