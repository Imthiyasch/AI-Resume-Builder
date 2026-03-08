'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Mail, Loader2, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    return (
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="max-w-md w-full space-y-8 bg-black/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10">
                <div>
                    <div className="mx-auto w-14 h-14 bg-white/5 border border-white/10 shadow-inner rounded-full flex items-center justify-center">
                        <KeyRound className="h-7 w-7 text-pink-400" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                        Reset password
                    </h2>
                    <p className="mt-2 text-center text-sm text-indigo-200/70">
                        Remember your password?{' '}
                        <Link href="/login" className="font-medium text-pink-400 hover:text-pink-300 transition-colors drop-shadow-sm">
                            Log in here
                        </Link>
                    </p>
                </div>

                {success ? (
                    <div className="bg-green-950/30 text-green-400 p-4 rounded-lg text-center border border-green-900/50">
                        <h3 className="font-bold text-lg mb-2">Check your email</h3>
                        <p>We've sent a password reset link to {email}. Click the link to choose a new password.</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleReset}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none relative block w-full px-3 py-3 pl-10 bg-zinc-900 border border-zinc-700 placeholder-zinc-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-colors"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900/50 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    'Send reset link'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
