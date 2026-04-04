import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types/movie';
import { supabase } from '../lib/supabase';

interface Category {
  title: string;
  movies: Movie[];
}

interface MovieData {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  video_url: string;
  subtitle_en_url?: string;
  subtitle_sw_url?: string;
  release_year?: number;
  type?: 'movie' | 'tvshow';
  rating?: number;
}

interface MovieLike {
  id: string;
  movie_id: string;
  user_id: string;
  vote: number;
}

interface MovieContextType {
  allMovies: Movie[];
  categories: Category[];
  myList: Movie[];
  likedMovies: string[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (id: string) => void;
  toggleLike: (id: string, vote?: number) => void;
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
  getEpisodes: (movieId: string) => Promise<any[]>;
  getLikeStats: (movieId: string) => { likes: number; dislikes: number; userVote: number | null };
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
  const [allLikes, setAllLikes] = useState<MovieLike[]>([]);

  const refreshMovies = React.useCallback(async () => {
    const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    if (data) {
      const mappedMovies: Movie[] = (data as MovieData[]).map((m) => ({
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

    const { data: likesData } = await supabase.from('movie_likes').select('*');
    if (likesData) setAllLikes(likesData as MovieLike[]);
  }, []);

  useEffect(() => {
    refreshMovies();
    const savedList = localStorage.getItem('filamu_mylist');
    const savedLikes = localStorage.getItem('filamu_likes');
    if (savedList) setMyList(JSON.parse(savedList));
    if (savedLikes) setLikedMovies(JSON.parse(savedLikes));
  }, [refreshMovies]);

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
    
    // Algorithm: Recommended based on sum of votes
    const recommendedMovies = [...filteredMovies].sort((a, b) => {
        const aLikes = allLikes.filter(l => l.movie_id === a.id).reduce((acc, curr) => acc + curr.vote, 0);
        const bLikes = allLikes.filter(l => l.movie_id === b.id).reduce((acc, curr) => acc + curr.vote, 0);
        return bLikes - aLikes;
    }).slice(0, 10);

    const baseCats = [
      { title: "Top Recommended", movies: recommendedMovies },
      { title: "Recently Added", movies: filteredMovies.slice(0, 10) },
      ...(trendingMovies.length > 0 ? [{ title: "Trending Now", movies: trendingMovies }] : []),
      { title: "New Releases", movies: filteredMovies.slice(0, 15) }
    ];

    const genreCats = genres.map(g => ({
         title: `${g} Originals`,
         movies: filteredMovies.filter(m => m.genre === g)
    })).filter(c => c.movies.length > 0);

    return [...baseCats, ...genreCats];
  }, [filteredMovies, allLikes]);

  const addToMyList = (movie: Movie) => {
    if (!myList.find(m => m.id === movie.id)) {
      setMyList(prev => [...prev, movie]);
    }
  };

  const removeFromMyList = (id: string) => {
    setMyList(prev => prev.filter(m => m.id !== id));
  };

  const toggleLike = async (id: string, vote: number = 1) => {
    // Legacy local support
    setLikedMovies(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );

    // Supabase support
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (user_id) {
        const { data: existing } = await supabase.from('movie_likes')
            .select('*').eq('movie_id', id).eq('user_id', user_id).single();
            
        if (existing && existing.vote === vote) {
            await supabase.from('movie_likes').delete().eq('id', existing.id);
        } else {
            await supabase.from('movie_likes').upsert({ movie_id: id, user_id, vote });
        }
        refreshMovies();
    }
  };

  const getEpisodes = async (movieId: string) => {
    const { data } = await supabase.from('episodes').select('*').eq('movie_id', movieId).order('episode_number', { ascending: true });
    return data || [];
  };

  const getLikeStats = (movieId: string) => {
    const movieVotes = allLikes.filter(l => l.movie_id === movieId);
    const likes = movieVotes.filter(v => v.vote === 1).length;
    const dislikes = movieVotes.filter(v => v.vote === -1).length;
    const userVote = 0; // Simplified for now
    return { likes, dislikes, userVote };
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
      refreshMovies,
      getEpisodes,
      getLikeStats
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
