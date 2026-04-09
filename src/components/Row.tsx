import React, { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface RowProps {
  title: string;
  movies: Movie[];
  variant?: 'poster' | 'backdrop';
}

const Row: React.FC<RowProps> = ({ title, movies, variant = 'poster' }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (movies.length === 0) return null;

  return (
    <div className="relative mb-12 group/row font-sans">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-4">
        <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
        
        <button className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors group/all">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest group-hover:mr-1 transition-all">All</span>
            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
        </button>
      </div>

      <div 
        ref={rowRef}
        className="flex gap-4 md:gap-5 overflow-x-scroll no-scrollbar pb-6 scroll-smooth snap-x snap-mandatory px-2"
      >
        <AnimatePresence initial={false}>
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start">
              <MovieCard 
                movie={movie} 
                variant={variant} 
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Row;
