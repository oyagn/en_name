"use client";

import { useState, useRef, useEffect } from "react";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-amber-200/50 bg-warm-white/80 backdrop-blur-sm px-4 py-3"
    >
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="说点什么吧..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-amber-200 bg-white/70 px-4 py-2.5 text-warm-brown placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="shrink-0 rounded-xl bg-amber-600 px-4 py-2.5 text-white font-medium hover:bg-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </form>
  );
}
