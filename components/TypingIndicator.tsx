export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-cream rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
