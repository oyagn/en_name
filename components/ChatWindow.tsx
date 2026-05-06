"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { InputBar } from "@/components/InputBar";
import { TypingIndicator } from "@/components/TypingIndicator";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    startConversation();
  }, []);

  async function startConversation() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "你好，我想起一个英文名" }],
        }),
      });

      if (!response.ok) throw new Error("API error");

      setIsStreaming(true);
      setMessages([{ role: "assistant", content: "" }]);
      await readStream(response);
    } catch {
      setMessages([
        {
          role: "assistant",
          content:
            "你好呀！很高兴能帮你找到一个属于你的英文名。让我们从一个轻松的问题开始吧——如果用一个季节来形容自己，你觉得自己是哪个季节的人呢？",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  async function readStream(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let result = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              result += content;
              const snapshot = result;
              setMessages((prev) => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
                  updated[lastIdx] = { ...updated[lastIdx], content: snapshot };
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("API error");

      setIsStreaming(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await readStream(response);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "抱歉，出了点小问题。请稍后再试一下吧。" },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  const showTyping =
    isLoading &&
    !isStreaming &&
    (messages.length === 0 || messages[messages.length - 1]?.role === "user");

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {showTyping && <TypingIndicator />}
      </div>
      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
