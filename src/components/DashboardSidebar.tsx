'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Plus,
  Sparkles,
  Gauge,
  Shield,
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
    { icon: FileText,        label: 'My Resumes', href: '/dashboard#resumes' },
    { icon: Gauge,           label: 'ATS Analysis', href: '/dashboard#ats' },
    { icon: Sparkles,        label: 'AI Optimizer', href: '/dashboard#ai' },
  ];

  const bottomItems = [
    { icon: Settings,    label: 'Settings', href: '/dashboard#settings' },
    { icon: HelpCircle,  label: 'Support',  href: '/dashboard#support' },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100%',
      background: '#ffffff',
      borderRight: '1px solid #E5E5E5',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo strip */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: '#0A0A0A',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8F000',
          }}>
            <FileText size={14} />
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            CareerCraft
          </span>
        </div>

        {/* Create button */}
        <button
          onClick={onCreateNew}
          id="sidebar-create-resume"
          style={{
            width: '100%',
            height: '44px',
            background: '#E8F000',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'opacity 0.15s',
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
          padding: '0 12px',
          fontSize: '0.65rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: '8px',
        }}>
          Main Menu
        </p>

        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: active ? 800 : 600,
                color: active ? '#0A0A0A' : '#666',
                background: active ? '#E8F000' : 'transparent',
                textDecoration: 'none',
                marginBottom: '2px',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = '#F6F3F2';
                  e.currentTarget.style.color = '#0A0A0A';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#666';
                }
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Pro upgrade card */}
      <div style={{ padding: '16px', borderTop: '1px solid #E5E5E5' }}>
        <div style={{
          background: '#0A0A0A',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '12px',
        }}>
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
            width: '100%',
            padding: '8px',
            background: '#E8F000',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
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
                color: '#0A0A0A', textDecoration: 'none',
                background: '#FEF9C3',
              }}
            >
              <Shield size={16} />
              Admin Panel
            </Link>
          )}
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '4px',
                fontSize: '0.875rem', fontWeight: 600,
                color: '#666', textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#F6F3F2';
                e.currentTarget.style.color = '#0A0A0A';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#666';
              }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
