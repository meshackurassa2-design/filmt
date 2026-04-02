import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Star } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import VideoPlayer from '../components/VideoPlayer';
import Row from '../components/Row';
import { supabase } from '../lib/supabase';
import maleDefault from '../assets/avatars/male-black-avatar.png';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string; avatar_url: string; };
}

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { allMovies, setSelectedMovie } = useMovies();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);

  const movie = React.useMemo(() => {
    return allMovies.find(m => m.id === id);
  }, [allMovies, id]);

  const similarMovies = React.useMemo(() => {
    if (!movie) return [];
    return allMovies.filter(m => m.genre === movie.genre && m.id !== movie.id).slice(0, 10);
  }, [allMovies, movie]);

  useEffect(() => {
    if (movie) {
      setSelectedMovie(movie);
      // Fetch initial comments for the feed
      const fetchFeedComments = async () => {
          const { data } = await supabase
              .from('movie_comments')
              .select(`*, profiles:user_id (username, avatar_url)`)
              .eq('movie_id', movie.id)
              .order('created_at', { ascending: false })
              .limit(5);
          if (data) setComments(data);
      };
      fetchFeedComments();
    } else if (allMovies.length > 0) {
      navigate('/');
    }
  }, [movie, allMovies.length, setSelectedMovie, navigate]);

  if (!movie) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-t-2 border-[#E50914] rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto pb-32">
      {/* 1. Embedded Video Player */}
      <div className="w-full relative bg-black aspect-video md:aspect-[21/9] sticky top-0 z-50 shadow-2xl">
        <VideoPlayer fullPage movie={movie} />
      </div>

      {/* 2. Metadata Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <span className="bg-[#DAA520] text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-[0_0_15px_rgba(218,165,32,0.3)]">Filamu Original</span>
              <span className="text-gray-400 text-xs md:text-sm font-black uppercase tracking-widest">{movie.releaseYear || new Date().getFullYear()}</span>
              <span className="text-gray-400 text-xs md:text-sm font-black uppercase tracking-widest px-2 border-l border-white/20">{movie.genre}</span>
           </div>
           
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">{movie.title}</h1>
           
           <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                 <Star className="w-5 h-5 text-[#E50914] fill-current" />
                 <span className="text-lg font-black tracking-widest">{movie.rating ? movie.rating.toFixed(1) : '9.8'} <span className="text-gray-500 text-sm">/ 10</span></span>
              </div>
              <div className="flex gap-4 border-l border-white/20 pl-6">
                 <button className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
                       <Heart className="w-5 h-5 text-white/70 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300">My List</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
                       <Share2 className="w-5 h-5 text-white/70 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300">Share</span>
                 </button>
              </div>
           </div>

           <p className="text-gray-300 text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed max-w-4xl mt-4">
              {movie.description}
           </p>
        </div>

        {/* 3. Community Echoes Preview */}
        <div className="mt-16 border-t border-white/10 pt-10">
           <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-[#E50914]" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Community Echoes</h2>
               </div>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Join the conversation in the player</span>
           </div>
           
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {comments.length > 0 ? comments.map(c => (
                  <div key={c.id} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                          <img src={c.profiles?.avatar_url || maleDefault} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div className="flex flex-col">
                              <span className="text-[10px] font-black text-[#E50914] uppercase tracking-widest">{c.profiles?.username}</span>
                              <span className="text-[8px] font-bold text-gray-500 uppercase">{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                      </div>
                      <p className="text-xs text-gray-300 font-bold leading-relaxed">"{c.content}"</p>
                  </div>
               )) : (
                  <div className="col-span-full p-8 text-center rounded-3xl bg-white/5 border border-white/5 border-dashed">
                      <p className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">No echoes found. Open the player controls to be the first to comment.</p>
                  </div>
               )}
           </div>
        </div>

        {/* 4. More Like This */}
        {similarMovies.length > 0 && (
           <div className="mt-16 border-t border-white/10 pt-10">
               <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">More Like This</h2>
               <div className="-mx-4 sm:mx-0">
                  <Row title="" movies={similarMovies} />
               </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Watch;


