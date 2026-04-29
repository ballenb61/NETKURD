"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import InputArea from "./InputArea";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isLoading]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;

      setError(null);
      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      setStreamingContent("");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "هەڵەی نەناسراو");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.token) {
                  fullText += parsed.token;
                  setStreamingContent(fullText);
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {}
            }
          }
        }

        if (fullText) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: fullText },
          ]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "هەڵەیەک ڕوویدا");
          setStreamingContent("");
        }
      } finally {
        setIsLoading(false);
        setStreamingContent("");
      }
    },
    [input, isLoading]
  );

  const displayMessages = [
    ...messages,
    ...(streamingContent
      ? [{ role: "assistant", content: streamingContent, isStreaming: true }]
      : []),
  ];

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-cyber-black border-x border-neon-900/20 shadow-2xl">
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 bg-gradient-to-r from-cyber-dark to-gray-900 border-b border-neon-800/60 px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black border-2 border-neon-400 flex items-center justify-center text-2xl shadow-[0_0_15px_#22d3ee]">
              🧠
            </div>
            <div>
              <h1 className="text-neon-400 font-bold text-lg tracking-widest font-mono">
                SABINA VISUAL
              </h1>
              <p className="text-[11px] text-neon-200/60 font-mono">
                [ NetKurd OS 2026 ]
              </p>
            </div>
          </div>
          <span className="text-neon-500 text-2xl animate-pulse">⬡</span>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 chat-scroll">
        <AnimatePresence>
          {displayMessages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming}
            />
          ))}
        </AnimatePresence>

        {isLoading && !streamingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-cyber-dark border border-neon-400/30 rounded-xl px-4 py-3 font-kurdish text-sm text-neon-300 animate-pulse">
              ⏳ سارباست بیر دەکاتەوە...
            </div>
          </motion.div>
        )}

        {displayMessages.length === 0 && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center text-neon-400/50 font-kurdish"
          >
            <div className="text-5xl mb-4">⚡</div>
            <p className="text-lg">بەخێربێیت بۆ نێتکورد ئۆ‌ئێس ٢٠٢٦</p>
            <p className="text-sm mt-2">پرسیارەکەت لە سارباست بکە</p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-red-900/80 border-t border-red-500/50 px-4 py-3 flex items-center gap-3 font-kurdish text-sm"
          >
            <span className="text-red-300">⚠️</span>
            <span className="text-red-200">{error}</span>
            <button
              onClick={() => setError(null)}
              className="mr-auto text-red-400 hover:text-red-300 text-lg"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <InputArea
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        inputRef={inputRef}
      />
    </div>
  );
}
