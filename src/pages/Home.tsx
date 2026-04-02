import React from 'react';
import Hero from '../components/Hero.tsx';
import Row from '../components/Row.tsx';
import { useMovies } from '../context/MovieContext.tsx';

const Home: React.FC = () => {
  const { 
    myList, 
    categories
  } = useMovies();

  return (
    <div className="bg-black min-h-screen">
      {/* Cinematic Hero Section */}
      <Hero />

      {/* Content Feed */}
      <div className="pb-32 relative z-20 px-[4%] -mt-16 md:-mt-24">
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
