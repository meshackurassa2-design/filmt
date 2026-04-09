import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';

const Hero: React.FC = () => {
    const { allMovies } = useMovies();
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const featuredMovies = allMovies.slice(0, 5);
    const centerMovie = featuredMovies[currentIndex];

    // Carousel auto-play
    useEffect(() => {
        if (featuredMovies.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [featuredMovies.length]);

    const handlePlay = (id: string) => {
        navigate(`/watch/${id}`);
    };

    if (!centerMovie) return null;

    return (
        <div className="relative w-full pt-10 pb-16 flex flex-col items-center bg-transparent overflow-hidden font-sans">
            
            {/* 1. Overlapping Cards Carousel */}
            <div className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center">
                <div className="relative w-full h-full flex justify-center items-center">
                    {featuredMovies.map((movie, index) => {
                        const isCenter = index === currentIndex;
                        const isPrev = index === (currentIndex - 1 + featuredMovies.length) % featuredMovies.length;
                        const isNext = index === (currentIndex + 1) % featuredMovies.length;

                        // Only render center and immediate neighbors
                        if (!isCenter && !isPrev && !isNext) return null;

                        let x = 0;
                        let scale = isCenter ? 1 : 0.72;
                        let zIndex = isCenter ? 30 : 10;
                        let opacity = isCenter ? 1 : 0.35;
                        let blur = isCenter ? 0 : 5;

                        if (isPrev) x = -105; // Slightly tighter for mobile
                        if (isNext) x = 105;

                        return (
                            <motion.div
                                key={movie.id}
                                onClick={() => isCenter ? handlePlay(movie.id) : setCurrentIndex(index)}
                                className={`absolute rounded-[32px] overflow-hidden cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10`}
                                initial={false}
                                animate={{
                                    x: x,
                                    scale: scale,
                                    zIndex: zIndex,
                                    opacity: opacity,
                                    filter: `blur(${blur}px)`,
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                style={{ 
                                    width: '210px', // Slightly smaller for better screen fit
                                    height: '300px',
                                    transformOrigin: 'center center'
                                }}
                            >
                                <img 
                                    src={movie.image} 
                                    alt={movie.title} 
                                    className="w-full h-full object-cover"
                                />
                                {isCenter ? (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                                ) : (
                                    <div className="absolute inset-0 bg-black/40" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Centered Movie Details Section (Below Poster) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={centerMovie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 flex flex-col items-center text-center px-6 w-full"
                >
                    <span className="text-zinc-600 text-sm font-black tracking-[0.1em] mb-1">
                        {centerMovie.releaseYear || '2025'}
                    </span>
                    <h2 className="text-white text-3xl font-black tracking-tight mb-4 uppercase">
                        {centerMovie.title}
                    </h2>
                    
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-black uppercase tracking-[0.15em] mb-6">
                        <span>{centerMovie.genre || 'Action'}</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span>1h 58min</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="flex items-center gap-1 text-primary">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{centerMovie.rating || '7.5'}</span>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-1.5">
                        {featuredMovies.map((_, i) => (
                            <div 
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
                                }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Hero;
