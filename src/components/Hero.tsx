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
            {/* 0. Immersive Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`bg-${centerMovie.id}`}
                        initial={{ opacity: 0, scale: 1.15 }}
                        animate={{ opacity: 0.45, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {/* High-Contrast Blurred Image */}
                        <img 
                            src={centerMovie.image} 
                            alt="" 
                            className="w-full h-full object-cover blur-[120px] brightness-[0.25] saturate-[1.6]"
                        />
                        {/* Advanced Masking */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 1. Overlapping Cards Carousel - Premium Cinematic Scale */}
            <div className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center overflow-visible pointer-events-none mt-4">
                <div className="relative flex items-center justify-center w-full h-full pointer-events-auto">
                    {featuredMovies.map((movie, index) => {
                        const isCenter = index === currentIndex;
                        const isPrev = index === (currentIndex - 1 + featuredMovies.length) % featuredMovies.length;
                        const isNext = index === (currentIndex + 1) % featuredMovies.length;

                        if (!isCenter && !isPrev && !isNext) return null;

                        let scale = isCenter ? 1 : 0.75;
                        let zIndex = isCenter ? 30 : 10;
                        let opacity = isCenter ? 1 : 0.45;
                        let blur = isCenter ? 0 : 4;
                        
                        return (
                            <motion.div
                                key={movie.id}
                                onClick={() => isCenter ? handlePlay(movie.id) : setCurrentIndex(index)}
                                className={`${isCenter ? 'relative' : 'absolute'} rounded-[32px] overflow-hidden cursor-pointer shadow-[0_35px_80px_rgba(0,0,0,0.9)] border border-white/20`}
                                initial={false}
                                animate={{
                                    x: isCenter ? 0 : (isPrev ? -140 : 140),
                                    scale: scale,
                                    zIndex: zIndex,
                                    opacity: opacity,
                                    filter: `blur(${blur}px)`,
                                }}
                                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                                style={{ 
                                    width: '280px',
                                    height: '400px',
                                    flexShrink: 0,
                                    transformOrigin: 'center center'
                                }}
                            >
                                <img 
                                    src={movie.image} 
                                    alt={movie.title} 
                                    className="w-full h-full object-cover"
                                />

                                {isCenter && (
                                    <>
                                        {/* New Season Badge (Top Right) */}
                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-20">
                                            <span className="text-white/80 text-[10px] font-black uppercase tracking-wider">New Season</span>
                                        </div>

                                        {/* Content Overlay (Bottom) */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-start gap-4">
                                            {/* Title */}
                                            <h2 className="text-white text-3xl font-black tracking-tighter uppercase leading-[0.85] text-left">
                                                {movie.title}
                                            </h2>

                                            {/* Metadata Chips */}
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
                                                    <span className="text-zinc-300 text-[10px] font-black tracking-widest uppercase">
                                                        {movie.releaseYear || '2025'}
                                                    </span>
                                                </div>
                                                <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
                                                    <span className="text-zinc-300 text-[10px] font-black tracking-widest uppercase">
                                                        {movie.genre || 'Action'}
                                                    </span>
                                                </div>
                                                <div className="px-2.5 py-1 bg-[#FFB800]/20 backdrop-blur-md rounded-lg border border-[#FFB800]/20 flex items-center gap-1.5">
                                                    <Star className="w-2.5 h-2.5 text-[#FFB800] fill-current" />
                                                    <span className="text-[#FFB800] text-[10px] font-black tracking-widest uppercase">
                                                        {movie.rating || '8.5'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Pagination Dots (Inside Card) */}
                                            <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
                                                {featuredMovies.map((_, i) => (
                                                    <div 
                                                        key={i}
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                                            i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/20'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!isCenter && (
                                    <div className="absolute inset-0 bg-black/60" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Hero;
