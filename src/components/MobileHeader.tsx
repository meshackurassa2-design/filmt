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
        </div>
    );
};

export default MobileHeader;
