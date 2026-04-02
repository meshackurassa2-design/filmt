import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, SlidersHorizontal, Film, Tv, Clock } from 'lucide-react';
import Row from '../components/Row';
import { useMovies } from '../context/MovieContext';

const Search: React.FC = () => {
    const { 
        allMovies, 
        searchQuery, 
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectedYear,
        setSelectedYear
    } = useMovies();

    const genres = ['All', 'Action', 'Sci-Fi', 'Horror', 'Comedy', 'Documentary'];
    const years = ['All', '2025', '2024', '2023', '2022', '2021', '2020'];

    // Filter logic
    const results = allMovies.filter(m => {
        const genreMatch = selectedGenre === 'All' || m.genre === selectedGenre;
        const yearMatch = selectedYear === 'All' || m.releaseYear?.toString() === selectedYear;
        const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
        return genreMatch && yearMatch && searchMatch;
    });

    const moviesResults = results.filter(r => r.type === 'movie');
    const tvResults = results.filter(r => r.type === 'tvshow');

    return (
        <div className="min-h-screen bg-black">
            
            <main className="pt-32 pb-40 px-[4%] md:px-[6%]">
                {/* Search Bar & Header */}
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group mb-8"
                    >
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#E50914] transition-all group-focus-within:scale-110" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH MILLIONS OF ORIGINALS..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-xl md:text-2xl font-black text-white placeholder:text-gray-700 outline-none focus:border-[#E50914]/50 focus:bg-white/10 transition-all uppercase tracking-tighter"
                        />
                        <AnimatePresence>
                            {searchQuery && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#E50914] transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <SlidersHorizontal className="w-3 h-3 text-gray-500" />
                            <select 
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="bg-transparent text-[10px] font-black text-white uppercase outline-none cursor-pointer tracking-widest"
                            >
                                {genres.map(g => <option key={g} value={g} className="bg-zinc-900">{g.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-transparent text-[10px] font-black text-white uppercase outline-none cursor-pointer tracking-widest"
                            >
                                {years.map(y => <option key={y} value={y} className="bg-zinc-900">{y.toUpperCase()}</option>)}
                            </select>
                        </div>
                        {(selectedGenre !== 'All' || selectedYear !== 'All' || searchQuery) && (
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); setSelectedYear('All'); }}
                                className="text-[10px] font-black text-[#E50914] uppercase tracking-widest hover:underline"
                            >
                                Reset Discovery
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex flex-col gap-20">
                    {results.length > 0 ? (
                        <>
                            {moviesResults.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="flex items-center gap-3 mb-6 px-4">
                                        <Film className="w-5 h-5 text-[#E50914]" />
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Movie Results</h3>
                                    </div>
                                    <Row title="" movies={moviesResults} />
                                </motion.div>
                            )}

                            {tvResults.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="flex items-center gap-3 mb-6 px-4">
                                        <Tv className="w-5 h-5 text-[#E50914]" />
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">TV Show Results</h3>
                                    </div>
                                    <Row title="" movies={tvResults} />
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-40 text-center glass rounded-[3rem] border border-white/5 max-w-2xl mx-auto shadow-3xl"
                        >
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-10 border border-white/5">
                                <SearchIcon className="w-12 h-12 text-gray-800" />
                            </div>
                            <h3 className="text-4xl font-black mb-6 text-white tracking-tighter uppercase">Discovery Nada</h3>
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] max-w-sm px-6 leading-loose">
                                We couldn't find any originals matching your criteria. Try different keywords or reset your filters.
                            </p>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Search;
