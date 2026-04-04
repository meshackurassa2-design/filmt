import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Film, User } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';
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
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/movies', icon: Film, label: 'Movies' },
        { path: '/account', icon: User, label: 'Profile' },
    ];

    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    
    // Spring physics for smooth movement
    const xOffsetSpring = useSpring(activeIndex === -1 ? 0 : activeIndex * 25 + 12.5, {
        stiffness: 300,
        damping: 30
    });

    const pathD = useTransform(xOffsetSpring, (x) => {
        const center = x * 4; 
        const width = 45; 
        const depth = 35; 
        return `
            M 0,20 
            Q 0,0 20,0 
            L ${center - width},0 
            C ${center - width/2},0 ${center - width/2},${depth} ${center},${depth} 
            C ${center + width/2},${depth} ${center + width/2},0 ${center + width},0 
            L 380,0 
            Q 400,0 400,20 
            L 400,80 
            L 0,80 
            Z
        `;
    });

    if (isHidden) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-[6000] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pointer-events-none">
            <div className="relative w-full max-w-sm pointer-events-auto group">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl rounded-[40px] border border-white/10 -z-10" />
                {/* Custom SVG Tab Bar with "Dip" */}
                <svg
                    width="100%"
                    height="80"
                    viewBox="0 0 400 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-0 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        d={pathD}
                        fill="rgba(0,0,0,0.6)"
                    />
                </svg>

                {/* Navigation Items */}
                <div className="relative z-10 flex items-center justify-between px-2 h-20">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const IconComp = item.icon;
                        
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center justify-center w-1/4 h-full"
                            >
                                <motion.div
                                    animate={{
                                        y: isActive ? 10 : 0,
                                        scale: isActive ? 1.2 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`relative z-20 flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300`}
                                >
                                    <IconComp 
                                        className={`w-6 h-6 transition-colors duration-500 ${
                                            isActive ? 'text-white' : 'text-zinc-500'
                                        }`} 
                                        strokeWidth={isActive ? 3 : 2}
                                    />
                                </motion.div>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-dot"
                                        className="absolute bottom-3 w-1.5 h-1.5 bg-white rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
