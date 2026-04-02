import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { 
    Search, 
    Sparkles, 
    Film, 
    Tv, 
    Home, 
    LogOut, 
    LayoutDashboard,
    Bell,
    ChevronDown,
    X,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAdmin } = useAuth();
    const { isPlayerOpen, selectedMovie } = useMovies();
    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    
    // Hide Navbar during video playback, discovery modal, auth pages, or if on Mobile
    const isHidden = [
        '/login', 
        '/signup', 
        '/profiles'
    ].includes(location.pathname) || 
    isPlayerOpen || 
    selectedMovie ||
    Capacitor.isNativePlatform();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isHidden) return null;

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/movies', label: 'Movies', icon: Film },
        { path: '/tvshows', icon: Tv, label: 'Series' },
        { path: '/trending', icon: Sparkles, label: 'Trending' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-[5000] px-8 flex items-center justify-between transition-all duration-700
            ${isScrolled 
                ? 'bg-black/60 backdrop-blur-2xl py-3 border-b border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.8)]' 
                : 'bg-black/40 backdrop-blur-md py-5 border-b border-white/5 shadow-[0_4px_32px_rgba(0,0,0,0.5)]'}
        `}>
            <div 
                onClick={() => navigate('/')}
                className="flex items-center gap-4 cursor-pointer group"
            >
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-[0.2em] text-white leading-none group-hover:text-[#DAA520] transition-colors uppercase">Filamu</span>
                        <span className="text-[8px] font-black tracking-[0.5em] text-[#DAA520] uppercase">Times</span>
                    </div>
                </div>
            </div>

            {/* Center Section: Cinematic Menu */}
            <div className="hidden lg:flex items-center gap-12">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative py-2
                            ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white hover:scale-105'}
                        `}
                    >
                        <link.icon className={`w-4 h-4 transition-colors ${location.pathname === link.path ? 'text-[#E50914]' : ''}`} />
                        {link.label}
                    </NavLink>
                ))}

                {isAdmin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `
                            flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500
                            ${isActive ? 'text-white' : 'text-[#E50914]/60 hover:text-[#E50914]'}
                        `}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin
                    </NavLink>
                )}
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-8">
                <div ref={searchRef} className="relative flex items-center">
                    <AnimatePresence>
                        {isSearchOpen ? (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 280, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="relative"
                            >
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search originals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-10 text-xs text-white focus:outline-none focus:border-[#E50914]/50 w-full font-bold tracking-tight"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <button 
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-zinc-600 hover:text-white" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-zinc-400 hover:text-white transition-all group"
                            >
                                <Search className="w-5 h-5 group-hover:scale-110" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="hidden sm:flex items-center gap-8">
                    <button className="text-zinc-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E50914] rounded-full border-2 border-black" />
                    </button>

                    <div 
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-[#E50914] transition-all relative">
                            <User className="w-5 h-5 text-zinc-400 group-hover:text-[#E50914]" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 rounded-lg text-zinc-500 hover:text-white transition-all group lg:hidden"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
