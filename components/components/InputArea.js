"use client";

import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  { icon: "🧠", label: "هۆش", prefix: "🧠: " },
  { icon: "🎨", label: "هونەر", prefix: "🎨: " },
  { icon: "🛠️", label: "ئامڕاز", prefix: "🛠️: " },
  { icon: "🛡️", label: "پاراستن", prefix: "🛡️: " },
];

export default function InputArea({
  input,
  setInput,
  onSend,
  isLoading,
  inputRef,
}) {
  const handleActionClick = (prefix) => {
    setInput((prev) => prefix + prev);
    inputRef?.current?.focus();
  };

  return (
    <div className="border-t border-neon-900/40 bg-cyber-dark">
      {/* Quick actions bar */}
      <div className="flex justify-around px-2 pt-2 pb-1">
        {QUICK_ACTIONS.map(({ icon, label, prefix }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleActionClick(prefix)}
            className="flex flex-col items-center text-neon-400 hover:text-neon-300 transition-colors"
            title={label}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-mono mt-0.5">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={onSend} className="flex items-center gap-2 p-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پەیامێک بنووسە..."
          disabled={isLoading}
          className="flex-1 bg-cyber-black border border-neon-600/50 rounded-xl px-4 py-3 font-kurdish text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-400/60 transition-all disabled:opacity-40"
          dir="rtl"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-neon-600 hover:bg-neon-500 disabled:bg-gray-700 text-white rounded-xl px-5 py-3 font-mono font-bold text-sm tracking-wide shadow-[0_0_18px_#06b6d4] disabled:shadow-none transition-all"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "ناردن"
          )}
        </motion.button>
      </form>
    </div>
  );
}
