'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  LayoutDashboard, 
  Settings, 
  HelpCircle, 
  Plus, 
  History, 
  Sparkles,
  Search,
  Gauge,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SidebarProps {
  onCreateNew: () => void;
}

export default function DashboardSidebar({ onCreateNew }: SidebarProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        setIsAdmin(!!profile?.is_admin);
      }
    }
    checkAdmin();
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'My Resumes', href: '/dashboard#resumes' },
    { icon: Gauge, label: 'ATS Analysis', href: '/dashboard#ats' },
    { icon: Sparkles, label: 'AI Optimizer', href: '/dashboard#ai' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/dashboard#settings' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard#support' },
  ];

  return (
    <aside className="w-72 h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col shrink-0">
      <div className="p-8">
        <button 
          onClick={onCreateNew}
          className="w-full premium-button h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-base shadow-xl group transition-all"
        >
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/40">
            <Plus size={16} />
          </div>
          Create Resume
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
              pathname === item.href 
                ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/10' 
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-app)] hover:text-[var(--text-main)]'
            }`}
          >
            <item.icon size={20} className={pathname === item.href ? 'text-indigo-500' : 'text-[var(--text-muted)]'} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 mb-4">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
                <Sparkles size={16} />
                <span className="text-xs font-black tracking-widest uppercase">Pro Plan</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-4 font-medium">Ready to land your dream job at Google?</p>
            <button className="w-full py-2 bg-indigo-500 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-all shadow-md">
                Upgrade Now
            </button>
        </div>

        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1">
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === '/admin' 
                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/10' 
                  : 'text-indigo-500 hover:bg-indigo-500/10'
              }`}
            >
              <Shield size={20} />
              Admin Panel
            </Link>
          )}
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-app)] hover:text-[var(--text-main)] transition-all"
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
