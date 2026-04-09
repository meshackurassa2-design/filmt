import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';

const MobileHeader: React.FC = () => {
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

    if (isHidden) return null;

    return (
        <div className="fixed top-0 inset-x-0 z-[6000] pointer-events-none">
            {/* Top Black Gradient for Immersive Fullscreen */}
            <div className="absolute inset-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />

            <div className="relative pt-[env(safe-area-inset-top)] px-6 flex justify-center items-start pointer-events-auto">
                {/* Center Notch for FT */}
                <div className="relative pt-[env(safe-area-inset-top)] flex justify-center w-full">
                    <div className="bg-black/80 backdrop-blur-2xl px-10 pb-4 pt-1.5 rounded-b-[38px] border-b border-x border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
                        <span className="text-[#FFB800] text-xl font-black italic tracking-tighter drop-shadow-[0_0_10px_rgba(255,184,0,0.6)]">FT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileHeader;
