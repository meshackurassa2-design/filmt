import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  FileVideo, 
  CheckCircle2,
  Plus,
  Loader2,
  Trash2,
  Edit2,
  X,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

interface MovieItem {
    id: string;
    title: string;
    description: string;
    image: string;
    genre: string;
    videoUrl: string;
    releaseYear: number;
    type: string;
    rating?: number;
}

interface Category {
    id: string;
    name: string;
}

const Admin: React.FC = () => {
  const { allMovies, refreshMovies } = useMovies();
  const { isAdmin } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showGenreManager, setShowGenreManager] = useState(false);
  
  // Form States
  const [editingMovie, setEditingMovie] = useState<MovieItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [contentType, setContentType] = useState('movie');
  
  // Asset States
  const [poster, setPoster] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  
  // Dynamic Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // Status States
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmMovie, setDeleteConfirmMovie] = useState<MovieItem | null>(null);

  useEffect(() => {
    if (!isAdmin) {
        // Redundant check for deep-link security
        window.location.href = '/';
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const { data, error } = await supabase.from('movie_categories').select('*').order('name');
        if (error) throw error;
        setCategories(data || []);
        if (data && data.length > 0 && !genre) setGenre(data[0].name);
    } catch (err: any) {
        console.error('Error fetching categories:', err.message);
    }
  };

  const handleEdit = (movie: MovieItem) => {
      setEditingMovie(movie);
      setTitle(movie.title);
      setDescription(movie.description || '');
      setGenre(movie.genre || '');
      setReleaseYear(movie.releaseYear);
      setContentType(movie.type);
      setShowUploadForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setEditingMovie(null);
      setTitle('');
      setDescription('');
      if (categories.length > 0) setGenre(categories[0].name);
      setReleaseYear(new Date().getFullYear());
      setContentType('movie');
      setPoster(null);
      setVideo(null);
      setStatus(null);
      setShowUploadForm(false);
  };

  const handleGenreAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCategoryName.trim()) return;
      setIsCategoryLoading(true);
      try {
          const { error } = await supabase.from('movie_categories').insert({ name: newCategoryName.trim() });
          if (error) throw error;
          setNewCategoryName('');
          await fetchCategories();
      } catch (err: any) {
          alert('Error: ' + err.message);
      } finally {
          setIsCategoryLoading(false);
      }
  };

  const handleGenreDelete = async (id: string, name: string) => {
      if (!window.confirm(`Remove genre "${name}"?`)) return;
      try {
          const { error } = await supabase.from('movie_categories').delete().eq('id', id);
          if (error) throw error;
          await fetchCategories();
      } catch (err: any) {
          alert('Error: ' + err.message);
      }
  };

  const handleUploadOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie && (!poster || !video)) {
        setStatus({ text: "Please select assets!", type: 'error' });
        return;
    }
    
    try {
        setUploading(true);
        setStatus({ text: "Checking bandwidth and file integrity...", type: 'info' });
        setProgress(5);

        // --- NEW: Local Size Check (Supabase Free Tier is limited to 50MB) ---
        const MAX_SIZE = 50 * 1024 * 1024; // 50MB
        if (poster && poster.size > MAX_SIZE) {
            throw new Error(`Poster is too large (${Math.round(poster.size / 1024 / 1024)}MB). Max 50MB.`);
        }
        if (video && video.size > MAX_SIZE) {
            throw new Error(`Original Video is too large (${Math.round(video.size / 1024 / 1024)}MB). Supabase Free Tier limit is 50MB. Please compress it or upgrade to PRO.`);
        }
        // ------------------------------------------------------------------

        setStatus({ text: "Initializing secure cloud handshake...", type: 'info' });
        setProgress(10); 

        let posterUrl = editingMovie?.image || '';
        let videoUrl = editingMovie?.videoUrl || '';

        // 1. Handle Poster Upload
        if (poster) {
            setStatus({ text: "Publishing Step 1/3: Uploading Original Poster...", type: 'info' });
            const posterName = `${Date.now()}_poster.${poster.name.split('.').pop()}`;
            const { error: uploadError } = await (supabase.storage.from('thumbnails') as any).upload(posterName, poster, {
                cacheControl: '3600',
                upsert: true,
                onUploadProgress: (p: any) => {
                    const loaded = p.loaded || 0;
                    const total = p.total || 1;
                    const percent = Math.round((loaded / total) * 100);
                    setProgress(10 + Math.round(percent * 0.2)); // Progress from 10% to 30%
                }
            });
            if (uploadError) throw uploadError;
            posterUrl = supabase.storage.from('thumbnails').getPublicUrl(posterName).data.publicUrl;
        } else {
            setProgress(30);
        }

        // 2. Handle Video Upload (The Long One)
        if (video) {
            setStatus({ text: "Publishing Step 2/3: Streaming Original to Cloud (Resumable)...", type: 'info' });
            const videoName = `${Date.now()}_video.${video.name.split('.').pop()}`;
            
            const { error: uploadError } = await (supabase.storage.from('movies') as any).upload(videoName, video, {
                cacheControl: '3600',
                upsert: true,
                resumable: true, // Enable TUS protocol for large files
                onUploadProgress: (p: any) => {
                    const loaded = p.loaded || 0;
                    const total = p.total || 1;
                    const percent = Math.round((loaded / total) * 100);
                    setProgress(30 + Math.round(percent * 0.6)); // Progress from 30% to 90%
                }
            });
            
            if (uploadError) {
                // Check for specific "Failed to fetch" which often means size limit reached
                if (uploadError.message.toLowerCase().includes('fetch')) {
                    throw new Error("Network Disrupted: Check if your file exceeds the 50MB project limit or your internet connection is unstable.");
                }
                throw uploadError;
            }
            videoUrl = supabase.storage.from('movies').getPublicUrl(videoName).data.publicUrl;
        } else {
            setProgress(90);
        }

        // 3. Database Sync
        setStatus({ text: "Publishing Step 3/3: Synchronizing Database...", type: 'info' });
        const movieData = {
            title,
            description,
            category: genre,
            thumbnail_url: posterUrl,
            video_url: videoUrl,
            release_year: releaseYear,
            type: contentType,
        };

        if (editingMovie) {
            const { error } = await supabase.from('movies').update(movieData).eq('id', editingMovie.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('movies').insert(movieData);
            if (error) throw error;
        }

        // 4. Cleanup old files (Only if update was successful)
        if (editingMovie && poster && editingMovie.image) {
            const oldPath = extractPathFromUrl(editingMovie.image, 'thumbnails');
            if (oldPath) await supabase.storage.from('thumbnails').remove([oldPath]);
        }
        if (editingMovie && video && editingMovie.videoUrl) {
            const oldPath = extractPathFromUrl(editingMovie.videoUrl, 'movies');
            if (oldPath) await supabase.storage.from('movies').remove([oldPath]);
        }

        setProgress(100);
        setStatus({ text: editingMovie ? "Original updated successfully!" : "Original published to Filamu Times!", type: 'success' });
        await refreshMovies();
        setEditingMovie(null);
        setTitle('');
        setDescription('');
        setGenre('');
        setPoster(null);
        setVideo(null);
        setShowUploadForm(false);
    } catch (err: any) {
        let msg = err.message;
        if (msg.includes('Failed to fetch')) {
            msg = "Access Denied / Timeout: Ensure file is under 50MB (Dashboard Limit) or check your connection.";
        }
        setStatus({ text: "FAILED: " + msg, type: 'error' });
    } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 2000);
    }
  };

  const extractPathFromUrl = (url: string, bucket: string) => {
      try {
          // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
          const parts = url.split(`/public/${bucket}/`);
          return parts.length > 1 ? parts[1] : null;
      } catch (err) {
          return null;
      }
  };

  const handleDelete = async (movie: MovieItem) => {
      setDeleteConfirmMovie(null); // Close modal first
      try {
          setDeletingId(movie.id);
          setStatus({ text: "Cleaning up assets...", type: 'info' });

          // Cleanup storage
          const thumbnailPath = extractPathFromUrl(movie.image, 'thumbnails');
          const videoPath = extractPathFromUrl(movie.videoUrl, 'movies');

          if (thumbnailPath) {
              await supabase.storage.from('thumbnails').remove([thumbnailPath]);
          }
          if (videoPath) {
              await supabase.storage.from('movies').remove([videoPath]);
          }

          // Delete record
          const { error } = await supabase.from('movies').delete().eq('id', movie.id);
          if (error) throw error;

          setStatus({ text: "Registry entry purged.", type: 'success' });
          await refreshMovies();
      } catch (err: any) {
          setStatus({ text: "Cleanup failed: " + err.message, type: 'error' });
      } finally {
          setDeletingId(null);
          setTimeout(() => setStatus(null), 3000);
      }
  };

  return (
    <div className="min-h-screen bg-black pb-32">
      <div className="pt-24 px-[4%] md:px-[6%] max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 relative">
            <div className="flex flex-col text-center md:text-left">
                <span className="text-[#E50914] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Systems Management</span>
                <div className="flex items-center gap-6">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
                        ADMIN <span className="text-[#E50914]">CORE</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowUploadForm(!showUploadForm)}
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                                showUploadForm ? 'bg-white text-black rotate-45' : 'bg-[#E50914] text-white hover:scale-110'
                            }`}
                        >
                            <Plus className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                        {!showUploadForm && (
                            <span className="hidden md:block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">
                                Add Original
                            </span>
                        )}
                        <button 
                            onClick={() => setShowGenreManager(!showGenreManager)}
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all border border-white/10 hover:bg-white/5 ${
                                showGenreManager ? 'bg-[#E50914] text-white border-transparent' : 'text-gray-500'
                            }`}
                        >
                            <Settings className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 bg-zinc-900/40 p-2 rounded-2xl border border-white/5">
                <div className="px-6 py-3 border-r border-white/5">
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Live Registry</p>
                    <p className="text-white text-xl font-black">{allMovies.length} ORIGINALS</p>
                </div>
                <div className="px-6 py-3">
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">System State</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <p className="text-white text-xs font-black uppercase tracking-widest">Encrypted</p>
                    </div>
                </div>
            </div>
        </header>

        {/* Global Status Indicator with High-Fidelity Numerical Progress */}
        <AnimatePresence>
            {status && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-xl px-4 pointer-events-none"
                >
                    <div className={`p-10 rounded-[3rem] backdrop-blur-3xl border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col items-center gap-8 pointer-events-auto ${
                        status.type === 'error' ? 'bg-black/95 border-red-500/30' : 
                        status.type === 'success' ? 'bg-black/95 border-green-500/30' : 
                        'bg-black/95 border-white/10'
                    }`}>
                        <div className="flex items-center gap-4">
                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#E50914]" /> : status.type === 'error' ? <FileVideo className="text-red-500" /> : <Plus className="text-green-500" />}
                            <span className="text-sm font-black uppercase tracking-[0.5em] text-white">
                                {status.text}
                            </span>
                        </div>
                        
                        {uploading && (
                            <div className="w-full space-y-6">
                                <div className="text-[6rem] font-black text-white text-center tracking-tighter leading-none shadow-text">{progress}%</div>
                                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-[#E50914] shadow-[0_0_20px_#E50914]" 
                                        animate={{ width: `${progress}%` }} 
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Custom Deletion Modal */}
        <AnimatePresence>
            {deleteConfirmMovie && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteConfirmMovie(null)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-[500px] bg-zinc-900 rounded-[2.5rem] border border-white/10 p-12 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Trash2 className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Confirm Removal</h3>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-10 px-8">
                            Permanently delete <span className="text-white">"{deleteConfirmMovie.title}"</span>? 
                            This will purge all registry entry data and linked storage assets.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => handleDelete(deleteConfirmMovie)}
                                className="w-full py-5 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest text-[11px] hover:bg-red-700 transition-all shadow-2xl shadow-red-900/20"
                            >
                                Purge Assets
                            </button>
                            <button 
                                onClick={() => setDeleteConfirmMovie(null)}
                                className="w-full py-5 rounded-2xl bg-white/5 text-gray-400 font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
                            >
                                Revert Change
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
            {showGenreManager && !showUploadForm && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-16 max-w-[800px]"
                >
                    <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Settings className="w-6 h-6 text-[#E50914]" /> Dynamic Genres
                        </h3>
                        <form onSubmit={handleGenreAdd} className="flex gap-4 mb-8">
                            <input type="text" placeholder="NEW CATEGORY..." className="flex-1 bg-black/40 p-6 rounded-2xl border border-white/5 text-white font-black uppercase" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                            <button type="submit" disabled={isCategoryLoading} className="px-8 rounded-2xl bg-[#E50914] text-white font-black text-[10px] uppercase tracking-widest">Add</button>
                        </form>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <div key={cat.id} className="group relative px-6 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#E50914]/50 transition-all flex items-center gap-3">
                                    <span className="text-white font-black uppercase tracking-widest text-[9px]">{cat.name}</span>
                                    <button onClick={() => handleGenreDelete(cat.id, cat.name)} className="text-gray-700 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {showUploadForm ? (
                <motion.div 
                    key="upload-form"
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-16"
                >
                    <form onSubmit={handleUploadOrUpdate} className="grid lg:grid-cols-[1fr_400px] gap-12">
                        <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{editingMovie ? 'Sync Original' : 'Initiate Original'}</h3>
                                <button type="button" onClick={resetForm} className="text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="grid gap-8">
                                <input type="text" placeholder="TITLE..." className="bg-black/40 p-6 rounded-2xl border border-white/5 text-white font-black text-lg uppercase" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                <textarea rows={5} placeholder="SYNOPSIS..." className="bg-black/40 p-6 rounded-2xl border border-white/5 text-white font-bold resize-none uppercase" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <select className="bg-black/40 p-6 rounded-2xl border border-white/5 text-white font-black uppercase" value={genre} onChange={(e) => setGenre(e.target.value)}>
                                        {categories.map(cat => <option key={cat.id} value={cat.name} className="bg-zinc-900">{cat.name}</option>)}
                                    </select>
                                    <select className="bg-black/40 p-6 rounded-2xl border border-white/5 text-white font-black uppercase" value={contentType} onChange={(e) => setContentType(e.target.value)}>
                                        <option value="movie" className="bg-zinc-900">Movie</option>
                                        <option value="tvshow" className="bg-zinc-900">TV Show</option>
                                    </select>
                                    <input type="number" placeholder="YEAR" className="bg-black/40 p-6 rounded-2xl border border-white/5 text-white font-black uppercase" value={releaseYear} onChange={(e) => setReleaseYear(parseInt(e.target.value))} required />
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="group relative h-32 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#E50914]/50 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden">
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] || null)} />
                                    {poster ? <CheckCircle2 className="text-green-500" /> : <p className="text-[10px] font-black text-gray-700 uppercase">Poster Source</p>}
                                </div>
                                <div className="group relative h-40 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#E50914]/50 flex flex-col items-center justify-center p-4 cursor-pointer">
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
                                    {video ? <FileVideo className="text-[#E50914]" /> : <p className="text-[10px] font-black text-gray-700 uppercase">Video Source</p>}
                                </div>
                            </div>
                            <div className="mt-10">
                                {uploading ? (
                                    <div className="space-y-3">
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                                            <motion.div 
                                                className="h-full bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
                                                animate={{ width: `${progress}%` }} 
                                            />
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black text-[#E50914] animate-pulse">SYNCING...</span>
                                            <span className="text-[10px] font-black text-white">{progress}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button type="submit" className="w-full py-5 rounded-2xl bg-[#E50914] text-white font-black uppercase tracking-widest">{editingMovie ? 'Sync Update' : 'Publish Original'}</button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <motion.div 
                    key="registry-grid"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {allMovies.map((movie: any) => (
                        <motion.div key={movie.id} layout className="group bg-zinc-900/40 rounded-[1.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-[#E50914]/30 transition-all duration-500">
                            <div className="relative aspect-video overflow-hidden">
                                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">{movie.type}</div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 truncate group-hover:text-[#E50914] transition-colors">{movie.title}</h3>
                                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{movie.category || movie.genre} • {movie.release_year || movie.releaseYear}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleEdit(movie)} className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => setDeleteConfirmMovie(movie)} disabled={deletingId === movie.id} className="flex-1 py-4 rounded-xl bg-red-600/10 border border-red-600/20 text-red-600 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                        {deletingId === movie.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {allMovies.length === 0 && (
                        <div className="col-span-full py-20 text-center flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-800 mb-8 border-dashed">
                                <Film className="w-12 h-12 opacity-20" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Registry Offline</h2>
                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-10">No localized FILAMU Originals found.</p>
                            <button 
                                onClick={() => setShowUploadForm(true)}
                                className="px-10 py-5 rounded-full bg-[#E50914] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(229,9,20,0.3)]"
                            >
                                Add Your First Original
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
