import React, { useState } from "react";
import { Mail, Landmark, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "ads", // Default to advertisement proposals
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Post to our custom contact API endpoint for professional processing
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "ads", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3 text-cyan-400 mb-2">
          <Mail size={28} />
          <span className="text-xs uppercase font-mono tracking-widest bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded-md">
            Asistență & Parteneriate Ads
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Contactează-ne
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Propune colaborări publicitare, raportează probleme tehnice sau oferă feedback direct echipei de dezvoltare.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info and Details (LEFT 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Informații Generale
            </h3>
            
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Dacă reprezentați o rețea de publicitate (Ad Network), un brand de servicii logistice rutiere, stații peco sau parcuri de camioane și doriți să amplasați anunțul dvs. pe platformă, vă rugăm să ne contactați direct. Răspundem prompt propunerilor de integrare publicitară.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">EMAIL DIRECT</span>
                  <a href="mailto:colaborari.mihai@gmail.com" className="text-xs md:text-sm text-white font-mono hover:text-cyan-400 transition-colors">
                    colaborari.mihai@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg shrink-0">
                  <Landmark size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">COMPANIA OPERATOARE</span>
                  <span className="text-xs md:text-sm text-white font-semibold block">
                    Giurgiu live monitoring - Proiect Comunitar
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/20 border border-slate-850/80 p-4 rounded-xl text-xs text-slate-400 flex items-start gap-2.5 leading-relaxed">
            <MessageSquare size={16} className="text-cyan-500 shrink-0 mt-0.5" />
            <span>
              Pentru raportarea rapidă a timpilor din vamă, te rugăm să folosești secțiunea <strong>„Raportează Timpul”</strong> din ecranul principal. Acest formular este destinat doar propunerilor sau feedback-ului administrativ.
            </span>
          </div>
        </div>

        {/* Contact Form (RIGHT 7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-5 md:p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-850 pb-2">
            Trimite un mesaj
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name-input" className="block text-xs font-semibold text-slate-400 mb-1">
                Nume Complet <span className="text-rose-500">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex. Andrei Ionescu"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold text-slate-400 mb-1">
                Adresă de E-mail <span className="text-rose-500">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nume@exemplu.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject-select" className="block text-xs font-semibold text-slate-400 mb-1">
              Motivul contactării <span className="text-rose-500">*</span>
            </label>
            <select
              id="subject-select"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="ads">Ofertă Publicitate / Propunere Ad Network</option>
              <option value="moderation">Sesizare Comportament Chat / Solicitare deblocare IP</option>
              <option value="bug">Raportare Eroare Tehnică (Bug)</option>
              <option value="cooperation">Parteneriat Logistic comunitar</option>
            </select>
          </div>

          <div>
            <label htmlFor="message-textarea" className="block text-xs font-semibold text-slate-400 mb-1">
              Mesajul dumneavoastră <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message-textarea"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Scrieți conținutul detaliat al mesajului..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Feedback messages */}
          {submitStatus === "success" && (
            <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-lg flex items-center gap-2.5 text-xs text-emerald-400">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>S-a expediat cu succes! Mesajul a fost salvat și echipa îl va analiza în cel mai scurt timp.</span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-3 rounded-lg flex items-center gap-2.5 text-xs text-rose-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>A apărut o eroare la trimitere. Vă rugăm să asigurați că toate câmpurile sunt completate sau încercați din nou.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold leading-none cursor-pointer text-[#0f172a] bg-slate-100 hover:bg-white transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span>Se trimite...</span>
            ) : (
              <>
                <Send size={12} />
                <span>Trimite Mesajul</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
