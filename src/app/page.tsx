'use client';

import Link from 'next/link';
import { FileText, Sparkles, Globe, Gauge, ArrowRight, Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="editorial-page">

      {/* ── HERO: Split Panel ───────────────────────────────── */}
      <section className="hero-split">
        {/* Left — Yellow Panel */}
        <div className="hero-left">
          <span className="hero-badge">Backed by AI &amp; Built for Your Career</span>

          <h1 className="hero-headline">
            Build Your<br />
            Resume<br />
            <em>Instantly with AI</em>
          </h1>

          <p className="hero-sub">
            Transform your career with AI-powered resume building.
            Professional results in minutes. Our editorial-grade layouts
            ensure you stand out.
          </p>

          <div className="hero-ctas">
            <Link href="/login" className="btn-primary" id="hero-get-started">
              Get Started Free
            </Link>
            <Link href="/dashboard" className="btn-ghost" id="hero-try-demo">
              Try Demo →
            </Link>
          </div>

          <div className="hero-social-proof">
            <div className="avatar-cluster">
              {['👨‍💼', '👩‍💻', '👨‍🎨', '👩‍🔬'].map((e, i) => (
                <span key={i} className="avatar-circle">{e}</span>
              ))}
            </div>
            <span className="proof-text"><strong>1M+</strong> Active Users</span>
          </div>
        </div>

        {/* Right — Dark Panel */}
        <div className="hero-right">
          <div className="resume-preview-card">
            <div className="resume-header-bar">
              <div className="resume-name-block">
                <div className="resume-name-line" />
                <div className="resume-title-line" />
              </div>
              <div className="resume-contact-lines">
                <div className="resume-contact-line" />
                <div className="resume-contact-line short" />
              </div>
            </div>
            <div className="resume-divider" />
            <div className="resume-section">
              <div className="resume-section-label" />
              <div className="resume-text-line" />
              <div className="resume-text-line med" />
              <div className="resume-text-line long" />
            </div>
            <div className="resume-section">
              <div className="resume-section-label" />
              <div className="resume-text-line long" />
              <div className="resume-text-line" />
            </div>
            <div className="resume-ai-badge">
              <Sparkles size={10} />
              <span>AI Optimized</span>
            </div>
          </div>
          <p className="hero-right-caption">
            Whether you&apos;re a designer, developer, marketer or manager —
            our AI gives you real-time feedback tailored to your profession.
          </p>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section className="features-section">
        <p className="features-eyebrow">Core Capabilities</p>
        <div className="features-grid">
          {[
            {
              icon: Sparkles,
              title: 'AI Generation',
              desc: 'Instant AI rewrites and bullet point generation based on your unique career data. Professional tone, guaranteed.',
            },
            {
              icon: Globe,
              title: 'ATS Optimized',
              desc: 'Pass any Applicant Tracking System with our mathematically optimized structures. 100% compliance rate.',
            },
            {
              icon: Gauge,
              title: 'Smart Analysis',
              desc: 'Real-time scoring and keyword suggestions to ensure you align perfectly with the target job description.',
            },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-wrap">
                <f.icon size={20} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────────────── */}
      <section className="cta-band">
        <h2 className="cta-headline">Ready to land your dream job?</h2>
        <p className="cta-sub">
          Join thousands of professionals landing roles at top-tier companies
          with AI-powered resumes.
        </p>
        <Link href="/login" className="btn-cta-white" id="cta-start-building">
          Start Building Now <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FileText size={16} />
              </div>
              <span className="footer-logo-name">CareerCraft</span>
            </div>
            <p className="footer-tagline">
              The Brutalist Editor. High-end resume building for the modern
              professional.
            </p>
          </div>

          {[
            { heading: 'Product', links: ['Features', 'Templates', 'Pricing'] },
            { heading: 'Company', links: ['About', 'Careers', 'Support'] },
            { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
          ].map((col) => (
            <div key={col.heading} className="footer-col">
              <h4 className="footer-col-heading">{col.heading}</h4>
              <ul className="footer-col-links">
                {col.links.map((l) => (
                  <li key={l}><Link href="#">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2026 CareerCraft AI. All rights reserved.</p>
          <div className="footer-socials">
            <Link href="#"><Github size={16} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
