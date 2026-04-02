import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

const Hero: React.FC = () => {
  const { allMovies, setSelectedMovie } = useMovies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const featuredMovies = allMovies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);


  const handlePlay = () => {
    if (currentMovie) {
      setSelectedMovie(currentMovie);
    }
  };

  const handleMoreInfo = () => {
    if (currentMovie) setSelectedMovie(currentMovie);
  };

  if (!currentMovie) return (
    <div className="h-[80vh] md:h-screen w-full bg-black flex flex-col items-center justify-center gap-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-repeat" />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <h2 className="text-white font-black text-4xl md:text-5xl tracking-tighter uppercase leading-none max-w-2xl">Filamu Times</h2>
          <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.6em] max-w-lg leading-relaxed">Identity Verified. Establishing Neural Link.</p>
        </div>
      </div>
      <div className="absolute bottom-12 flex gap-4 opacity-10">
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.1s]" />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.2s]" />
      </div>
    </div>
  );

  const variants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 1.1,
      x: direction > 0 ? 100 : -100,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      scale: 0.9,
      x: direction < 0 ? 100 : -100,
    }),
  };

  return (
    <div className="relative h-[80vh] md:h-screen w-full flex flex-col justify-end pb-28 md:pb-40 px-[6%] md:px-[8%] text-white overflow-hidden bg-black">
      {/* Background Image with Framer Motion */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentMovie.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 1.2 }
          }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={currentMovie.image.replace('w=1200', 'w=1920&q=90')}
            alt={currentMovie.title}
            className="w-full h-full object-cover filter brightness-100 scale-100"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      {/* Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-[50vw] h-[50vw] bg-[#E50914]/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 animate-slow-pulse pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-[700px] mb-4">
        <motion.div
          key={`content-${currentMovie.id}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-[#E50914] uppercase tracking-[0.4em]">
              {currentMovie.genre}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-[0.85] text-white uppercase">
            {currentMovie.title}
          </h1>
          
          <p className="max-w-[500px] text-xs md:text-base font-bold text-zinc-400 mb-8 leading-relaxed line-clamp-2">
            {currentMovie.description}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handlePlay}
              className="bg-[#E50914] hover:bg-[#b2070f] text-white px-10 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch
            </button>
            <button 
              onClick={handleMoreInfo}
              className="bg-black/50 hover:bg-zinc-800 text-white px-10 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all border border-white/10 active:scale-95"
            >
              <Info className="w-4 h-4" />
              Info
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 right-[6%] flex items-center gap-2 z-20">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-[#E50914] w-8' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

