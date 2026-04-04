import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Eye } from 'lucide-react';
import { Movie } from '../types/movie';
import { useMovies } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  variant?: 'poster' | 'backdrop';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, variant = 'backdrop' }) => {
  const { setSelectedMovie } = useMovies();
  const navigate = useNavigate();

  const handleWatch = () => {
    setSelectedMovie(movie);
    navigate(`/watch/${movie.id}`);
  };

  // The reference uses mostly poster/portrait style cards for "Popular Movies"
  const isPoster = variant === 'poster';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`relative group cursor-pointer flex flex-col gap-3 flex-shrink-0 ${
        isPoster ? 'w-[140px] md:w-[180px]' : 'w-[200px] md:w-[280px]'
      }`}
      onClick={handleWatch}
    >
      {/* Image Container */}
      <div className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-lg border border-white/5 bg-zinc-900 group-hover:border-white/20 transition-all duration-300 ${isPoster ? 'aspect-[2/3]' : 'aspect-video'}`}>
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient Overlay for bottom text/play button contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />

        {/* Top Left Badge (HD / 4K / N) */}
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md rounded-md px-2 py-0.5 border border-white/10">
            <span className="text-white text-[8px] font-black tracking-widest">{isPoster ? '4K' : 'HD'}</span>
        </div>

        {/* Top Right "F" Badge (Filamu Branding) */}
        <div className="absolute top-3 right-3 text-primary text-xl font-black italic drop-shadow-md pb-1 pr-1">F</div>

        {/* Play Button Overlay (Visible center) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <Play className="w-4 h-4 text-black fill-current ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Meta Text Below image */}
      <div className="flex flex-col px-1">
        <h3 className="text-white text-sm md:text-base font-bold truncate tracking-tight">{movie.title}</h3>
        <div className="flex items-center gap-3 mt-1 text-[10px] md:text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-1">
             <Star className="w-3 h-3 text-[#DAA520] fill-[#DAA520]" />
             <span>{movie.rating || '4.0'}</span>
          </div>
          <div className="flex items-center gap-1">
             <Eye className="w-3 h-3" />
             <span>{(movie.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 20) + 1}M+ Views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
