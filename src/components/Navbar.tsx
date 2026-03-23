'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FileText, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            const { data } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', userId)
                .single();
            setIsAdmin(data?.is_admin || false);
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = (session as any)?.user || null;
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
        router.push('/');
    };

    return (
        <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
                <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl hover:scale-105 transition-transform duration-200">
                    <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span>AI Resume Builder</span>
                </Link>
                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-zinc-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-pink-400 hover:text-pink-300 flex items-center gap-1.5 font-medium transition-colors"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Admin
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="text-zinc-400 hover:text-red-400 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-zinc-400 hover:text-white font-medium transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95"
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
