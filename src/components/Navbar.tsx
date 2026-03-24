'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FileText, LogOut, LayoutDashboard, ShieldCheck, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setIsDark(savedTheme === 'dark');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toast.success(`Switched to ${newTheme} mode`);
    };

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single();
        setIsAdmin(data?.is_admin || false);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user || null;
            setUser(currentUser);
            if (currentUser) fetchProfile(currentUser.id);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event: any, session: any) => {
                const currentUser = session?.user || null;
                setUser(currentUser);
                if (currentUser) {
                    fetchProfile(currentUser.id);
                } else {
                    setIsAdmin(false);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Signed out successfully');
        router.push('/');
    };

    const avatarUrl = user?.user_metadata?.avatar_url;
    const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    return (
        <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }} className="backdrop-blur-xl shadow-2xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
                <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl hover:scale-105 transition-transform duration-200">
                    <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span>AI Resume Builder</span>
                </Link>

                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-zinc-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-pink-400 hover:text-pink-300 flex items-center gap-1.5 font-medium transition-colors"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="hidden sm:inline">Admin</span>
                                </Link>
                            )}

                            {/* User Avatar + Name */}
                            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={fullName}
                                        className="w-8 h-8 rounded-full border-2 border-indigo-500/50 object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                        {fullName[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-sm text-zinc-300 hidden md:inline font-medium max-w-[120px] truncate">
                                    {fullName}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-zinc-400 hover:text-red-400 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95"
                        >
                            Sign In with Google
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
