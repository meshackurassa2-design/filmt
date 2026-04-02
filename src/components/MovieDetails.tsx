import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, X, ThumbsUp, Info } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

const MovieDetails: React.FC = () => {
  const { selectedMovie, setSelectedMovie, setIsPlayerOpen, addToMyList, myList, removeFromMyList } = useMovies();

  if (!selectedMovie) return null;

  const inList = myList.some(m => m.id === selectedMovie.id);

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center sm:p-4 perspective-1000">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setSelectedMovie(null)}
      />
      
      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#141414] w-full max-w-5xl sm:rounded-xl overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 h-full sm:h-auto overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setSelectedMovie(null)}
          className="absolute top-6 right-6 z-50 text-white bg-black/40 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-all border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Cinematic Header */}
        <div className="relative aspect-video sm:h-[450px] w-full group">
          <img src={selectedMovie.image} className="w-full h-full object-cover" alt={selectedMovie.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-7xl font-black tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl"
            >
              {selectedMovie.title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setIsPlayerOpen(true)}
                className="bg-white text-black px-10 py-3.5 rounded-md font-black flex items-center gap-3 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Play className="w-6 h-6 fill-current" />
                PLAY
              </button>
              
              <button 
                onClick={() => inList ? removeFromMyList(selectedMovie.id) : addToMyList(selectedMovie)}
                className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all"
              >
                {inList ? <Info className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
              
              <button className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all">
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Content */}
        <div className="px-8 sm:px-12 py-10 grid sm:grid-cols-[2fr_1fr] gap-12 sm:gap-20">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                <span className="text-green-500 text-base font-black uppercase tracking-widest">98% Match</span>
                <span className="text-gray-400 font-black">{selectedMovie.releaseYear}</span>
                <span className="px-2 py-0.5 border-2 border-gray-600 rounded-sm text-[10px] uppercase font-black tracking-widest text-[#E50914] border-[#E50914]">4K Ultra HD</span>
                <span className="text-gray-400 font-black px-1.5 py-0.5 border border-white/10 rounded-sm">2h 14m</span>
            </div>
            
            <p className="text-xl leading-relaxed text-zinc-300 font-medium">
              {selectedMovie.description || "In a world of constant change, one story remains etched in the cinematic history of Filamu Times. Immersive, visual, and profoundly moving."}
            </p>
          </div>

          <div className="space-y-6 text-sm">
            <div className="space-y-1">
              <span className="text-zinc-500 font-black uppercase tracking-widest block text-[10px]">Cast</span>
              <span className="text-zinc-200 font-bold block">Simulated Network Cast, Filamu Star</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-zinc-500 font-black uppercase tracking-widest block text-[10px]">Genres</span>
              <span className="text-zinc-200 font-bold block">{selectedMovie.genre}, Original Cinema, Network Feature</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-zinc-500 font-black uppercase tracking-widest block text-[10px]">This Movie is</span>
              <span className="text-zinc-200 font-bold block">Visually Stunning, Emotional, Gripping</span>
            </div>
          </div>
        </div>

        {/* Footer Glow */}
        <div className="h-24 bg-gradient-to-t from-black to-transparent opacity-50" />
      </motion.div>
    </div>
  );
};

export default MovieDetails;
