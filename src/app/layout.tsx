import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Build a professional resume in minutes using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Anti-flash script: runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col
          bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900
          dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900
          light:from-slate-100 light:via-indigo-50 light:to-purple-50
          text-white dark:text-white light:text-gray-900
          selection:bg-pink-500/30 transition-colors`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: 'rgba(24, 24, 27, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            },
          }}
        />
      </body>
    </html>
  );
}
