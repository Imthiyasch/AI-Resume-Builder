'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  FileText, LayoutDashboard, Settings, HelpCircle,
  Plus, Sparkles, Gauge, Shield,
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SidebarProps {
  onCreateNew: () => void;
}

function SidebarContent({ onCreateNew }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || '';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('is_admin').eq('id', user.id).single();
        setIsAdmin(!!profile?.is_admin);
      }
    }
    checkAdmin();
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard',             tab: '' },
    { icon: FileText,        label: 'My Resumes',  href: '/dashboard?tab=resumes', tab: 'resumes' },
    { icon: Gauge,           label: 'ATS Analysis', href: '/dashboard?tab=ats',    tab: 'ats' },
    { icon: Sparkles,        label: 'AI Optimizer', href: '/dashboard?tab=ai',     tab: 'ai' },
  ];

  const bottomItems = [
    { icon: Settings,   label: 'Settings', href: '/dashboard?tab=settings', tab: 'settings' },
    { icon: HelpCircle, label: 'Support',  href: '/dashboard?tab=support',  tab: 'support' },
  ];

  const isActive = (item: { href: string; tab: string }) => {
    if (item.tab === '') return pathname === '/dashboard' && currentTab === '';
    return currentTab === item.tab;
  };

  return (
    <aside
      className="editorial-sidebar"
      style={{ width: '260px', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
    >
      {/* Logo strip */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'var(--text-main)',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8F000',
          }}>
            <FileText size={14} />
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            CareerCraft
          </span>
        </div>

        <button
          onClick={onCreateNew}
          id="sidebar-create-resume"
          style={{
            width: '100%', height: '44px',
            background: '#E8F000', color: '#0A0A0A',
            border: 'none', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontWeight: 800, fontSize: '0.875rem',
            cursor: 'pointer', letterSpacing: '-0.01em', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={16} />
          New Resume
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <p style={{
          padding: '0 12px', fontSize: '0.65rem', fontWeight: 800,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '8px',
        }}>
          Main Menu
        </p>

        {menuItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`editorial-sidebar-link${active ? ' active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '4px',
                fontSize: '0.875rem', fontWeight: active ? 800 : 600,
                textDecoration: 'none', marginBottom: '2px',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Pro upgrade */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="editorial-sidebar-pro" style={{ borderRadius: '4px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={14} style={{ color: '#E8F000' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8F000' }}>
              Pro Plan
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#999', lineHeight: 1.5, marginBottom: '12px' }}>
            Want to land your dream job at Google?
          </p>
          <button style={{
            width: '100%', padding: '8px', background: '#E8F000',
            color: '#0A0A0A', border: 'none', borderRadius: '4px',
            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
          }}>
            Upgrade Now
          </button>
        </div>

        {/* Bottom links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {isAdmin && (
            <Link
              href="/admin"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '4px',
                fontSize: '0.875rem', fontWeight: 700,
                color: 'var(--yellow)', textDecoration: 'none',
                background: 'rgba(232,240,0,0.1)',
              }}
            >
              <Shield size={16} />
              Admin Panel
            </Link>
          )}
          {bottomItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`editorial-sidebar-link${active ? ' active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '4px',
                  fontSize: '0.875rem', fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default function DashboardSidebar({ onCreateNew }: SidebarProps) {
  return (
    <Suspense fallback={
      <aside style={{ width: '260px', height: '100%', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)', flexShrink: 0 }} />
    }>
      <SidebarContent onCreateNew={onCreateNew} />
    </Suspense>
  );
}
