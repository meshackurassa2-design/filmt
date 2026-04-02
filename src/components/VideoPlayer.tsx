import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Subtitles,
  Settings,
  MessageSquare,
  Star,
  Send,
  X,
  Share2,
  ThumbsUp
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import maleDefault from '../assets/avatars/male-black-avatar.png';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { StatusBar, StatusBarAnimation } from '@capacitor/status-bar';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  movie_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface VideoPlayerProps {
  fullPage?: boolean;
  movie?: Movie;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ fullPage = false, movie: propMovie }) => {
  const { selectedMovie: contextMovie, setIsPlayerOpen, isPlayerOpen } = useMovies();
  const selectedMovie = propMovie || contextMovie;
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true); // Start muted to allow autoplay on web
  const [isBuffering, setIsBuffering] = useState(true); 
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSocial, setShowSocial] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Handle Cinematic Immersive Mode (Status Bar & Orientation)
  useEffect(() => {
    const enterImmersive = async () => {
      if (Capacitor.isNativePlatform() && (isPlayerOpen || fullPage)) {
        try {
          // Hide System UI for absolute distraction-free playback
          await StatusBar.hide({ animation: StatusBarAnimation.Fade });
          // Lock Orientation to Landscape for cinematic feel
          await ScreenOrientation.lock({ orientation: 'landscape' });
        } catch (e) {
          console.warn('Immersive mode entry failed:', e);
        }
      }
    };

    const exitImmersive = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Show System UI when exiting player
          await StatusBar.show({ animation: StatusBarAnimation.Fade });
          // Unlock Orientation to allow portrait use
          await ScreenOrientation.unlock();
        } catch (e) {
          console.warn('Immersive mode exit failed:', e);
        }
      }
    };

    if (isPlayerOpen || fullPage) {
      enterImmersive();
    } else {
      exitImmersive();
    }

    return () => {
      exitImmersive();
    };
  }, [isPlayerOpen, fullPage]);

  // Robust Autoplay Enforcement
  useEffect(() => {
    if ((isPlayerOpen || fullPage) && videoRef.current && selectedMovie) {
        setIsBuffering(true);
        setHasError(false);
        if (videoRef.current) videoRef.current.muted = isMuted;
        
        const playPromise = videoRef.current?.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
                setIsBuffering(false);
            }).catch(error => {
                console.warn("Autoplay was prevented:", error);
                setIsPlaying(false);
                setIsBuffering(false);
                // If autoplay failed with sound, try muted if not already
                if (!isMuted) {
                  setIsMuted(true);
                  if (videoRef.current) videoRef.current.muted = true;
                  videoRef.current?.play();
                }
            });
        }
    }
  }, [isPlayerOpen, fullPage, selectedMovie?.id]);

  const fetchComments = React.useCallback(async () => {
      if (!selectedMovie) return;
      const { data } = await supabase
          .from('movie_comments')
          .select(`
            *,
            profiles:user_id (username, avatar_url)
          `)
          .eq('movie_id', selectedMovie.id)
          .order('created_at', { ascending: false });
      if (data) setComments(data);
  }, [selectedMovie]);

  const fetchUserRating = React.useCallback(async () => {
      if (!selectedMovie || !user) return;
      const { data } = await supabase
          .from('movie_ratings')
          .select('rating')
          .eq('movie_id', selectedMovie.id)
          .eq('user_id', user.id)
          .single();
      if (data) setRating(data.rating);
  }, [selectedMovie, user]);

  useEffect(() => {
    let active = true;
    const loadSocialData = async () => {
      if (selectedMovie && isPlayerOpen && active) {
        await fetchComments();
        await fetchUserRating();
      }
    };
    loadSocialData();
    return () => { active = false; };
  }, [selectedMovie, isPlayerOpen, fetchComments, fetchUserRating]);

  const handleRating = async (val: number) => {
      if (!selectedMovie || !user) return;
      setRating(val);
      await supabase
          .from('movie_ratings')
          .upsert({
              movie_id: selectedMovie.id,
              user_id: user.id,
              rating: val
          });
  };

  const handleComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!comment.trim() || !selectedMovie || !user) return;

      const newComment = {
          movie_id: selectedMovie.id,
          user_id: user.id,
          content: comment
      };

      const { data, error } = await supabase
          .from('movie_comments')
          .insert(newComment)
          .select(`
            *,
            profiles:user_id (username, avatar_url)
          `)
          .single();

      if (!error && data) {
          setComments([data, ...comments]);
          setComment('');
      }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!selectedMovie || (!isPlayerOpen && !fullPage)) return null;

  const handleClose = () => {
    if (fullPage) {
      navigate(-1);
    } else {
      setIsPlayerOpen(false);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
        const container = videoRef.current.parentElement as HTMLElement & { 
            webkitRequestFullscreen?: () => Promise<void>;
        };
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            }
        }
    }
  };

  return (
    <div 
      className={`${fullPage ? 'relative w-full aspect-video md:aspect-[21/9] z-10' : 'fixed inset-0 z-[7000]'} bg-black flex items-center justify-center overflow-hidden`}
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      <video 
        ref={videoRef}
        key={selectedMovie.id} 
        className="w-full h-full object-contain"
        onPlay={() => { setIsPlaying(true); setIsBuffering(false); }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onError={() => { setHasError(true); setIsBuffering(false); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
      >
        <source src={selectedMovie.videoUrl} type="video/mp4" />
        {selectedMovie.subtitleEnUrl && (
            <track label="English" kind="subtitles" srcLang="en" src={selectedMovie.subtitleEnUrl} default />
        )}
        {selectedMovie.subtitleSwUrl && (
            <track label="Swahili" kind="subtitles" srcLang="sw" src={selectedMovie.subtitleSwUrl} />
        )}
      </video>

      {/* Buffering Indicator */}
      <AnimatePresence>
        {isBuffering && !hasError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"
          >
            <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(229,9,20,0.5)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Indicator */}
      <AnimatePresence>
        {hasError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 gap-6"
          >
            <X className="w-16 h-16 text-[#E50914]" />
            <p className="text-white text-sm font-black uppercase tracking-widest">Video format not supported or link broken</p>
            <button 
              onClick={handleClose}
              className="px-8 py-3 bg-[#E50914] text-white rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
              Go Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap to Unmute Overlay */}
      <AnimatePresence>
        {isMuted && isPlaying && !showSocial && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30"
          >
            <button 
              onClick={() => {
                setIsMuted(false);
                if (videoRef.current) videoRef.current.muted = false;
              }}
              className="px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all shadow-2xl"
            >
              <VolumeX className="w-4 h-4" />
              Tap to Unmute
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Overlay UI */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-t from-black/90 via-transparent to-black/70"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  onClick={handleClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 h-6" />
                </button>
                <div className="flex flex-col">
                  <span className="text-[8px] md:text-[10px] font-black text-[#E50914] uppercase tracking-[0.4em] mb-0.5">Now Playing</span>
                  <h1 className="text-lg md:text-3xl font-black text-white tracking-tighter uppercase leading-none">{selectedMovie.title}</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setShowSocial(!showSocial)}
                    className={`w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center transition-all ${showSocial ? 'bg-[#E50914] text-white' : 'text-white/60 hover:text-white'}`}
                 >
                    <MessageSquare className="w-5 h-5" />
                 </button>
                 <button className="hidden md:flex w-10 h-10 rounded-full glass border border-white/10 items-center justify-center text-white/60 hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                    <Settings className="w-5 h-5" />
                 </button>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center justify-center gap-8 md:gap-24">
               <button 
                 onClick={() => skip(-10)}
                 className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all group"
               >
                 <RotateCcw className="w-6 h-6 md:w-8 md:h-8 group-hover:-rotate-12 transition-transform" />
               </button>
               
               <button 
                 onClick={togglePlay}
                 className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:scale-110 active:scale-95 transition-all"
               >
                 {isPlaying ? <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" /> : <Play className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-1" />}
               </button>

               <button 
                 onClick={() => skip(10)}
                 className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all group"
               >
                 <RotateCw className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
               </button>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col gap-4 md:gap-6 w-full max-w-6xl mx-auto">
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-widest">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                   </div>
                   <div className="relative h-1 md:h-1.5 w-full bg-white/10 rounded-full group/seek">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-[#E50914] rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)] z-10"
                        style={{ width: `${progress}%` }}
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 md:gap-10">
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => {
                              const newMuted = !isMuted;
                              setIsMuted(newMuted);
                              if (videoRef.current) videoRef.current.muted = newMuted;
                            }}
                            className="text-white/60 hover:text-white transition-colors"
                          >
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 md:w-6 h-6" /> : <Volume2 className="w-5 h-5 md:w-6 h-6" />}
                          </button>
                          <div className="hidden md:flex w-24 h-1 bg-white/10 rounded-full relative overflow-hidden">
                              <div className="absolute inset-0 bg-[#E50914]" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
                              <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setVolume(val);
                                  if (videoRef.current) videoRef.current.volume = val;
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 md:gap-4">
                          {[1,2,3,4,5].map(star => (
                              <button 
                                key={star}
                                onClick={() => handleRating(star)}
                                className={`transition-all hover:scale-125 ${star <= rating ? 'text-[#E50914]' : 'text-white/20'}`}
                              >
                                <Star className={`w-4 h-4 md:w-5 md:h-5 ${star <= rating ? 'fill-current' : ''}`} />
                              </button>
                          ))}
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-white/60 hover:text-white transition-colors">
                           <Subtitles className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={toggleFullscreen}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                           <Maximize className="w-5 h-5 md:w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Panel (Side Drawer) */}
      <AnimatePresence>
         {showSocial && (
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               className="absolute top-0 right-0 h-full w-full md:w-[450px] bg-black/95 backdrop-blur-3xl z-50 border-l border-white/10 shadow-3xl flex flex-col"
            >
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                  <div className="flex flex-col">
                     <span className="text-[#E50914] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Community</span>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Real-time Echo</h3>
                  </div>
                  <button onClick={() => setShowSocial(false)} className="w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/10">
                     <X className="w-5 h-5 text-white" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {comments.length > 0 ? (
                      comments.map((c, i) => (
                        <motion.div 
                            key={c.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                               <img src={c.profiles?.avatar_url || maleDefault} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-[#E50914] uppercase tracking-widest">{c.profiles?.username}</span>
                                  <span className="text-[8px] font-bold text-gray-700 uppercase">{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                               <p className="text-gray-300 text-[11px] font-bold leading-relaxed">{c.content}</p>
                               <button className="flex items-center gap-1.5 text-[8px] font-black text-gray-700 uppercase tracking-widest hover:text-[#E50914] transition-colors">
                                  <ThumbsUp className="w-3 h-3" />
                                  Upvote
                                </button>
                            </div>
                        </motion.div>
                      ))
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 grayscale opacity-30">
                         <MessageSquare className="w-16 h-16 text-white" />
                         <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">No echos yet. Start the conversation.</p>
                      </div>
                  )}
               </div>

               <div className="p-6 bg-zinc-900/60 border-t border-white/5">
                  <form onSubmit={handleComment} className="relative">
                     <input 
                        type="text" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="ADD AN ECHO..."
                        className="w-full bg-black/50 p-6 pr-16 rounded-full outline-none border border-white/10 focus:border-[#E50914]/50 font-black text-[10px] text-white placeholder:text-gray-800 uppercase tracking-widest"
                     />
                     <button className="absolute right-2 top-2 w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
                        <Send className="w-5 h-5" />
                     </button>
                  </form>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Movie Details Toast (Fades out) */}
      <AnimatePresence>
        {!isPlaying && showControls && !showSocial && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-6 md:left-10 z-[5] max-w-sm md:max-w-lg"
          >
            <div className="bg-black/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.5)]" />
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#DAA520] text-white text-[9px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-[0_0_15px_rgba(218,165,32,0.3)]">Filamu Original</span>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{selectedMovie.releaseYear}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white mb-4 leading-none">{selectedMovie.title}</h2>
                <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-widest leading-relaxed line-clamp-3">{selectedMovie.description}</p>
                <div className="flex items-center gap-4 mt-8">
                   <div className="flex items-center gap-2">
                       <Star className="w-4 h-4 text-[#E50914] fill-current" />
                       <span className="text-white text-[10px] font-black tracking-widest">{rating || selectedMovie.rating || 'NR'}</span>
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
