import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ChevronDown, Heart } from 'lucide-react';
import { Movie } from '../types/movie';
import { useMovies } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  variant?: 'poster' | 'backdrop';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, variant = 'backdrop' }) => {
  const { addToMyList, setSelectedMovie, toggleLike, likedMovies } = useMovies();
  const isLiked = likedMovies.includes(movie.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
      }}
      className={`relative group cursor-pointer flex-shrink-0 ${
        variant === 'poster' ? 'w-[160px] md:w-[220px] poster-card' : 'w-[240px] md:w-[380px] backdrop-card'
      }`}
      onClick={() => {
        setSelectedMovie(movie);
      }}
    >
      {/* Image Container */}
      <div className="w-full h-full overflow-hidden rounded-lg border border-white/5 bg-zinc-900 shadow-2xl group-hover:border-[#E50914]/50 group-hover:shadow-[0_0_30px_rgba(229,9,20,0.15)] transition-all duration-500">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Hover Overlay Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                setSelectedMovie(movie);
                }}
                className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center hover:bg-[#ff1f1f] transition-all hover:scale-110 shadow-lg"
              >
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToMyList(movie);
                }}
                className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 backdrop-blur-md text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(movie.id);
                }}
                className={`w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 backdrop-blur-md ${isLiked ? 'text-[#E50914]' : 'text-white'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMovie(movie);
              }}
              className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 backdrop-blur-md text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-black truncate leading-tight tracking-tight uppercase">{movie.title}</h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] text-green-500 font-black uppercase tracking-widest">98% Match</span>
              <span className="text-[11px] text-gray-400 font-bold px-1.5 py-0.5 border border-white/20 rounded-sm uppercase tracking-widest">4K</span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{movie.genre}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
