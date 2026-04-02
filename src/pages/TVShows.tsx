import React from 'react';
import { motion } from 'framer-motion';
import Row from '../components/Row.tsx';
import VideoPlayer from '../components/VideoPlayer.tsx';
import { useMovies } from '../context/MovieContext.tsx';

const TVShows: React.FC = () => {
  const { 
    categories
  } = useMovies();

  // Filter only TV shows
  const tvOnlyCategories = categories.map(cat => ({
    ...cat,
    movies: cat.movies.filter(m => m.type === 'tvshow')
  })).filter(cat => cat.movies.length > 0);

  return (
    <div className="relative min-h-screen bg-black">

      <main className="pt-32 pb-32 px-[4%] relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="w-12 h-1 bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)] mb-6" />
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 uppercase">
            TV SHOW <span className="text-[#E50914]">ORIGINALS</span>
          </h1>
          <p className="text-gray-500 max-w-2xl font-black uppercase tracking-widest text-xs leading-relaxed">
            Immerse yourself in gripping series and epic storylines, remastered for the original experience.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12">
          {tvOnlyCategories.length > 0 ? (
            tvOnlyCategories.map((category) => (
              <Row key={category.title} title={category.title} movies={category.movies} />
            ))
          ) : (
            <div className="text-center py-20 bg-black/40 rounded-3xl border border-white/5">
               <p className="text-gray-500 font-black uppercase tracking-[0.4em]">No Series Cataloged Yet</p>
            </div>
          )}
        </div>
      </main>

      <VideoPlayer />
    </div>
  );
};

export default TVShows;

