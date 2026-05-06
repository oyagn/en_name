import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
          isUser
            ? "bg-amber-100/80 text-amber-950 rounded-br-sm whitespace-pre-wrap"
            : "bg-cream text-warm-brown rounded-bl-sm prose prose-sm prose-amber max-w-none"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-amber-900">{children}</strong>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
