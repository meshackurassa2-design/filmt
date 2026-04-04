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
  X,
  Share2
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { StatusBar, StatusBarAnimation } from '@capacitor/status-bar';


interface VideoPlayerProps {
  fullPage?: boolean;
  movie?: Movie;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ fullPage = false, movie: propMovie }) => {
  const { selectedMovie: contextMovie, isPlayerOpen, setIsPlayerOpen } = useMovies();
  const selectedMovie = propMovie || contextMovie;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted for native experience
  const [isBuffering, setIsBuffering] = useState(true); 
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      if (Capacitor.isNativePlatform() && isFullscreen) {
        try {
          await StatusBar.hide({ animation: StatusBarAnimation.Fade });
          await ScreenOrientation.lock({ orientation: 'landscape' });
        } catch (e) {
          console.warn('Immersive mode entry failed:', e);
        }
      }
    };

    const exitImmersive = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.show({ animation: StatusBarAnimation.Fade });
          await ScreenOrientation.unlock();
        } catch (e) {
          console.warn('Immersive mode exit failed:', e);
        }
      }
    };

    if (isFullscreen) {
      enterImmersive();
    } else {
      exitImmersive();
    }

    return () => {
      exitImmersive();
    };
  }, [isFullscreen]);

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
  }, [isPlayerOpen, fullPage, selectedMovie?.id, isMuted, selectedMovie]);

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
    if (isFullscreen) {
      setIsFullscreen(false);
    } else if (fullPage) {
      navigate(-1);
    } else {
      setIsPlayerOpen(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`${isFullscreen ? 'fixed inset-0 z-[7000]' : 'relative w-full aspect-video z-10'} bg-black flex items-center justify-center overflow-hidden`}
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      <video 
        ref={videoRef}
        key={selectedMovie.id} 
        className="w-full h-full object-cover"
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

      {/* Muted indicator handled via controls */}

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
                 <button className="hidden md:flex w-10 h-10 rounded-full glass border border-white/10 items-center justify-center text-white/60 hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                 </button>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center justify-center gap-8 md:gap-24">
               <button 
                 onClick={(e) => { e.stopPropagation(); skip(-10); }}
                 className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all group"
               >
                 <RotateCcw className="w-6 h-6 md:w-8 md:h-8 group-hover:-rotate-12 transition-transform" />
               </button>
               
               <button 
                 onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                 className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:scale-110 active:scale-95 transition-all"
               >
                 {isPlaying ? <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" /> : <Play className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-1" />}
               </button>

               <button 
                 onClick={(e) => { e.stopPropagation(); skip(10); }}
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
                       
                       <div className="flex items-center gap-2 md:gap-4 invisible">
                          {/* Rating removed from player UI as requested */}
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

      {/* Movie Details Toast (Fades out) */}
      <AnimatePresence>
        {!isPlaying && showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-6 z-[5] max-w-[240px] md:max-w-xs"
          >
            <div className="bg-black/40 backdrop-blur-2xl p-4 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary text-[7px] font-black uppercase tracking-widest">Filamu Original</span>
                </div>
                <h2 className="text-sm md:text-base font-black tracking-tight uppercase text-white mb-1 leading-none">{selectedMovie.title}</h2>
                <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-wider leading-normal line-clamp-2">{selectedMovie.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
