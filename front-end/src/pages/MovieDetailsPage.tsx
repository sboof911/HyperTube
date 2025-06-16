import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Star, Clock, Calendar, User, Users, Heart, ChevronLeft } from 'lucide-react';
import Button from '../components/common/Button';
import VideoPlayer from '../components/movies/VideoPlayer';
import CommentSection from '../components/comments/CommentSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface MovieDetails {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: number; // in minutes
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  overview: string;
  director: string;
  producer: string;
  actors: string[];
  videoUrl: string;
}

interface Subtitle {
  code: string;
  language: string;
  url: string;
}

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockMovie: MovieDetails = {
          id,
          title: 'The Shawshank Redemption',
          year: 1994,
          rating: 9.3,
          duration: 142,
          genres: ['Drama', 'Crime'],
          posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
          backdropUrl: 'https://m.media-amazon.com/images/M/MV5BNTYxOTYyMzE3NV5BMl5BanBnXkFtZTcwOTMxNDY3Mw@@._V1_.jpg',
          overview: 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
          director: 'Frank Darabont',
          producer: 'Niki Marvin',
          actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
          videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        };
        
        const mockSubtitles: Subtitle[] = [
          { code: 'en', language: 'English', url: 'https://example.com/subtitles/en.vtt' },
          { code: 'fr', language: 'French', url: 'https://example.com/subtitles/fr.vtt' },
          { code: 'es', language: 'Spanish', url: 'https://example.com/subtitles/es.vtt' },
        ];
        
        setMovie(mockMovie);
        setSubtitles(mockSubtitles);
        setIsFavorite(Math.random() > 0.5); // Randomly set as favorite
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would save to user's favorites
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">{t('movieNotFound')}</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/library')}
          leftIcon={<ChevronLeft size={18} />}
        >
          {t('backToLibrary')}
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-8">
      {/* Movie backdrop */}
      <div className="relative h-[40vh] md:h-[50vh] -mt-20 mb-8">
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/library')}
              leftIcon={<ChevronLeft size={16} />}
              className="mb-4 bg-black/30 hover:bg-black/50 border-gray-600"
            >
              {t('backToLibrary')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Movie info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Poster and quick info */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center text-lg">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="font-bold">{movie.rating.toFixed(1)}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">/10</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <span>{formatRuntime(movie.duration)}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{movie.year}</span>
              </div>
              
              <div className="pt-3 flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <Button
                variant={isFavorite ? 'primary' : 'outline'}
                leftIcon={<Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />}
                onClick={handleFavoriteToggle}
                fullWidth
                className="mt-4"
              >
                {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
              </Button>
            </div>
          </div>
          
          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {movie.title}
            </h1>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('overview')}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.overview}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('cast')}</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <User className="w-5 h-5 mr-2 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {t('director')}:
                    </span>{' '}
                    <span>{movie.director}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="w-5 h-5 mr-2 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {t('producer')}:
                    </span>{' '}
                    <span>{movie.producer}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 mr-2 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {t('starring')}:
                    </span>{' '}
                    <span>{movie.actors.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video player */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('watchMovie')}</h2>
              <VideoPlayer 
                videoSrc={movie.videoUrl} 
                posterSrc={movie.backdropUrl}
                subtitles={subtitles}
              />
            </div>
            
            {/* Comments section */}
            <CommentSection movieId={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;