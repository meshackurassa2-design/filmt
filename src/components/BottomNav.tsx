import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Home, Film, Tv, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovies } from '../context/MovieContext';

const BottomNav: React.FC = () => {
    const location = useLocation();
    const { isPlayerOpen, selectedMovie } = useMovies();
    
    // Hide BottomNav during video playback, on auth pages, or if on Desktop
    const isHidden = [
        '/login', 
        '/signup', 
        '/profiles'
    ].includes(location.pathname) || 
    isPlayerOpen || 
    selectedMovie || 
    !Capacitor.isNativePlatform();

    if (isHidden) return null;

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/movies', icon: Film, label: 'Movies' },
        { path: '/tvshows', icon: Tv, label: 'Series' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/account', icon: User, label: 'Account' },
    ];

    return (
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[5000] w-[90%] max-w-md"
        >
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around relative overflow-hidden">
                {/* Subtle light sweep animation */}
                <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                />

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const IconComp = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`relative flex flex-col items-center gap-1.5 py-2 px-4 transition-all duration-500 rounded-2xl group ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-white/5 rounded-2xl z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            
                            <div className="relative z-10 flex flex-col items-center">
                                {IconComp && (
                                    <IconComp className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-110 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110'}`} />
                                )}
                                <span className={`text-[9px] font-black uppercase tracking-[0.1em] mt-1 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                                    {item.label}
                                </span>
                            </div>

                            {isActive && (
                                <motion.div 
                                    layoutId="active-indicator"
                                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                                />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default BottomNav;
