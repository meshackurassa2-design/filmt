import React from 'react';
import Hero from '../components/Hero.tsx';
import HeaderTabs from '../components/HeaderTabs.tsx';
import Row from '../components/Row.tsx';
import { useMovies } from '../context/MovieContext.tsx';

const Home: React.FC = () => {
  const { 
    myList, 
    categories,
    allMovies,
    refreshMovies
  } = useMovies();

  return (
    <div className="bg-black min-h-screen pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-32">
      {/* 1. Katalog Header Section */}
      <div className="px-6 mb-2">
        <h1 className="text-white text-4xl font-black tracking-tight mb-4">Catalog</h1>
        <HeaderTabs />
      </div>

      {/* 2. Cinematic Hero Carousel (Moved below tabs) */}
      <div className="mb-12">
        <Hero />
      </div>

      {/* 3. Content Feed */}
      <div className="relative z-20 px-[2%]">
          {/* Empty State / Loading */}
          {allMovies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-[#FFB800] rounded-full animate-spin" />
              </div>
              <h3 className="text-white text-lg font-bold">Loading Premium Content...</h3>
            </div>
          )}

          {/* Continue Watching Mock Row (To match image) */}
          <div className="mb-12">
            <Row title="Continue Watching" movies={allMovies.slice(8, 12)} variant="backdrop" />
          </div>

          {/* Categories / Standard Rows */}
          <div className="flex flex-col gap-12">
            <Row title="300 Best Movies" movies={allMovies.slice(0, 8)} />
            
            {categories.map((category) => {
              const rowId = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              return (
                <div id={rowId} key={category.title}>
                  <Row title={category.title} movies={category.movies} />
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default Home;
