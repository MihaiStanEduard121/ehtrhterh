import React from "react";
import { Cookie, Info, ToggleLeft, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function CookiesPolicy() {
  return (
    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3 text-amber-400 mb-2">
          <Cookie size={28} />
          <span className="text-xs uppercase font-mono tracking-widest bg-amber-950/60 text-amber-400 px-2.5 py-1 rounded-md">
            Directiva ePrivacy & Cookie Consent
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Politică de Utilizare Cookie-uri
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Ultima actualizare: 26 Mai 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Intro */}
        <section className="space-y-3">
          <p>
            Această politică descrie modul în care platforma <strong>Timp Așteptare Giurgiu – Ruse</strong> utilizează cookie-urile și alte tehnologii similare (cum ar fi stocarea locală - <code>localStorage</code>) pentru a oferi utilizatorilor o experiență sigură, fiabilă și personalizată.
          </p>
          <p>
            Când vizitați prima dată site-ul nostru, vă oferim posibilitatea de a alege clar ce categorii de module cookie sunteți de acord să fie plasate în browserul dumneavoastră.
          </p>
        </section>

        {/* Co este un cookie */}
        <section className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Info size={16} className="text-cyan-400" />
            Ce este un modul cookie?
          </h3>
          <p className="text-slate-400 text-xs md:text-sm">
            Un cookie este un mic fișier de text, format din litere și cifre, care va fi stocat pe computerul, terminalul mobil sau alte echipamente ale unui utilizator de pe care se accesează Internetul. Cookie-urile sunt instalate prin solicitarea transmisă de către un web-server unui browser (ex: Chrome, Edge, Safari, Firefox) și sunt complet „pasive” (nu conțin programe software, viruși sau spyware și nu pot accesa informațiile de pe hard-driverul utilizatorului).
          </p>
        </section>

        {/* Categorii cookies */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ToggleLeft size={16} className="text-emerald-400" />
            Tipuri de cookie-uri pe care le utilizăm
          </h3>
          <p>
            Clasificăm tehnologiile în funcție de rolul lor esențial, analitic sau de promovare:
          </p>

          <div className="space-y-4">
            {/* Esentiale */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  1. Cookie-uri Necesare (Strict Esențiale)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded font-bold uppercase">ALWAYS ACTIVE</span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Aceste cookie-uri și valori locale sunt indispensabile pentru a asigura funcționarea tehnică primară a platformei. De exemplu, stochează limba preferată sau starea consimțământului dumneavoastră privind cookie-urile, astfel încât să nu vi se afișeze din noul ecranul de avertizare la fiecare refresh. Fără ele, platforma nu poate funcționa corect.
              </p>
            </div>

            {/* Analitice */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-cyan-500" />
                  2. Cookie-uri de Analiză și Performanță
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded font-bold uppercase">OPTIONAL</span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Folosite pentru Google Analytics. Ne ajută să înțelegem modurile în care colegii în trafic interacționează cu ecranele noastre (pagini vizitate cel mai des, tip de conexiune). Datele agregate ne permit să îmbunătățim layout-ul, viteza de încărcare și să determinăm orele cele mai solicitate pentru trecerea vămii.
              </p>
            </div>

            {/* Marketing */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-500" />
                  3. Cookie-uri de Publicitate și Targeting (Marketing)
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded font-bold uppercase">OPTIONAL</span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Utilizate de rețeaua publicitară parteneră Adcash. Rolul lor este de a aminti browserului dumneavoastră preferințele anterioare pentru a vă afișa reclame relevante și a diminua frecvența vizualizării acelorași imagini. Dezactivarea acestor cookies nu va elimina reclamele, însă acestea vor fi pur generice și irelevante.
              </p>
            </div>
          </div>
        </section>

        {/* Google Consent Mode v2 */}
        <section className="bg-cyan-950/20 border border-cyan-900/40 p-5 rounded-xl space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldAlert size={16} className="text-cyan-400" />
            Integrare Google Consent Mode v2
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            Aplicația noastră s-a aliniat standardelor impuse de Digital Markets Act (DMA) în Europa prin adoptarea integrală a protocolului <strong>Google Consent Mode v2</strong>. Ori de câte ori modificați opțiunile în bannerul de cookies, noi trimitem instrucțiunea corespunzătoare direct tag-urilor Google:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400 pl-2">
            <li><code>ad_storage</code> și <code>ad_user_data</code>: Controlează stocarea de publicitate și trimiterea datelor de utilizator la Google.</li>
            <li><code>ad_personalization</code>: Controlează posibilitatea de remarketing sau anunțuri personalizate.</li>
            <li><code>analytics_storage</code>: Activează sau dezactivează măsurătorile detaliate în Google Analytics.</li>
          </ul>
        </section>

        {/* Management Cookie-uri */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-sm inline-block" />
            Cum puteți refuza sau controla cookie-urile?
          </h3>
          <p>
            Puteți retrage sau modifica consimțământul acordat oricând folosind butonul <strong>„Administrare Preferințe Cookies”</strong> din footer.
          </p>
          <p>
            De asemenea, vă puteți configura browserul pentru a bloca complet sau a șterge modulele cookie stocate istoric:
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center mt-2">
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 hover:border-slate-700 text-xs font-mono text-cyan-400">Google Chrome</a>
            <a href="https://support.mozilla.org/ro/kb/sterge-cookies-pentru-a-elimina-informatiile" target="_blank" rel="noopener noreferrer" className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 hover:border-slate-700 text-xs font-mono text-cyan-400">Mozilla Firefox</a>
            <a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 hover:border-slate-700 text-xs font-mono text-cyan-400">Apple Safari</a>
            <a href="https://support.microsoft.com/ro-ro/microsoft-edge/ștergerea-modulelor-cookie-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 hover:border-slate-700 text-xs font-mono text-cyan-400">Microsoft Edge</a>
          </div>
        </section>
      </div>
    </div>
  );
}
