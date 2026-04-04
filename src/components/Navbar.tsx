'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FileText, Sun, Moon, LayoutDashboard, LogOut } from 'lucide-react';
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

    const savedTheme = localStorage.getItem('data-theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

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
    localStorage.setItem('data-theme', newTheme);
    toast.success(`Switched to ${newTheme} mode`, { icon: newTheme === 'dark' ? '🌙' : '☀️' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
        borderBottom: isScrolled ? '1px solid #E5E5E5' : '1px solid #E5E5E5',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              background: '#0A0A0A',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E8F000',
            }}
          >
            <FileText size={16} />
          </div>
          <span
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#0A0A0A',
            }}
          >
            CareerCraft
          </span>
        </Link>

        {/* Nav Links */}
        <div
          className="nav-links-desktop"
          style={{ display: 'flex', alignItems: 'center', gap: '36px' }}
        >
          {['Features', 'Templates', 'Pricing'].map((item) => (
            <Link
              key={item}
              href="/dashboard"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#666',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              border: '1px solid #E5E5E5',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#666',
              transition: 'border-color 0.15s',
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  textDecoration: 'none',
                  border: '1px solid #E5E5E5',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background 0.15s',
                }}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  border: '1px solid #fca5a5',
                  background: '#fff5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ef4444',
                  transition: 'background 0.15s',
                }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  transition: 'opacity 0.15s',
                }}
              >
                Login
              </Link>
              <Link
                href="/login"
                id="navbar-get-started"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#0A0A0A',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  padding: '10px 20px',
                  borderRadius: '100px',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.15s',
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
