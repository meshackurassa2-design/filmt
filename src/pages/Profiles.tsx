import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, LogIn, ChevronLeft } from 'lucide-react';
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
        <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden py-20">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-[#E50914]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[#E50914]/5 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-6">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#E50914] transition-all group z-50"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#E50914]/50">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Home</span>
                </motion.button>

                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-5xl md:text-7xl text-center font-black mb-20 select-none tracking-tighter uppercase"
                >
                    Who's watching?
                </motion.h1>

                <div className="flex flex-col items-center gap-10 group">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => navigate('/')}
                        className="relative w-48 md:w-64 h-48 md:h-64 rounded-3xl p-1 bg-gradient-to-br from-white/10 to-transparent border border-white/5 transition-all duration-500 cursor-pointer shadow-2xl overflow-hidden"
                    >
                        <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-zinc-900 border border-white/10">
                            <img 
                                src={getProfileImage()} 
                                alt="Profile Avatar" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#E50914]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full glass flex items-center justify-center border border-white/20">
                                <LogIn className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Active Profile</span>
                        <div className="text-white text-3xl md:text-4xl font-black text-center uppercase tracking-tighter">
                            {profile?.username || 'Filamu Member'}
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center gap-4 mt-24"
                >
                    <button 
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-2 px-10 py-4 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:border-[#E50914]/50 hover:text-white transition-all select-none"
                    >
                        <Settings className="w-4 h-4" />
                        Manage Profile
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Profiles;

