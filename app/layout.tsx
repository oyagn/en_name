import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "你的英文名 · Name for You",
  description: "通过温暖的对话，找到属于你的英文名",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${playfair.variable} ${notoSerifSC.variable} h-full`}>
      <body className="h-full bg-warm-white text-warm-brown font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
