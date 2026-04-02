import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface RowProps {
  title: string;
  movies: Movie[];
  variant?: 'poster' | 'backdrop';
}

const Row: React.FC<RowProps> = ({ title, movies, variant = 'backdrop' }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="relative mb-16 group/row">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#E50914] rounded-sm shadow-[0_0_15px_rgba(229,9,20,0.4)]" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white uppercase tracking-[0.1em]">
            {title}
          </h2>
        </div>
        
        <div className="flex items-center gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500">
           <button 
            onClick={() => scroll('left')}
            className={`p-2 rounded-full glass hover:bg-[#E50914]/20 hover:text-[#E50914] transition-all ${!showLeft ? 'opacity-30 cursor-not-allowed' : 'opacity-100 active:scale-90 border-white/20'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className={`p-2 rounded-full glass hover:bg-[#E50914]/20 hover:text-[#E50914] transition-all ${!showRight ? 'opacity-30 cursor-not-allowed' : 'opacity-100 active:scale-90 border-white/20'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={rowRef}
        onScroll={handleScroll}
        className="flex gap-4 md:gap-5 overflow-x-scroll no-scrollbar py-6 px-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              variant={variant} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Row;


