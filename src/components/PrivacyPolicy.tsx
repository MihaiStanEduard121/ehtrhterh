import React from "react";
import { Shield, Eye, Lock, FileText, CheckCircle, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3 text-cyan-400 mb-2">
          <Shield size={28} />
          <span className="text-xs uppercase font-mono tracking-widest bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded-md">
            Conformitate GDPR & ePrivacy
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Politică de Confidențialitate
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Ultima actualizare: 26 Mai 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Intro */}
        <section className="space-y-3">
          <p>
            Respectăm confidențialitatea datelor dumneavoastră și ne angajăm să le protejăm în deplină conformitate cu Regulamentul General privind Protecția Datelor (Regulamentul UE 2016/679 - <strong>GDPR</strong>). 
          </p>
          <p>
            Această Politică de Confidențialitate explică modul în care platforma <strong>Timp Așteptare Giurgiu – Ruse</strong> colectează, utilizează, stochează și protejează datele dumneavoastră cu caracter personal atunci când utilizați portalul nostru de monitorizare a traficului la frontieră, servicii de asistență rutieră și partajare de informații de la colegi în trafic.
          </p>
        </section>

        {/* 1. Cine suntem */}
        <section className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-sm inline-block" />
            1. Operatorul de date
          </h3>
          <p className="text-slate-400">
            Platforma "Timp Așteptare Giurgiu – Ruse" este operată ca o inițiativă independentă comunitară pentru fluidizarea tranzitului frontalier. Pentru orice întrebări, solicitări referitoare la datele personale sau exercitarea drepturilor prevăzute de GDPR, ne puteți contacta direct la:
          </p>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs bg-slate-900 px-3 py-2 rounded-lg mt-1 w-fit">
            <Mail size={14} />
            <span>colaborari.mihai@gmail.com</span>
          </div>
        </section>

        {/* 2. Ce date colectam */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-sm inline-block" />
            2. Datele pe care le colectăm și scopul colectării
          </h3>
          <p>
            Colectăm doar datele strict necesare bunei funcționări a aplicației de monitorizare și a sistemului live crowd:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 font-mono block mb-1">DATE FURNIZATE VOLUNTAR</span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                <li>Numele de utilizator ales în Chat (poate fi un pseudonim)</li>
                <li>Textele mesajelor trimise pe Chat</li>
                <li>Rapoartele privind timpii de așteptare (număr de minute, tip vehicul, direcție, dată)</li>
              </ul>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 font-mono block mb-1">DATE COLECTATE AUTOMAT</span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                <li>Adresa IP securizată (pentru prevenirea abuzurilor/spamului)</li>
                <li>Informații de bază despre dispozitiv (Sistem de operare, tip browser)</li>
                <li>Date cookie de sesiune și preferințe (privind consimțământul)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Google Services */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-sm inline-block" />
            3. Integrarea Serviciilor Google (AdSense & Analytics)
          </h3>
          <p>
            Pentru a asigura sustenabilitatea financiară și auto-găzduirea tehnică a platformei, utilizăm rețele publicitare terțe precum <strong>Google AdSense</strong>, alături de sisteme de analiză a audienței precum <strong>Google Analytics</strong>.
          </p>

          <div className="space-y-3 pl-4 border-l border-slate-800 text-sm">
            <div>
              <h4 className="text-white font-semibold">A. Google AdSense</h4>
              <p className="text-slate-400 mt-1">
                Google, ca furnizor terț, folosește cookie-uri pentru a difuza anunțuri pe acest site. Utilizarea cookie-ului DART de către Google face posibilă difuzarea de anunțuri către utilizatorii noștri pe baza vizitei lor pe acest site și pe alte site-uri de pe Internet. Puteți alege să nu utilizați cookie-ul DART vizitând politica de confidențialitate a rețelei de publicitate și de conținut Google.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold">B. Google Analytics</h4>
              <p className="text-slate-400 mt-1">
                Utilizăm Google Analytics pentru a înțelege comportamentul general de utilizare și volumele de trafic. Acest instrument colectează date anonimizate pentru a ne arăta care secțiuni sunt cele mai accesate, fără a crea profiluri individuale de identificare directă a utilizatorului.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold">C. Google Consent Mode v2</h4>
              <p className="text-slate-400 mt-1">
                Platforma noastră include integrarea nativă cu <strong>Google Consent Mode v2</strong>. Aceasta transmite semnale de consimțământ direct către Google (parametru <code>ad_storage</code>, <code>analytics_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code>). Serviciile Google își adaptează dinamic comportamentul în funcție de acceptele exprimate de dvs. în selectorul nostru de cookie-uri.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Temei legal si stocare */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-sm inline-block" />
            4. Temeiul juridic al prelucrării și Stocarea datelor
          </h3>
          <p>
            Prelucrarea datelor se face în baza <strong>Consimțământului explicit</strong> al utilizatorului (pentru cookie-uri de marketing/analiză și trimiterea voluntară a mesajelor/rapoartelor) și în baza <strong>Interesului legitim</strong> de a preveni frauda, spamul și de a asigura stabilitatea platformei.
          </p>
          <p>
            Rapoartele și discuțiile din chat-ul live sunt considerate de interes public și efemere. Mesajele din chat și istoricul detaliat al rapoartelor sunt limitate la un număr maxim stocat în baza de date (ultimele 500 de rapoarte / ultimele 150 de chat-uri), după care sunt șterse sau complet anonimizate.
          </p>
        </section>

        {/* 5. Drepturile utilizatorului */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-sm inline-block" />
            5. Drepturile utilizatorilor conform GDPR
          </h3>
          <p>
            În calitate de persoană vizată, beneficiați de toate drepturile reglementate de Directiva Europeană GDPR:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-2">
            <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850">
              <span className="font-bold text-white block mb-1">Acces & Portabilitate</span>
              Aveți dreptul de a solicita o copie a datelor pe care le deținem despre dumneavoastră sau de a le transfera.
            </div>
            <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850">
              <span className="font-bold text-white block mb-1">Rectificare & Ștergere</span>
              Puteți solicita oricând corectarea datelor greșite sau ștergerea mesajelor și rapoartelor trimise din greșeală.
            </div>
            <div className="bg-slate-955/30 p-3 rounded-lg border border-slate-850">
              <span className="font-bold text-white block mb-1">Retragere Consimțământ</span>
              Vă puteți răzgândi oricând în privința modulelor cookie prin accesarea panoului de cookies din subsol.
            </div>
          </div>
          <p className="text-xs text-slate-450 mt-2">
            Pentru a exercita oricare dintre aceste drepturi, trimiteți un e-mail la <span className="text-cyan-400 font-mono">colaborari.mihai@gmail.com</span>. Vom răspunde solicitării dumneavoastră în termen de maximum 30 de zile.
          </p>
        </section>

        {/* 6. Securitate */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-sm inline-block" />
            6. Securitatea datelor
          </h3>
          <p>
            Folosim metode avansate de criptare a datelor în tranzit (protocoale securizate HTTPS/SSL) și stocare securizată Firestore/locală. Nimeni nu poate vedea sau procesa adresa dumneavoastră de IP, care este hashed și utilizată exclusiv de regulile firewall de securitate ale serverului.
          </p>
        </section>
      </div>
    </div>
  );
}
