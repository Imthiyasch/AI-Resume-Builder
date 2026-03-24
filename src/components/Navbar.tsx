'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FileText, Sun, Moon, LayoutDashboard, LogOut, Github, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Initial theme
    const savedTheme = localStorage.getItem('data-theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.getItem('data-theme');
    localStorage.setItem('data-theme', newTheme);
    toast.success(`Theme switched to ${newTheme} mode`, { icon: newTheme === 'dark' ? '🌙' : '☀️' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <nav 
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-[var(--glass-bg)] border-b border-[var(--glass-border)] backdrop-blur-md shadow-lg' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-[var(--text-main)]">
            Career<span className="text-indigo-500">Craft</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--text-muted)] hover:text-indigo-500 transition-colors flex items-center gap-2">
            Features
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--text-muted)] hover:text-indigo-500 transition-colors">
            Templates
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--text-muted)] hover:text-indigo-500 transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-indigo-500 hover:border-indigo-500/30 transition-all shadow-sm"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-main)] hover:border-indigo-500/30 transition-all shadow-sm"
              >
                <LayoutDashboard size={16} className="text-indigo-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl premium-button text-sm font-bold shadow-xl flex items-center gap-2"
            >
              <Sparkles size={16} />
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
