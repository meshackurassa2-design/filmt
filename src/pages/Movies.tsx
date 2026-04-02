import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import Row from '../components/Row.tsx';
import VideoPlayer from '../components/VideoPlayer.tsx';
import { useMovies } from '../context/MovieContext.tsx';

const Movies: React.FC = () => {
  const { 
    categories
  } = useMovies();

  // Filter only movies
  const movieOnlyCategories = categories.map(cat => ({
    ...cat,
    movies: cat.movies.filter(m => m.type === 'movie')
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
            Movie <span className="text-[#E50914]">Originals</span>
          </h1>
          <p className="text-gray-500 max-w-2xl font-black uppercase tracking-widest text-xs leading-relaxed">
            Discover the best of African cinema and global hits, handpicked and remastered for the original experience.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12">
          {movieOnlyCategories.length > 0 ? (
            movieOnlyCategories.map((category) => (
              <Row key={category.title} title={category.title} movies={category.movies} />
            ))
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/5 max-w-2xl mx-auto shadow-3xl"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-10 border border-white/5">
                  <Film className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-4xl font-black mb-6 text-white tracking-tighter uppercase">No Originals Found</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] max-w-sm px-6 leading-loose">Check back later for new cinematic additions to our catalog.</p>
              </motion.div>
          )}
        </div>
      </main>

      <VideoPlayer />
    </div>
  );
};

export default Movies;

