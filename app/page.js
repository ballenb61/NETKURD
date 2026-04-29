"use client";
import { useState, useRef, useEffect } from "react";

function TerminalBorder() {
  return (
    <div className="flex items-center w-full my-1 opacity-50">
      <span className="text-cyan-400 font-mono text-xs">[|</span>
      <div className="flex-1 mx-1 border-t border-dashed border-cyan-400" />
      <span className="text-cyan-400 font-mono text-xs">|]</span>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streaming]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: userMsg }) });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          full += JSON.parse(data).token;
          setStreaming(full);
        }
      }
    }
    setMessages(prev => [...prev, { role: "assistant", content: full }]);
    setStreaming("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-cyber-black border-x border-cyan-900/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      <header className="p-4 border-b border-cyan-900/50 bg-cyber-dark">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_#06b6d4]">🧠</div>
          <div>
            <h1 className="text-cyan-400 font-bold font-mono tracking-tighter">SABINA VISUAL</h1>
            <p className="text-[10px] text-cyan-500/50 font-mono">NETKURD OS v2026</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === "user" ? "ml-auto" : "mr-auto"} max-w-[90%]`}>
            <TerminalBorder />
            <div className={`p-3 rounded border font-mono text-sm ${m.role === "user" ? "bg-gray-800/50 border-cyan-700/30" : "bg-gray-900/80 border-cyan-400/30 text-cyan-50"}`}>
              {m.content}
            </div>
            <TerminalBorder />
          </div>
        ))}
        {streaming && (
          <div className="mr-auto max-w-[90%]">
            <TerminalBorder />
            <div className="p-3 rounded border border-cyan-400/30 bg-gray-900/80 font-mono text-sm animate-pulse">{streaming}</div>
            <TerminalBorder />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-3 bg-cyber-dark border-t border-cyan-900/50 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="فەرمان بنووسە..." className="flex-1 bg-black border border-cyan-900/50 rounded-lg px-4 py-2 text-sm focus:border-cyan-400 outline-none transition-all" dir="rtl" />
        <button onClick={send} className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]">ناردن</button>
      </div>
    </div>
  );
}
