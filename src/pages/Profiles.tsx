import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import maleDefault from '../assets/avatars/male-black-avatar.png';
import femaleDefault from '../assets/avatars/female-black-avatar.png';

const Profiles: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const getProfileImage = () => {
        if (profile?.avatar_url) return profile.avatar_url;
        if (profile?.gender?.toLowerCase() === 'female') return femaleDefault;
        return maleDefault;
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden pt-[calc(env(safe-area-inset-top)+2rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] font-sans">
            {/* 1. Cinematic Background Backdrop */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-black to-black" />
                <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-[50vw] h-[50vw] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-6">
                
                {/* Branding Badge */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-12 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl"
                >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Filamu Premium Member</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-5xl md:text-7xl text-center font-black mb-16 tracking-tighter uppercase italic"
                >
                    Who's watching?
                </motion.h1>

                <div className="flex flex-col items-center gap-10 group">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="relative w-56 h-56 md:w-72 md:h-72 rounded-[40px] p-1.5 bg-gradient-to-br from-white/20 to-transparent border border-white/20 transition-all duration-500 cursor-pointer shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        <div className="w-full h-full rounded-[34px] overflow-hidden bg-zinc-900 border border-white/5 relative">
                            <img 
                                src={getProfileImage()} 
                                alt="Profile Avatar" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </div>
                        
                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                                <LogIn className="w-10 h-10 text-white fill-current" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="text-white text-4xl md:text-5xl font-black text-center uppercase tracking-tighter italic">
                            {profile?.username || 'Filamu Member'}
                        </div>
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Personal Library Ready</span>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-20"
                >
                    <button 
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-3 px-12 py-5 rounded-3xl bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] hover:border-primary/50 hover:text-white hover:bg-primary/5 transition-all shadow-xl"
                    >
                        <Settings className="w-4 h-4" />
                        Management Center
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Profiles;

