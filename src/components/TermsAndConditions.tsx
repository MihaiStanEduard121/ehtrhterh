import React from "react";
import { FileText, Scale, Gavel, ShieldAlert } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3 text-emerald-400 mb-2">
          <Scale size={28} />
          <span className="text-xs uppercase font-mono tracking-widest bg-emerald-950/65 text-emerald-400 px-2.5 py-1 rounded-md">
            Acord Legal Utilizatori
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Termeni și Condiții de Utilizare
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Ultima actualizare: 26 Mai 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Intro */}
        <section className="space-y-3">
          <p>
            Vă rugăm să citiți cu atenție acești Termeni și Condiții înainte de a utiliza platforma independentă <strong>Timp Așteptare Giurgiu – Ruse</strong> (numită în continuare „Aplicația”, „Platforma” sau „Site-ul”). Accessul și utilizarea serviciilor indică acceptul dumneavoastră necondiționat față de acești termeni.
          </p>
          <p>
            Dacă nu sunteți de acord cu acești termeni, aveți obligația de a înceta imediat utilizarea acestui site.
          </p>
        </section>

        {/* REGULI MARE SIGURANTA IN TRAFIC */}
        <section className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-xl space-y-3">
          <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-400" />
            ⚠️ REGULĂ CRITICALĂ DE SIGURANȚĂ RUTIERĂ
          </h3>
          <p className="text-rose-200/90 text-xs md:text-sm">
            <strong>ESTE STRICT INTERZISĂ</strong> utilizarea, citirea sau scrierea pe chat-ul live ori trimiterea rapoartelor de către șofer în timp ce vehiculul se află în mișcare și șoferul ține telefonul în mână. 
          </p>
          <p className="text-xs text-rose-300/85">
            Interacțiunea cu platforma trebuie făcută EXCLUSIV atunci când vehiculul este parcat în siguranță, staționat cu motorul oprit în coloana de la vamă, sau prin intermediul unui pasager din dreapta. Siguranța dumneavoastră și a celorlalți participanți la trafic primează!
          </p>
        </section>

        {/* 1. Scop si Servicii */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            1. Scopul și Natura Serviciilor noastre
          </h3>
          <p>
            Platforma oferă o soluție colaborativă de tip crowd-sourced pentru estimarea timpului de așteptare la punctul de trecere a frontierei Giurgiu (România) - Ruse (Bulgaria), pe ambele sensuri de mers.
          </p>
          <p>
            Datele în timp real (estimate) sunt calculate matematic printr-un algoritm care combină rapoartele voluntare transmise de colegii din trafic, datele din discuțiile pe chat și tendințele istorice. <strong>Aceste cifre și statusuri au caracter orientativ</strong> și nu se pot substitui datelor oficiale comunicate de Poliția de Frontieră sau Administrația Vamală.
          </p>
        </section>

        {/* 2. Limitarea raspunderii */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            2. Limitarea Răspunderii
          </h3>
          <p>
            Operatorii site-ului depun eforturi constante pentru asigurarea corectitudinii algoritmilor și deparazitarea rapoartelor false prin filtre ponderate de spam. Totuși, sub nicio formă platforma și dezvoltatorii săi nu pot fi trași la răspundere pentru:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-450 pl-2">
            <li>Diferențe dintre timpul estimat pe site și timpul real petrecut în vamă.</li>
            <li>Amenzi, întârzieri în programul de transport de marfă sau pierderea unor curse aeriene ori trenuri cauzate de aglomerație.</li>
            <li>Orice daune materiale sau vătămări produse în caz de nerespectare a regulilor de siguranță la volan.</li>
            <li>Întreruperea temporară a serverelor datorată conexiunilor mobile precare în zona de frontieră.</li>
          </ul>
        </section>

        {/* 3. Conduita pe Chat */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            3. Conduita Utilizatorilor și Dreptul de Moderare
          </h3>
          <p>
            Chatul live este un spațiu de ajutor reciproc adresat șoferilor profesioniști (TIR/Camioane) și turiștilor. Trimiterea de mesaje implică obligația de a menține un limbaj civilizat.
          </p>
          <p className="text-slate-405 font-medium">
            Sunt strict interzise:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
            <li>Limbajul jignitor, obscen ori xenofob adus colegilor sau autorităților vamale.</li>
            <li>Spamul de publicitate, promovarea grupurilor comerciale obscure de transport sau servicii fictive.</li>
            <li>Raportarea intenționată a unor timpi falși pentru a redirecționa traficul către alte vămi.</li>
          </ul>
          <p className="text-xs text-slate-400">
            Sistemul nostru automat de moderare și operatorii umani au dreptul deplin de a edita, șterge mesajele abuzive ori limita accesul la chat pe baza IP-ului în caz de comportament neadecvat repetat.
          </p>
        </section>

        {/* 4. Drepturi de autor */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            4. Proprietatea Intelectuală
          </h3>
          <p>
            Toate elementele grafice, algoritmul de estimare ponderată, codul sursă de filtrare a spike-urilor de trafic și designul general al platformei sunt proprietatea creatorilor site-ului. Utilizarea API-ului nostru fără aprobare prealabilă scrisă sau preluarea designului în mod comercial neautorizat este ilegală.
          </p>
        </section>

        {/* 5. Legislatie */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            5. Legislația Aplicabilă
          </h3>
          <p>
            Prezenții termeni sunt guvernați de legislația română și europeană în vigoare. Orice litigiu ivit în legătură cu utilizarea site-ului va fi soluționat pe cale amiabilă sau, în caz contrar, va fi înaintat instanțelor judecătorești competente din România.
          </p>
        </section>
      </div>
    </div>
  );
}
