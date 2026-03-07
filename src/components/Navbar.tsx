'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FileText, LogOut, LayoutDashboard } from 'lucide-react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user || null);
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
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
                <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl drop-shadow-md">
                    <FileText className="w-6 h-6 text-pink-400" />
                    <span>AI Resume Builder</span>
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-zinc-400 hover:text-red-400 flex items-center gap-1 font-medium transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-zinc-400 hover:text-white font-medium transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 transition shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
