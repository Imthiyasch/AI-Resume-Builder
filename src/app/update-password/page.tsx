'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, KeyRound } from 'lucide-react';

export default function UpdatePassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // When the user clicks the link in their email, they will be redirected to this page.
        // Supabase will automatically parse the access token from the URL and establish a session.
        // We want to make sure the user has a session before letting them update the password.
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('No active session found. Please request a new password reset link.');
            }
        };
        checkUser();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
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
                        Update password
                    </h2>
                    <p className="mt-2 text-center text-sm text-indigo-200/70">
                        Enter your new secure password below.
                    </p>
                </div>

                {success ? (
                    <div className="bg-green-950/30 text-green-400 p-4 rounded-lg text-center border border-green-900/50">
                        <h3 className="font-bold text-lg mb-2">Password Updated!</h3>
                        <p>Your password has been successfully updated. Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="password">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        className="appearance-none relative block w-full px-3 py-3 pl-10 bg-zinc-900 border border-zinc-700 placeholder-zinc-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-colors"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                disabled={loading || error !== null}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
