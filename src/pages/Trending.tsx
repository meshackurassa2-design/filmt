import React from 'react';
import Row from '../components/Row.tsx';
import VideoPlayer from '../components/VideoPlayer.tsx';
import { useMovies } from '../context/MovieContext.tsx';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Trending: React.FC = () => {
  const { allMovies } = useMovies();
  
  // Define trending as movies with higher rating or recently created
  const trendingMovies = [...allMovies]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 20);

  return (
    <div className="relative min-h-screen bg-black pb-32">
      
      <main className="pt-[calc(env(safe-area-inset-top)+6rem)] px-[4%] md:px-[6%]">
        <header className="mb-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-2"
            >
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">The Heat Map</span>
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase"
            >
                New & <span className="text-primary">Popular</span>
            </motion.h1>
        </header>

        <div className="grid grid-cols-1 gap-16">
            <section>
                <Row title="Hot Releases" movies={trendingMovies.slice(0, 10)} />
            </section>
            
            <section>
                <Row title="Most Echoed" movies={trendingMovies.slice(10, 20)} />
            </section>
        </div>
      </main>

      <VideoPlayer />
    </div>
  );
};

export default Trending;
