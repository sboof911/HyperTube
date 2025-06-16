import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Film, Clock, Star, AlarmClock } from 'lucide-react';
import { Movie } from '../movies/MovieCard';

interface WatchedMoviesListProps {
  userId: string;
}

const WatchedMoviesList = ({ userId }: WatchedMoviesListProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockMovies: Movie[] = [
          {
            id: 'tt0111161',
            title: 'The Shawshank Redemption',
            year: 1994,
            rating: 9.3,
            duration: 142,
            genres: ['Drama'],
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
          },
          {
            id: 'tt0068646',
            title: 'The Godfather',
            year: 1972,
            rating: 9.2,
            duration: 175,
            genres: ['Crime', 'Drama'],
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
          },
          {
            id: 'tt0468569',
            title: 'The Dark Knight',
            year: 2008,
            rating: 9.0,
            duration: 152,
            genres: ['Action', 'Crime', 'Drama'],
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
          }
        ];
        
        setWatchedMovies(mockMovies);
      } catch (error) {
        console.error('Error fetching watched movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t('loadingWatchedMovies')}</p>
      </div>
    );
  }

  if (watchedMovies.length === 0) {
    return (
      <div className="py-8 text-center">
        <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">{t('noWatchedMovies')}</h3>
        <p className="text-gray-500 dark:text-gray-400">{t('startWatchingMovies')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t('watchedMovies')}</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {watchedMovies.map(movie => (
          <div
            key={movie.id}
            className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-16 h-24 object-cover"
            />
            <div className="p-3 flex-1">
              <h4 className="font-medium">{movie.title}</h4>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1 flex-wrap gap-y-1">
                <span className="flex items-center mr-3">
                  <Clock className="w-3 h-3 mr-1" />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
                <span className="flex items-center mr-3">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="flex items-center">
                  <AlarmClock className="w-3 h-3 mr-1" />
                  {t('watchedOn')}: 2 {t('weeksAgo')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchedMoviesList;