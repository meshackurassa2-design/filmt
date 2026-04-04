import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Rocket, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    phone,
                    gender
                }
            }
        });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black overflow-x-hidden flex flex-col">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000"
                    alt="Background"
                    className="w-full h-full object-cover filter brightness-[0.2] contrast-125 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            </div>

            {/* Glowing Spotlight */}
            <div className="absolute top-1/4 right-1/4 w-[50vw] h-[50vw] bg-[#E50914]/5 rounded-full blur-[120px] pointer-events-none" />

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

            <main className="relative z-10 flex-1 flex items-center justify-center p-6 py-12 md:py-20">
                <motion.div 
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-black/80 backdrop-blur-3xl w-full max-w-lg rounded-2xl p-10 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.5)]" />
                    
                    <div className="mb-10">
                        <h2 className="text-4xl font-black mb-3 text-white tracking-tight uppercase">Join Filamu Originals</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Stream Premium Content Across Africa</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#E50914] transition-colors" />
                                <input 
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all font-bold tracking-tight text-sm uppercase"
                                    placeholder="USERNAME"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#E50914] transition-colors" />
                                <input 
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all font-bold tracking-tight text-sm uppercase"
                                    placeholder="PHONE"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#E50914] transition-colors" />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all font-bold tracking-tight text-sm uppercase"
                                    placeholder="EMAIL ADDRESS"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#E50914] transition-colors" />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all font-bold tracking-tight text-sm uppercase"
                                    placeholder="PASSWORD"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Choose Gender</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setGender('male')}
                                    className={`py-4 rounded-lg border font-black uppercase text-xs tracking-widest transition-all ${
                                        gender === 'male' 
                                            ? 'bg-[#E50914] border-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.3)]' 
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender('female')}
                                    className={`py-4 rounded-lg border font-black uppercase text-xs tracking-widest transition-all ${
                                        gender === 'female' 
                                            ? 'bg-[#E50914] border-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.3)]' 
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" className="hidden peer" required />
                                <div className="mt-1 w-5 h-5 rounded-sm border border-white/20 peer-checked:bg-[#E50914] peer-checked:border-[#E50914] transition-all flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors leading-relaxed">
                                    I agree to the <span className="text-white underline decoration-[#E50914]">Terms</span> and <span className="text-white underline decoration-[#E50914]">Privacy Policy</span>.
                                </span>
                            </label>
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
                                    <span>Get Started</span>
                                    <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                                Already registered? <Link to="/login" className="text-white hover:text-[#E50914] font-black ml-1 transition-colors underline decoration-[#E50914]">Sign In.</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </main>

            <footer className="relative z-10 pt-8 px-8 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-center bg-black/40 backdrop-blur-xl border-t border-white/5 mt-auto">
                <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                    Filamu Originals • African Cinematic Universe
                </p>
            </footer>
        </div>
    );
}

export default SignUp;


