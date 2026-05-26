import React, { useState, useEffect, useRef } from "react";
import { Send, Users, User, ShieldCheck, HelpCircle, Edit3, Check } from "lucide-react";
import { ChatMessage, Direction } from "../types";
import AdSlot from "./AdSlot";

interface LiveChatProps {
  direction: Direction;
  onlineCount: number;
}

export default function LiveChat({ direction, onlineCount }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [spamError, setSpamError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize custom persistent user profile
  useEffect(() => {
    // Check localStorage for persistent credentials
    let savedUserId = localStorage.getItem("gr_user_id");
    if (!savedUserId) {
      savedUserId = `usr_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("gr_user_id", savedUserId);
    }
    setUserId(savedUserId);

    let savedUsername = localStorage.getItem("gr_username");
    if (!savedUsername) {
      // Pick a random Romanian-styled moniker
      const vehicles = ["Driver", "Turu", "Tirist", "Călător", "Camion", "Tranzit", "Auto", "Colegu"];
      const randNum = Math.floor(100 + Math.random() * 900);
      savedUsername = `${vehicles[Math.floor(Math.random() * vehicles.length)]}_${randNum}`;
      localStorage.setItem("gr_username", savedUsername);
    }
    setUsername(savedUsername);
    setTempUsername(savedUsername);

    // Initial Chat History load
    fetch(`/api/chat-history?direction=${direction}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load history");
        return res.json();
      })
      .then((data: ChatMessage[]) => {
        setMessages(data);
      })
      .catch((err) => console.error("Error loading chat:", err));
  }, [direction]);

  // Load chat updates from the event-listener (SSE setup is handled in main parent, but we also register a local SSE or poll listener for robust syncing!)
  useEffect(() => {
    // Automatically bind to updates sent from main app event source
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          const msg = data.message as ChatMessage;
          if (msg.direction === direction) {
            setMessages((prev) => {
              // De-duplicate any received message by ID (idempotency rule!)
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      } catch (err) {
        // parsing error
      }
    };

    eventSource.onerror = () => {
      // SSE reconnects automatically, but close to reload on change or unmount
    };

    return () => {
      eventSource.close();
    };
  }, [direction]);

  // Handle message sending
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setSpamError(null);

    const messagePayload = {
      username,
      text: text.trim(),
      direction,
      userId,
    };

    // Optimistic Update (create local copy immediately for instant responsive UI)
    const tempId = `temp_msg_${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: tempId,
      username,
      text: text.trim(),
      direction,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setText("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "A apărut o eroare la trimitere.");
      }

      const verified = await response.json();
      // Replace optimistic message with actual verified message from server to prevent duplication
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? verified.message : msg))
      );
    } catch (err: any) {
      setSpamError(err.message);
      // Rollback optimistic message upon error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  // Change Username
  const handleSaveUsername = () => {
    const trimmed = tempUsername.trim().replace(/\s+/g, "_");
    if (trimmed.length < 3) return;
    setUsername(trimmed);
    localStorage.setItem("gr_username", trimmed);
    setIsEditingUsername(false);
  };

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Date helper
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div id="live-chat-tab" className="flex flex-col h-[520px] bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Mini Chat Room Header */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Users size={16} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-300">
              {direction === "RO_BG" ? "🇷🇴 RO → 🇧🇬 BG" : "🇧🇬 BG → 🇷🇴 RO"}
            </span>
            <p className="text-[10px] text-slate-500 font-mono">Camera de chat active live</p>
          </div>
        </div>

        {/* User Identity widget */}
        <div className="flex items-center gap-2">
          {isEditingUsername ? (
            <div className="flex items-center bg-slate-800 rounded-lg px-2 py-1 border border-slate-700">
              <input
                type="text"
                maxLength={18}
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-24 border-none p-0 focus:ring-0"
              />
              <button
                onClick={handleSaveUsername}
                className="text-emerald-400 hover:text-emerald-300 p-0.5"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
              <User size={12} className="text-cyan-400" />
              <span className="text-xs font-mono text-slate-300 font-medium">
                {username}
              </span>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-slate-500 hover:text-slate-300 p-0.5"
                title="Editează pseudonim"
              >
                <Edit3 size={11} />
              </button>
            </div>
          )}

          {/* Active online badge */}
          <div className="bg-slate-900/80 px-2.5 py-1 border border-slate-800 text-[10px] font-mono font-medium rounded-full text-emerald-400 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Online: {onlineCount}</span>
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Help Tip */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/40 flex gap-2 text-[11px] text-slate-400 items-start">
          <ShieldCheck size={14} className="text-cyan-500 shrink-0 mt-0.5" />
          <p>
            Bine ai venit în camera live pentru sensul de mers selectat. Schimbă direcția din header pentru a comuta între discuțiile de pe sensul România→Bulgaria și Bulgaria→România.
          </p>
        </div>

        {/* Dynamic Ad Placement slot */}
        <AdSlot id="ads_chat_infeed" placement="infeed" className="bg-slate-950/70 opacity-90 border-slate-850" />

        {/* Message Bubble Mapping */}
        {messages.map((msg) => {
          const isMe = msg.username === username;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              {/* User + Time caption */}
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className={`text-[10px] uppercase font-mono tracking-wider ${isMe ? "text-cyan-400 font-bold" : "text-slate-400 font-medium"}`}>
                  {msg.username}
                </span>
                <span className="text-[9px] text-slate-600 font-mono">
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              {/* Text Bubble */}
              <div
                className={`px-3.5 py-2 text-xs rounded-2xl ${
                  isMe
                    ? "bg-cyan-600 text-slate-50 rounded-tr-none shadow-md shadow-cyan-900/10"
                    : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap breakdown-words leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Compose Form */}
      <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800/80">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (spamError) setSpamError(null);
            }}
            placeholder="Scrie un mesaj live de pe traseu... (ex: 'Liber la autoturisme')"
            maxLength={160}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!text.trim() || isSending}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-slate-100 p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center font-mono shrink-0"
          >
            <Send size={15} />
          </button>
        </form>

        {/* Dynamic Warning Alert for anti-spam limits */}
        {spamError ? (
          <p className="text-[10px] text-rose-400 mt-2 font-mono flex items-center gap-1 animate-pulse">
            ⚠️ {spamError}
          </p>
        ) : (
          <p className="text-[9px] text-slate-500 mt-2 font-mono flex items-center gap-0.5 justify-between">
            <span>*Limita anti-spam: 1 mesaj la 3 secunde. Păstrați un limbaj civilizat.</span>
            <span>{160 - text.length} carac.</span>
          </p>
        )}
      </div>
    </div>
  );
}
