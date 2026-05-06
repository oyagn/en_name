import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="h-full flex flex-col">
      <header className="shrink-0 border-b border-amber-200/50 bg-warm-white/90 backdrop-blur-sm px-4 py-4 text-center">
        <h1 className="font-playfair text-2xl font-semibold text-amber-800 tracking-wide">
          Name for You
        </h1>
        <p className="text-sm text-amber-600/70 mt-0.5">找到属于你的英文名</p>
      </header>
      <ChatWindow />
    </main>
  );
}
