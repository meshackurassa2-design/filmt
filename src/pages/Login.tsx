import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1485090916855-2363e7a30748?q=80&w=2000"
                    alt="Background"
                    className="w-full h-full object-cover filter brightness-[0.25] contrast-125 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            </div>

            {/* Glowing Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#E50914]/5 rounded-full blur-[120px] pointer-events-none" />

            <nav className="relative z-10 pt-[calc(env(safe-area-inset-top)+2rem)] px-8 pb-8 md:px-12 flex items-center justify-between">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                    onClick={() => navigate('/')}
                >
                </motion.div>
                <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors uppercase font-black tracking-widest">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Link>
            </nav>

            <main className="relative z-10 flex-1 flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-black/80 backdrop-blur-3xl w-full max-w-md rounded-2xl p-10 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.5)]" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <h2 className="text-4xl font-black mb-3 text-white tracking-tight uppercase text-center">Identity Check</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] text-center">Authorized Access Required</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-widest"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#E50914] transition-colors" />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all font-bold tracking-tight"
                                    placeholder="EMAIL ADDRESS"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#E50914] transition-colors" />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all font-bold tracking-tight"
                                    placeholder="PASSWORD"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="hidden peer" />
                                <div className="w-5 h-5 rounded-sm border border-white/20 peer-checked:bg-[#E50914] peer-checked:border-[#E50914] transition-all flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <button type="button" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#E50914] transition-colors">Forgot?</button>
                        </div>

                        <button 
                            disabled={loading} 
                            className="btn-primary w-full group py-4 h-14"
                        >
                            {loading ? (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                                New here? <Link to="/signup" className="text-white hover:text-[#E50914] font-black ml-1 transition-colors underline decoration-[#E50914]">Join now.</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </main>

            <footer className="relative z-10 pt-8 px-8 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-center bg-black/40 backdrop-blur-xl border-t border-white/5">
                <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                    Filamu Originals • African Cinematic Universe
                </p>
            </footer>
        </div>
    );
}

export default Login;


