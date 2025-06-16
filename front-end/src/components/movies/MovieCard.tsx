import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  posterUrl: string;
  duration: number; // in minutes
  genres: string[];
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div 
      className="group relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 hover:z-10"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        {/* Image loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700"></div>
        )}
        
        {/* Fallback image if error */}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        ) : (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Overlay with info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
          
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-white text-sm">{movie.rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-300 mr-1" />
              <span className="text-white text-sm">{movie.year}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-300 mr-1" />
              <span className="text-white text-sm">{formatRuntime(movie.duration)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 2).map((genre, index) => (
              <span key={index} className="text-xs bg-red-600/80 text-white px-2 py-0.5 rounded">
                {genre}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="text-xs bg-gray-600/80 text-white px-2 py-0.5 rounded">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Always visible info (for non-hover devices) */}
      <div className="p-3 bg-white dark:bg-gray-800 md:group-hover:hidden">
        <h3 className="font-medium line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm">{movie.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{movie.year}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;