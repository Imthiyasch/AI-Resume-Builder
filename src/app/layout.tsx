import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "CareerCraft | AI Resume Builder",
  description: "Build a professional, ATS-optimized resume in minutes with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head />
      <body className="antialiased selection:bg-indigo-500/30">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster richColors position="bottom-right" theme="system" />
      </body>
    </html>
  );
}
