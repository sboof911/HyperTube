import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import MovieCard, { Movie } from '../components/movies/MovieCard';
import Button from '../components/common/Button';

const LibraryPage = () => {
  const { t } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2025]);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Initial data fetch
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a larger set of mock movies
        const mockMovies: Movie[] = [];
        const genres = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
        const posters = [
          'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
          'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_.jpg',
        ];
        
        for (let i = 1; i <= 50; i++) {
          const randomYear = Math.floor(Math.random() * (2025 - 1970) + 1970);
          const randomRating = parseFloat((Math.random() * 3 + 7).toFixed(1)); // Random rating between 7.0 and 10.0
          const randomDuration = Math.floor(Math.random() * 60 + 90); // 90-150 minutes
          const numGenres = Math.floor(Math.random() * 3) + 1; // 1-3 genres
          const movieGenres = [];
          
          for (let j = 0; j < numGenres; j++) {
            const genre = genres[Math.floor(Math.random() * genres.length)];
            if (!movieGenres.includes(genre)) {
              movieGenres.push(genre);
            }
          }
          
          mockMovies.push({
            id: `tt${(1000000 + i).toString()}`,
            title: `Movie Title ${i}`,
            year: randomYear,
            rating: randomRating,
            duration: randomDuration,
            genres: movieGenres,
            posterUrl: posters[Math.floor(Math.random() * posters.length)],
          });
        }
        
        setMovies(mockMovies);
        setFilteredMovies(mockMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle pagination
  useEffect(() => {
    const ITEMS_PER_PAGE = 8;
    setDisplayedMovies(filteredMovies.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(page * ITEMS_PER_PAGE < filteredMovies.length);
  }, [filteredMovies, page]);

  // Handle search and filters
  useEffect(() => {
    if (!movies.length) return;
    
    let results = [...movies];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(movie => movie.title.toLowerCase().includes(query));
    }
    
    // Apply genre filter
    if (selectedGenre) {
      results = results.filter(movie => movie.genres.includes(selectedGenre));
    }
    
    // Apply rating filter
    if (minRating > 0) {
      results = results.filter(movie => movie.rating >= minRating);
    }
    
    // Apply year range filter
    results = results.filter(
      movie => movie.year >= yearRange[0] && movie.year <= yearRange[1]
    );
    
    setFilteredMovies(results);
    setPage(1); // Reset pagination when filters change
  }, [searchQuery, selectedGenre, minRating, yearRange, movies]);

  // Get unique genres from all movies
  const genres = [...new Set(movies.flatMap(movie => movie.genres))].sort();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinRating(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    setYearRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = newValue;
      return newRange;
    });
  };

  const resetFilters = () => {
    setSelectedGenre('');
    setMinRating(0);
    setYearRange([1900, 2025]);
    setSearchQuery('');
  };

  return (
    <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('movieLibrary')}</h1>
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder={t('searchMovies')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal size={18} />}
            >
              {t('filters')}
            </Button>
            
            {(selectedGenre || minRating > 0 || yearRange[0] > 1900 || yearRange[1] < 2025) && (
              <Button
                variant="outline"
                onClick={resetFilters}
                leftIcon={<X size={18} />}
              >
                {t('resetFilters')}
              </Button>
            )}
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-1">
                {t('genre')}
              </label>
              <select
                id="genre"
                value={selectedGenre}
                onChange={handleGenreChange}
                className="w-full px-3 py-2 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('allGenres')}</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-1">
                {t('minRating')}: {minRating}+
              </label>
              <input
                type="range"
                id="rating"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={handleRatingChange}
                className="w-full accent-red-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('yearRange')}: {yearRange[0]} - {yearRange[1]}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1900"
                  max="2025"
                  value={yearRange[0]}
                  onChange={e => handleYearChange(e, 0)}
                  className="w-24 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span>-</span>
                <input
                  type="number"
                  min="1900"
                  max="2025"
                  value={yearRange[1]}
                  onChange={e => handleYearChange(e, 1)}
                  className="w-24 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {filteredMovies.length === 0 ? (
            <p>{t('noMoviesFound')}</p>
          ) : (
            <p>
              {t('showing')} {displayedMovies.length} {t('of')} {filteredMovies.length} {t('movies')}
            </p>
          )}
        </div>
        
        {/* Movie grid */}
        {isLoading && movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('loadingMovies')}</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">{t('noResultsFound')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('tryAdjustingFilters')}</p>
            <Button variant="outline" onClick={resetFilters}>
              {t('clearFilters')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {displayedMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        
        {/* Loading indicator at bottom for infinite scroll */}
        {hasMore && !isLoading && filteredMovies.length > 0 && (
          <div
            ref={loadingRef}
            className="flex justify-center items-center py-8"
          >
            <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full"></div>
          </div>
        )}
        
        {/* End of results message */}
        {!hasMore && filteredMovies.length > 0 && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            {t('endOfResults')}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;