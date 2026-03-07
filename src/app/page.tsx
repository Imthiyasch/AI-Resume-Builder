import Link from "next/link";
import { FileText, Sparkles, Wand2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-grow flex flex-col justify-center relative overflow-hidden">
      {/* Subtle background glow effect over the layout gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-pink-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Resume Builder</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          Craft your perfect <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Professional Resume
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xl text-zinc-400 mb-10 leading-relaxed">
          Use cutting-edge AI to rewrite your bullet points, polish your summary, and stand out to recruiters in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-500 hover:shadow-[0_0_20px_1px_rgba(79,70,229,0.4)] transition-all w-full sm:w-auto"
          >
            <Wand2 className="w-5 h-5" />
            Create Your Resume
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-transparent text-white border border-zinc-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-900 hover:border-zinc-600 transition-all w-full sm:w-auto"
          >
            Log In
          </Link>
        </div>

        <div className="mt-24 max-w-5xl mx-auto rounded-2xl border border-zinc-800 shadow-2xl bg-zinc-900/50 backdrop-blur-xl p-4 overflow-hidden">
          <div className="aspect-video bg-zinc-950/80 rounded-xl border border-zinc-800/50 flex flex-col items-center justify-center text-zinc-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <FileText className="w-16 h-16 mb-4 text-indigo-500/50 relative z-10" />
            <p className="font-medium relative z-10">Live Interactive Editor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
