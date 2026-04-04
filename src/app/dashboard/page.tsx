'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, FileText, Loader2, Calendar, Trash2, Pencil,
  Check, Search, Sparkles, TrendingUp, Target, Clock,
  Filter, ArrowRight, Gauge, CheckCircle2, AlertCircle, Mail, MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DashboardSidebar from '@/components/DashboardSidebar';

// ─── Skeleton ────────────────────────────────────────────────
function ResumeSkeleton() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E5E5',
      borderRadius: '4px', padding: '20px',
    }}>
      <div style={{ aspectRatio: '3/4', background: '#F0EDEC', borderRadius: '4px', marginBottom: '16px' }} />
      <div style={{ height: '12px', background: '#E5E2E1', borderRadius: '2px', width: '75%', marginBottom: '8px' }} />
      <div style={{ height: '10px', background: '#E5E2E1', borderRadius: '2px', width: '50%' }} />
    </div>
  );
}

// ─── ATS Analysis Panel ───────────────────────────────────────
function ATSAnalysisPanel({ resumes }: { resumes: any[] }) {
  return (
    <div>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px',
        padding: '32px', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: '#E8F000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gauge size={20} style={{ color: '#0A0A0A' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>ATS Analysis</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Check your resume against Applicant Tracking Systems</p>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
          Open any of your resumes and use the built-in <strong style={{ color: '#0A0A0A' }}>ATS Checker</strong> panel on the right side of the editor to run a detailed analysis. You can paste a job description for a tailored match score.
        </p>

        {resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed var(--border-subtle)', borderRadius: '4px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No resumes yet. Create one first to run ATS analysis.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {resumes.slice(0, 6).map((r) => (
              <Link key={r.id} href={`/resume/${r.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-app)', borderRadius: '4px', padding: '16px',
                  border: '1px solid var(--border-subtle)', cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', background: '#E8F000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={14} style={{ color: '#0A0A0A' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(r.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0A0A0A', background: '#E8F000', padding: '2px 8px', borderRadius: '100px' }}>
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { icon: CheckCircle2, color: '#16a34a', title: 'Use standard headings', desc: 'Stick to "Work Experience", "Education", "Skills" — avoid creative titles.' },
          { icon: CheckCircle2, color: '#16a34a', title: 'Include keywords', desc: 'Mirror the exact wording from the job description in your resume.' },
          { icon: AlertCircle, color: '#d97706', title: 'Avoid tables & columns', desc: 'ATS systems struggle to parse multi-column layouts.' },
          { icon: AlertCircle, color: '#d97706', title: 'No graphics or icons', desc: 'Images and icons cannot be read by most ATS systems.' },
        ].map((tip) => (
          <div key={tip.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <tip.icon size={16} style={{ color: tip.color }} />
              <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)' }}>{tip.title}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Optimizer Panel ───────────────────────────────────────
function AIOptimizerPanel({ resumes }: { resumes: any[] }) {
  return (
    <div>
      <div style={{
        background: '#0A0A0A', borderRadius: '4px',
        padding: '32px', marginBottom: '20px', color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: '#E8F000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} style={{ color: '#0A0A0A' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Optimizer</h2>
            <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>AI-powered suggestions to perfect your resume</p>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: 1.6, marginBottom: '24px' }}>
          Our AI analyzes your resume content and gives you targeted suggestions to increase your chances of getting interviews. Open any resume and use the <strong style={{ color: '#E8F000' }}>AI Optimizer</strong> tab in the editor sidebar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Impact Analysis', desc: 'Quantify your achievements' },
            { label: 'Keyword Match', desc: 'Job-specific keyword gaps' },
            { label: 'Tone Check', desc: 'Professional language review' },
          ].map((f) => (
            <div key={f.label} style={{ background: '#1A1A1A', borderRadius: '4px', padding: '16px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#E8F000', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                {f.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume list to open */}
      {resumes.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '20px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Select a Resume to Optimize
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {resumes.map((r) => (
              <Link key={r.id} href={`/resume/${r.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--bg-app)', borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', background: '#E8F000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={14} style={{ color: '#0A0A0A' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{r.title}</span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────
function SettingsPanel() {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '32px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 24px' }}>Account Settings</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {[
          { label: 'Email Notifications', desc: 'Receive tips and resume improvement reminders', checked: true },
          { label: 'Weekly ATS Reports', desc: 'Get your weekly resume health summary', checked: false },
          { label: 'AI Suggestions', desc: 'Let AI proactively suggest resume improvements', checked: true },
        ].map((s) => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px', background: 'var(--bg-app)', borderRadius: '4px', border: '1px solid var(--border-subtle)',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{s.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.desc}</div>
            </div>
            <div style={{
              width: '40px', height: '22px',
              background: s.checked ? '#E8F000' : '#E5E5E5',
              borderRadius: '100px', cursor: 'pointer', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '3px',
                left: s.checked ? '20px' : '3px',
                width: '16px', height: '16px',
                background: '#0A0A0A', borderRadius: '50%',
                transition: 'left 0.2s',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Support Panel ────────────────────────────────────────────
function SupportPanel() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '32px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px' }}>Need Help?</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Our support team is here to help you land your dream job.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { icon: Mail, label: 'Email Support', desc: 'support@careercraft.ai', action: 'mailto:support@careercraft.ai' },
            { icon: MessageCircle, label: 'Live Chat', desc: 'Available Mon–Fri, 9am–5pm', action: '#' },
          ].map((c) => (
            <a key={c.label} href={c.action} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '4px',
                padding: '20px', display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{ width: '36px', height: '36px', background: '#E8F000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.icon size={18} style={{ color: '#0A0A0A' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)' }}>{c.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '32px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 16px' }}>FAQ</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { q: 'How does ATS scoring work?', a: 'Our AI analyzes your resume against common ATS criteria including keywords, formatting, and section completeness.' },
            { q: 'Can I export my resume as PDF?', a: 'Yes! Use the Export button in the resume editor to download a PDF version of your resume.' },
            { q: 'How many resumes can I create?', a: 'Free users can create up to 3 resumes. Upgrade to Pro for unlimited resumes.' },
          ].map((faq) => (
            <div key={faq.q} style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '6px' }}>{faq.q}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'resumes';

  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }

    try {
      const { data: profile } = await supabase
        .from('profiles').select('is_banned').eq('id', session.user.id).single();

      if (profile?.is_banned) {
        toast.error('Your account has been suspended.');
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('resumes').select('*').order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      toast.error('Failed to load resumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm('Delete this resume?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
      setResumes(resumes.filter(r => r.id !== id));
      toast.success('Resume deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const startRename = (resume: any, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setRenamingId(resume.id); setRenameValue(resume.title);
  };

  const commitRename = async (id: string, e?: React.MouseEvent) => {
    e?.preventDefault(); e?.stopPropagation();
    if (!renameValue.trim()) return;
    try {
      const { error } = await supabase.from('resumes')
        .update({ title: renameValue.trim() }).eq('id', id);
      if (error) throw error;
      setResumes(resumes.map(r => r.id === id ? { ...r, title: renameValue.trim() } : r));
      toast.success('Renamed');
    } catch { toast.error('Failed to rename'); }
    finally { setRenamingId(null); }
  };

  const handleCreateNew = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from('resumes').insert([{
      user_id: session.user.id,
      title: 'Untitled Resume',
      content: {
        personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '' },
        experience: [], education: [], skills: [],
      },
      template_id: 'ats-clean',
    }]).select().single();

    if (error) { toast.error('Failed to create resume'); return; }
    toast.success('New resume created!');
    router.push(`/resume/${data.id}`);
  };

  const filtered = resumes.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TAB_TITLES: Record<string, string> = {
    resumes: 'My Resumes',
    ats: 'ATS Analysis',
    ai: 'AI Optimizer',
    settings: 'Settings',
    support: 'Support',
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden', background: 'var(--bg-app)' }}>
      <DashboardSidebar onCreateNew={handleCreateNew} />

      <main style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 60px' }}>

          {/* ── Header ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', alignItems: 'start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>
                {TAB_TITLES[activeTab] ?? 'My Resumes'}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                You&apos;re 3 steps away from your dream job.
              </p>
            </div>

            {/* Stat chips */}
            {[
              { icon: TrendingUp, label: 'Total Resumes', value: resumes.length },
              { icon: Target,     label: 'Avg ATS Score',  value: '84%' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px',
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '160px',
              }}>
                <div style={{
                  width: '36px', height: '36px', background: '#E8F000', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A',
                }}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tab-specific content ── */}
          {activeTab === 'ats' && <ATSAnalysisPanel resumes={resumes} />}
          {activeTab === 'ai'  && <AIOptimizerPanel resumes={resumes} />}
          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'support'  && <SupportPanel />}

          {/* ── Resumes Tab (default) ── */}
          {(activeTab === 'resumes' || !['ats','ai','settings','support'].includes(activeTab)) && (
            <>
              {/* Action Bar */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find a resume..."
                    style={{
                      width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px',
                      fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#E8F000')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
                  />
                </div>

                {[{ icon: Filter, label: 'Filter' }, { icon: Clock, label: 'Recent' }].map((btn) => (
                  <button key={btn.label} style={{
                    height: '42px', padding: '0 18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                    borderRadius: '4px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-app)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                  >
                    <btn.icon size={16} style={{ color: '#666' }} />
                    {btn.label}
                  </button>
                ))}

                <button onClick={handleCreateNew} id="dash-new-resume-btn" style={{
                  height: '42px', padding: '0 20px', background: '#0A0A0A', color: '#fff', border: 'none',
                  borderRadius: '100px', fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em', marginLeft: 'auto',
                }}>
                  <Plus size={16} /> New Resume
                </button>
              </div>

              {/* Content Grid */}
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {[1, 2, 3].map(i => <ResumeSkeleton key={i} />)}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '80px 40px', textAlign: 'center',
                        background: 'var(--bg-card)', border: '2px dashed var(--border-subtle)', borderRadius: '4px',
                      }}
                    >
                      <div style={{
                        width: '64px', height: '64px', background: 'var(--bg-app)', borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                      }}>
                        <FileText size={32} style={{ color: '#ccc' }} />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A0A', margin: '0 0 8px' }}>
                        No resumes found
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
                        {searchQuery ? `No results for "${searchQuery}".` : 'Start your professional journey today!'}
                      </p>
                      <button onClick={handleCreateNew} style={{
                        padding: '12px 28px', background: '#E8F000', color: '#0A0A0A',
                        border: 'none', borderRadius: '4px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer',
                      }}>
                        Create First Resume
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', paddingBottom: '40px' }}>
                      <AnimatePresence>
                        {filtered.map((resume, i) => (
                          <motion.div
                            key={resume.id} layout
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <ResumeCard
                              resume={resume}
                              deletingId={deletingId}
                              renamingId={renamingId}
                              renameValue={renameValue}
                              setRenameValue={setRenameValue}
                              setRenamingId={setRenamingId}
                              onDelete={handleDelete}
                              onStartRename={startRename}
                              onCommitRename={commitRename}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

// ─── Resume Card ──────────────────────────────────────────────
function ResumeCard({
  resume, deletingId, renamingId, renameValue,
  setRenameValue, setRenamingId,
  onDelete, onStartRename, onCommitRename,
}: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={hovered ? 'resume-card-hovered' : ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid var(--border-subtle)`,
        borderRadius: '4px', padding: '20px', display: 'flex',
        flexDirection: 'column', height: '100%', transition: 'border-color 0.15s, transform 0.15s',
        transform: hovered ? 'translateY(-3px)' : 'none', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#E8F000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A' }}>
            <FileText size={14} />
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Resume</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button onClick={(e) => onStartRename(resume, e)} title="Rename" style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Pencil size={13} />
          </button>
          <button onClick={(e) => onDelete(resume.id, e)} title="Delete" style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #fca5a5', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
            {deletingId === resume.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>

      {/* Preview */}
      <Link href={`/resume/${resume.id}`} style={{ textDecoration: 'none', display: 'block', flex: 1 }}>
        <div style={{ aspectRatio: '3/4', background: 'var(--bg-app)', borderRadius: '4px', marginBottom: '16px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '70%', display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.35 }}>
            <div style={{ height: '10px', background: 'var(--text-main)', borderRadius: '2px', width: '100%' }} />
            <div style={{ height: '6px', background: 'var(--text-muted)', borderRadius: '2px', width: '70%' }} />
            <div style={{ height: '1px', background: '#E8F000', borderRadius: '1px', width: '100%', margin: '4px 0' }} />
            <div style={{ height: '5px', background: '#ccc', borderRadius: '2px', width: '90%' }} />
            <div style={{ height: '5px', background: '#ccc', borderRadius: '2px', width: '75%' }} />
            <div style={{ height: '5px', background: '#ccc', borderRadius: '2px', width: '60%' }} />
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#E8F000', color: '#0A0A0A', fontSize: '0.6rem', fontWeight: 800, padding: '3px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Target size={10} />92 pts
          </div>
          {hovered && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(232,240,0,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8F000' }}>
                <ArrowRight size={20} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A0A0A' }}>Edit Now</span>
            </div>
          )}
        </div>

        <div>
          {renamingId === resume.id ? (
            <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.preventDefault()}>
              <input
                autoFocus value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onCommitRename(resume.id); if (e.key === 'Escape') setRenamingId(null); }}
                style={{ flex: 1, border: '2px solid #E8F000', borderRadius: '4px', padding: '6px 10px', fontSize: '0.875rem', fontWeight: 700, outline: 'none', background: '#fff', color: '#0A0A0A' }}
              />
              <button onClick={(e) => onCommitRename(resume.id, e)} style={{ padding: '6px 10px', background: '#E8F000', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#0A0A0A', fontWeight: 800 }}>
                <Check size={16} />
              </button>
            </div>
          ) : (
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0A0A0A', margin: 0, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resume.title}
            </h3>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#999' }}>
              <Calendar size={13} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F6F3F2', padding: '3px 8px', borderRadius: '100px' }}>
              <Sparkles size={11} style={{ color: '#0A0A0A' }} />
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0A0A0A' }}>Optimized</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
