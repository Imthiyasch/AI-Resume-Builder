'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, FileText, Loader2, Calendar, Trash2, Pencil,
  Check, Search, Sparkles, TrendingUp, Target, Clock,
  Filter, ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DashboardSidebar from '@/components/DashboardSidebar';

// ─── Skeleton ────────────────────────────────────────────────
function ResumeSkeleton() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E5E5',
      borderRadius: '4px',
      padding: '20px',
      animation: 'pulse 1.5s infinite',
    }}>
      <div style={{ aspectRatio: '3/4', background: '#F0EDEC', borderRadius: '4px', marginBottom: '16px' }} />
      <div style={{ height: '12px', background: '#E5E2E1', borderRadius: '2px', width: '75%', marginBottom: '8px' }} />
      <div style={{ height: '10px', background: '#E5E2E1', borderRadius: '2px', width: '50%' }} />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
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

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden', background: '#F6F3F2' }}>
      <DashboardSidebar onCreateNew={handleCreateNew} />

      <main style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 60px' }}>

          {/* ── Header ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', alignItems: 'start', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0A0A0A', margin: 0 }}>
                My Resumes
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                You&apos;re 3 steps away from your dream job.
              </p>
            </div>

            {/* Stat chips */}
            {[
              { icon: TrendingUp, label: 'Total Resumes', value: resumes.length },
              { icon: Target,     label: 'Avg ATS Score',  value: '84%' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '160px',
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: '#E8F000',
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0A0A0A',
                }}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0A0A0A', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Action Bar ── */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a resume..."
                style={{
                  width: '100%',
                  height: '42px',
                  paddingLeft: '42px',
                  paddingRight: '16px',
                  background: '#fff',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#0A0A0A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#E8F000')}
                onBlur={e => (e.target.style.borderColor = '#E5E5E5')}
              />
            </div>

            {/* Filter / Recent buttons */}
            {[
              { icon: Filter, label: 'Filter' },
              { icon: Clock,  label: 'Recent' },
            ].map((btn) => (
              <button key={btn.label} style={{
                height: '42px',
                padding: '0 18px',
                background: '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0A0A0A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F6F3F2')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <btn.icon size={16} style={{ color: '#666' }} />
                {btn.label}
              </button>
            ))}

            {/* New Resume (mobile visible) */}
            <button
              onClick={handleCreateNew}
              id="dash-new-resume-btn"
              style={{
                height: '42px',
                padding: '0 20px',
                background: '#0A0A0A',
                color: '#fff',
                border: 'none',
                borderRadius: '100px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.01em',
                marginLeft: 'auto',
              }}
            >
              <Plus size={16} /> New Resume
            </button>
          </div>

          {/* ── Content Grid ── */}
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
                    padding: '80px 40px',
                    textAlign: 'center',
                    background: '#fff',
                    border: '2px dashed #E5E5E5',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{
                    width: '64px', height: '64px',
                    background: '#F6F3F2',
                    borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <FileText size={32} style={{ color: '#ccc' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A0A', margin: '0 0 8px' }}>
                    No resumes found
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
                    {searchQuery
                      ? `No results for "${searchQuery}".`
                      : 'Start your professional journey today!'}
                  </p>
                  <button
                    onClick={handleCreateNew}
                    style={{
                      padding: '12px 28px',
                      background: '#E8F000',
                      color: '#0A0A0A',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Create First Resume
                  </button>
                </motion.div>
              ) : (
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', paddingBottom: '40px' }}>
                  <AnimatePresence>
                    {filtered.map((resume, i) => (
                      <motion.div
                        key={resume.id}
                        layout
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
        </div>
      </main>
    </div>
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#0A0A0A' : '#E5E5E5'}`,
        borderRadius: '4px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'border-color 0.15s, transform 0.15s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Card top actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#E8F000',
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A0A0A',
          }}>
            <FileText size={14} />
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999' }}>Resume</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button
            onClick={(e) => onStartRename(resume, e)}
            title="Rename"
            style={{
              width: '28px', height: '28px', borderRadius: '4px',
              border: '1px solid #E5E5E5', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#666',
            }}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => onDelete(resume.id, e)}
            title="Delete"
            style={{
              width: '28px', height: '28px', borderRadius: '4px',
              border: '1px solid #fca5a5', background: '#fff5f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#ef4444',
            }}
          >
            {deletingId === resume.id
              ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
              : <Trash2 size={13} />}
          </button>
        </div>
      </div>

      {/* Preview box */}
      <Link href={`/resume/${resume.id}`} style={{ textDecoration: 'none', display: 'block', flex: 1 }}>
        <div style={{
          aspectRatio: '3/4',
          background: '#F6F3F2',
          borderRadius: '4px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #E5E5E5',
        }}>
          {/* Mock lines */}
          <div style={{ width: '70%', display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.35 }}>
            <div style={{ height: '10px', background: '#0A0A0A', borderRadius: '2px', width: '100%' }} />
            <div style={{ height: '6px', background: '#888', borderRadius: '2px', width: '70%' }} />
            <div style={{ height: '1px', background: '#E8F000', borderRadius: '1px', width: '100%', margin: '4px 0' }} />
            <div style={{ height: '5px', background: '#ccc', borderRadius: '2px', width: '90%' }} />
            <div style={{ height: '5px', background: '#ccc', borderRadius: '2px', width: '75%' }} />
            <div style={{ height: '5px', background: '#ccc', borderRadius: '2px', width: '60%' }} />
          </div>

          {/* ATS Badge */}
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            background: '#E8F000', color: '#0A0A0A',
            fontSize: '0.6rem', fontWeight: 800,
            padding: '3px 8px', borderRadius: '100px',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <Target size={10} />92 pts
          </div>

          {/* Hover overlay */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(232,240,0,0.12)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#0A0A0A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#E8F000',
              }}>
                <ArrowRight size={20} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A0A0A' }}>
                Edit Now
              </span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div>
          {renamingId === resume.id ? (
            <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.preventDefault()}>
              <input
                autoFocus
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') onCommitRename(resume.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                style={{
                  flex: 1, border: '2px solid #E8F000', borderRadius: '4px',
                  padding: '6px 10px', fontSize: '0.875rem', fontWeight: 700,
                  outline: 'none', background: '#fff', color: '#0A0A0A',
                }}
              />
              <button
                onClick={(e) => onCommitRename(resume.id, e)}
                style={{
                  padding: '6px 10px', background: '#E8F000', border: 'none',
                  borderRadius: '4px', cursor: 'pointer', color: '#0A0A0A', fontWeight: 800,
                }}
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <h3 style={{
              fontSize: '0.95rem', fontWeight: 800, color: '#0A0A0A',
              margin: 0, letterSpacing: '-0.01em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
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
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: '#F6F3F2', padding: '3px 8px', borderRadius: '100px',
            }}>
              <Sparkles size={11} style={{ color: '#0A0A0A' }} />
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0A0A0A' }}>
                Optimized
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
