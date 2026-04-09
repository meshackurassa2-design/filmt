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
    <div className="bg-black min-h-screen pt-[calc(env(safe-area-inset-top)+2rem)] md:pt-[calc(env(safe-area-inset-top)+5rem)]">
      {/* Top Level Category Tabs */}
      <HeaderTabs />

      {/* Cinematic Hero Section */}
      <Hero />

      {/* Content Feed */}
      <div className="pb-32 relative z-20 px-[4%] -mt-16 md:-mt-24">
          {/* Empty State / Diagnostic */}
          {allMovies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-[#FFB800] rounded-full animate-spin" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Finding Content...</h3>
              <p className="text-zinc-500 text-sm max-w-[250px] mb-6">
                If this takes too long, check your connection or try refreshing.
              </p>
              <button 
                onClick={() => refreshMovies()}
                className="px-8 py-3 bg-[#FFB800] text-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all"
              >
                Refresh Now
              </button>
            </div>
          )}

          {/* My List Section */}
          {myList.length > 0 && (
            <div id="my-list" className="mb-12 scroll-mt-24">
              <Row title="My List" movies={myList} />
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-col gap-12">
            {categories.map((category) => {
              const rowId = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              return (
                <div id={rowId} key={category.title} className="scroll-mt-24">
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
