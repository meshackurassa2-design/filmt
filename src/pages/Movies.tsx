import React from 'react';
import { motion } from 'framer-motion';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Film } from 'lucide-react';

const Movies: React.FC = () => {
    const { allMovies } = useMovies();

    return (
        <div className="min-h-screen bg-black pt-[calc(env(safe-area-inset-top)+6rem)] pb-40 px-6">
            <div className="flex flex-col mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                        <Film className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">ALL MOVIES</h1>
                </div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-1">Premium Collection • 2025</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-10 gap-x-6">
                {allMovies.map((movie, index) => (
                    <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <MovieCard movie={movie} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Movies;
