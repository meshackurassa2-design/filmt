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

            <div className="relative pt-[env(safe-area-inset-top)] px-6 flex justify-between items-start pointer-events-auto">
                <div className="pt-3">
                    <button className="text-white/60 hover:text-white transition-opacity active:scale-95 z-50">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7H14M4 12H20M4 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                
                {/* Center Notch for FT */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pt-[env(safe-area-inset-top)] flex justify-center">
                    <div className="bg-black/90 backdrop-blur-3xl px-12 pb-5 pt-2 rounded-b-[45px] border-b border-x border-white/10 shadow-[0_25px_40px_rgba(0,0,0,0.9)] relative">
                        <span className="text-primary text-2xl font-black italic tracking-tighter drop-shadow-[0_0_12px_rgba(255,184,0,0.8)]">FT</span>
                    </div>
                </div>

                <div className="w-6 h-6"></div> {/* Spacer to balance flex layout */}
            </div>
        </div>
    );
};

export default MobileHeader;
