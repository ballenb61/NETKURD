"use client";

import { motion } from "framer-motion";

// Terminal border divider
function TerminalDivider() {
  return (
    <div className="flex items-center w-full my-0.5 select-none">
      <span className="text-neon-400/70 font-mono text-[10px]">[|</span>
      <div className="flex-1 mx-1 border-t border-dashed border-neon-400/30" />
      <span className="text-neon-400/70 font-mono text-[10px]">|]</span>
    </div>
  );
}

export default function MessageBubble({ role, content, isStreaming = false }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-3`}
    >
      <TerminalDivider />
      <div
        className={`px-4 py-3 rounded-xl border backdrop-blur-sm font-kurdish text-sm leading-relaxed whitespace-pre-wrap break-words max-w-[85%] ${
          isUser
            ? "bg-cyber-card border-neon-500/40 text-cyan-100"
            : "bg-cyber-dark border-neon-400/50 text-white"
        } ${isStreaming ? "typing-cursor" : ""}`}
        dir="rtl"
      >
        {content}
        {/* Show animated dots while waiting for first token */}
        {isStreaming && !content && (
          <span className="flex gap-1 items-center">
            <span className="w-2 h-2 bg-neon-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-neon-400 rounded-full animate-bounce delay-75" />
            <span className="w-2 h-2 bg-neon-400 rounded-full animate-bounce delay-150" />
          </span>
        )}
      </div>
      <TerminalDivider />
    </motion.div>
  );
          }
