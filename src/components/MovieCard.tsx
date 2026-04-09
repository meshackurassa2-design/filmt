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
      className="relative flex flex-col gap-3 flex-shrink-0 cursor-pointer group"
      style={{ width: isPoster ? '160px' : '280px' }}
      onClick={handleWatch}
    >
      {/* Image Container */}
      <div className={`relative w-full rounded-[24px] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${isPoster ? 'aspect-[2/3.2]' : 'aspect-video'}`}>
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Advanced Rating Pill (Top Left) */}
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#4CAF50] rounded-[6px] shadow-lg border border-white/10 z-10">
            <span className="text-white text-[10px] font-black">{movie.rating || '8.5'}</span>
        </div>

        {/* New Season Bubble (Top Right) - Mock Logic */}
        {movie.title.length % 3 === 0 && (
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-[6px] border border-white/10 z-10">
                <span className="text-white/80 text-[8px] font-bold uppercase tracking-wider">New Season</span>
            </div>
        )}

        {/* Progress Bar (Backdrop Variant / Continue Watching) */}
        {!isPoster && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20">
                <div className="h-full bg-[#FFB800] w-[65%] rounded-r-full shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
            </div>
        )}

        {/* Play Button Overlay (Centered) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 z-10">
            <div className={`rounded-full bg-white flex items-center justify-center shadow-2xl ${!isPoster ? 'w-12 h-12' : 'w-10 h-10'}`}>
                <Play className={`${!isPoster ? 'w-5 h-5' : 'w-4 h-4'} text-black fill-current ml-0.5`} />
            </div>
        </div>
      </div>

      {/* Meta Text - Clean Sans Below Image */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-white text-[15px] font-bold tracking-tight leading-tight group-hover:text-[#FFB800] transition-colors">
            {movie.title}
        </h3>
        <span className="text-zinc-500 text-[11px] font-medium tracking-wide">
            {movie.releaseYear || '2024'} • {movie.genre || 'Drama'}
        </span>
      </div>
    </motion.div>
  );
};

export default MovieCard;
