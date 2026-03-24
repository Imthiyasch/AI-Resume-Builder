'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, FileText, Zap, Shield, Star, Globe, Cpu, Gauge, Github } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-[120px] rounded-full -z-10" />
      <div className="absolute top-[20%] -right-20 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] -left-20 w-96 h-96 bg-teal-500/5 blur-[100px] rounded-full -z-10" />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-10"
            >
                <Sparkles size={14} className="animate-pulse" />
                <span>Top #1 AI Resume Builder</span>
            </motion.div>
            
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-black text-[var(--text-main)] mb-8 tracking-tight leading-[1.05]"
          >
            Build Resume in One Click <br />
            <span className="premium-gradient-text">with AI effortlessly</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-[var(--text-muted)] max-w-2xl mb-12 leading-relaxed"
          >
            Transform the way you create your resume with AI. In just one click, you 
            can build a polished, professional resume in record time.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 mb-20"
          >
            <Link href="/login" className="px-10 py-5 rounded-2xl premium-button text-lg font-bold shadow-2xl flex items-center justify-center gap-3">
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" className="px-10 py-5 rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-500/20 text-[var(--text-main)] text-lg font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center">
              Free Trial Now
            </Link>
          </motion.div>

          {/* Partner Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-3xl pt-10 border-t border-[var(--border-subtle)]"
          >
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-8">Our Trusted Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl"><Zap size={24} fill="currentColor" /> ChatGPT</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Star size={24} fill="currentColor" /> Gemini</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Shield size={24} fill="currentColor" /> DeepSeek</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24} fill="currentColor" /> Claude</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Cpu size={24} fill="currentColor" /> Perplexity</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section Preview */}
      <section className="py-24 px-6 relative bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { icon: Sparkles, title: "AI Generation", desc: "Instantly rewrite your experience with role-specific keywords.", color: "indigo" },
                    { icon: Globe, title: "ATS Optimized", desc: "Pass through any tracking system with specialized templates.", color: "emerald" },
                    { icon: Gauge, title: "Smart Analysis", desc: "Get real-time scoring and actionable improvement tips.", color: "purple" }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="p-8 rounded-3xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all shadow-sm"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 text-${feature.color}-500`}>
                            <feature.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center bg-zinc-900 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-50" />
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to craft your future?</h2>
                <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">Join thousands of professionals landing jobs at top-tier companies with AI-powered resumes.</p>
                <Link href="/login" className="inline-flex px-10 py-5 rounded-2xl bg-white text-zinc-950 text-lg font-bold hover:bg-zinc-100 transition-all shadow-2xl items-center gap-3">
                    Start Building for Free <ArrowRight size={20} />
                </Link>
            </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white"><FileText size={16} /></div>
                    <span className="text-xl font-black text-[var(--text-main)]">CareerCraft</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm max-w-xs leading-relaxed">The only AI-powered platform designed to turn your raw experience into a professional masterpiece.</p>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-indigo-500">Product</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)] font-medium">
                      <li><Link href="#">Features</Link></li>
                      <li><Link href="#">Templates</Link></li>
                      <li><Link href="#">ATS Checker</Link></li>
                  </ul>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-indigo-500">Company</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)] font-medium">
                      <li><Link href="#">About Us</Link></li>
                      <li><Link href="#">Careers</Link></li>
                      <li><Link href="#">Blog</Link></li>
                  </ul>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-indigo-500">Legal</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)] font-medium">
                      <li><Link href="#">Privacy Policy</Link></li>
                      <li><Link href="#">Terms of Use</Link></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-xs text-[var(--text-muted)] font-bold">© 2026 CareerCraft AI. All rights reserved.</p>
              <div className="flex items-center gap-6 text-[var(--text-muted)]">
                  <Link href="#" className="hover:text-indigo-500 transition-colors"><Github size={18}/></Link>
                  <Link href="#" className="hover:text-indigo-500 transition-colors"><Zap size={18}/></Link>
              </div>
          </div>
      </footer>
    </div>
  );
}
