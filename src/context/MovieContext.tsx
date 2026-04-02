import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types/movie';
import { supabase } from '../lib/supabase';

interface Category {
  title: string;
  movies: Movie[];
}

interface MovieContextType {
  allMovies: Movie[];
  categories: Category[];
  myList: Movie[];
  likedMovies: string[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (id: string) => void;
  toggleLike: (id: string) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  isPlayerOpen: boolean;
  setIsPlayerOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  refreshMovies: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [myList, setMyList] = useState<Movie[]>([]);
  const [likedMovies, setLikedMovies] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const refreshMovies = async () => {
    const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    if (data) {
      const mappedMovies: Movie[] = data.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        image: m.thumbnail_url,
        genre: m.category,
        videoUrl: m.video_url,
        subtitleEnUrl: m.subtitle_en_url,
        subtitleSwUrl: m.subtitle_sw_url,
        releaseYear: m.release_year || new Date().getFullYear(),
        type: m.type || 'movie',
        rating: m.rating || 0
      }));
      setAllMovies(mappedMovies);
    }
  };

  useEffect(() => {
    refreshMovies();
    const savedList = localStorage.getItem('filamu_mylist');
    const savedLikes = localStorage.getItem('filamu_likes');
    if (savedList) setMyList(JSON.parse(savedList));
    if (savedLikes) setLikedMovies(JSON.parse(savedLikes));
  }, []);

  useEffect(() => {
    localStorage.setItem('filamu_mylist', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem('filamu_likes', JSON.stringify(likedMovies));
  }, [likedMovies]);

  const filteredMovies = React.useMemo(() => {
    return allMovies.filter(m => {
        const genreMatch = selectedGenre === 'All' || m.genre === selectedGenre;
        const yearMatch = selectedYear === 'All' || m.releaseYear?.toString() === selectedYear;
        const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
        return genreMatch && yearMatch && searchMatch;
    });
  }, [allMovies, selectedGenre, selectedYear, searchQuery]);

  const categories = React.useMemo(() => {
    if (filteredMovies.length === 0) return [];
    
    // Dynamic Genres from actual filtered data
    const genres = Array.from(new Set(filteredMovies.map(m => m.genre).filter(Boolean))) as string[];
    const trendingMovies = [...filteredMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
    
    const baseCats = [
      { title: "Recently Added", movies: filteredMovies.slice(0, 10) },
      ...(trendingMovies.length > 0 ? [{ title: "Trending Now", movies: trendingMovies }] : []),
      { title: "New Releases", movies: filteredMovies.slice(0, 15) }
    ];

    const genreCats = genres.map(g => ({
         title: `${g} Originals`,
         movies: filteredMovies.filter(m => m.genre === g)
    })).filter(c => c.movies.length > 0);

    return [...baseCats, ...genreCats];
  }, [filteredMovies]);

  const addToMyList = (movie: Movie) => {
    if (!myList.find(m => m.id === movie.id)) {
      setMyList(prev => [...prev, movie]);
    }
  };

  const removeFromMyList = (id: string) => {
    setMyList(prev => prev.filter(m => m.id !== id));
  };

  const toggleLike = (id: string) => {
    setLikedMovies(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  return (
    <MovieContext.Provider value={{ 
      allMovies,
      categories,
      myList, 
      likedMovies,
      addToMyList, 
      removeFromMyList, 
      toggleLike,
      selectedMovie, 
      setSelectedMovie,
      isPlayerOpen,
      setIsPlayerOpen,
      searchQuery,
      setSearchQuery,
      selectedGenre,
      setSelectedGenre,
      selectedYear,
      setSelectedYear,
      refreshMovies
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within a MovieProvider');
  return context;
};
