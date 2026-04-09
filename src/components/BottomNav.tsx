import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, LayoutGrid, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovies } from '../context/MovieContext';

const BottomNav: React.FC = () => {
    const location = useLocation();
    const { isPlayerOpen } = useMovies();
    const [isLandscape, setIsLandscape] = React.useState(window.innerWidth > window.innerHeight);

    React.useEffect(() => {
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const isHidden = [
        '/login', 
        '/signup', 
        '/profiles'
    ].includes(location.pathname) || 
    (isPlayerOpen && isLandscape);

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/movies', icon: LayoutGrid, label: 'Catalog' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/favorites', icon: Heart, label: 'Favorites' },
        { path: '/account', icon: Settings, label: 'Settings' },
    ];


    if (isHidden) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-[6000] flex justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+1.2rem)] pointer-events-none">
            <div className="relative w-full max-w-md pointer-events-auto h-[72px]">
                {/* Background Glass Layer */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl rounded-[28px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                
                {/* Navigation Items */}
                <div className="relative z-10 flex items-center justify-between px-4 h-full">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const IconComp = item.icon;
                        
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="flex flex-col items-center justify-center flex-1 h-full gap-1"
                            >
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="flex items-center justify-center"
                                >
                                    <IconComp 
                                        className={`w-6 h-6 transition-colors duration-300 ${
                                            isActive ? 'text-[#FFB800]' : 'text-zinc-500'
                                        }`} 
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                                <span className={`text-[10px] font-medium tracking-tight transition-colors duration-300 ${
                                    isActive ? 'text-[#FFB800]' : 'text-zinc-500'
                                }`}>
                                    {item.label}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-nav-dot"
                                        className="absolute -bottom-1 w-1 h-1 bg-[#FFB800] rounded-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNav;
