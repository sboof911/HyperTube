import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Film, Film as Film2, Play, LogIn, Search, Subtitles } from 'lucide-react';
import Button from '../components/common/Button';
import MovieCard, { Movie } from '../components/movies/MovieCard';

const HomePage = () => {
  const { isAuthenticated, loginWithOAuth } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
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
          },
          {
            id: 'tt0167260',
            title: 'The Lord of the Rings: The Return of the King',
            year: 2003,
            rating: 9.0,
            duration: 201,
            genres: ['Adventure', 'Drama', 'Fantasy'],
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
          },
        ];
        
        setFeaturedMovies(mockMovies);
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  const handleOAuthLogin = async (provider: 'google' | '42') => {
    try {
      await loginWithOAuth(provider);
      navigate('/library');
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  return (
    <div className="pb-8">
      {/* Hero section */}
      <div className="relative -mt-20 h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-0">
          <div className="absolute inset-0 bg-black/50 md:bg-transparent"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Cinema background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="container mx-auto relative z-10 px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl md:text-4xl font-bold">Hypertube</h1>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('heroTitle')}
            </h2>
            
            <p className="text-lg mb-8 text-gray-200">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/library')}
                    rightIcon={<Play className="w-5 h-5" />}
                  >
                    {t('browseLibrary')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.scrollTo({ top: document.getElementById('featured')?.offsetTop || 0, behavior: 'smooth' })}
                  >
                    {t('discoverMovies')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/login')}
                    rightIcon={<LogIn className="w-5 h-5" />}
                  >
                    {t('getStarted')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.scrollTo({ top: document.getElementById('featured')?.offsetTop || 0, behavior: 'smooth' })}
                  >
                    {t('learnMore')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent"></div>
      </div>

      {/* Featured section */}
      <div id="featured" className="pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">{t('featuredMovies')}</h2>
            
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => navigate('/library')}
                rightIcon={<Search className="w-4 h-4" />}
              >
                {t('exploreAll')}
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {featuredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              
              {!isAuthenticated && (
                <div className="mt-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">{t('unlockFullAccess')}</h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    {t('signupPrompt')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/register')}
                    >
                      {t('signUp')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                    >
                      {t('login')}
                    </Button>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="mb-4 font-medium">{t('orContinueWith')}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => handleOAuthLogin('google')}
                        className="w-full sm:w-auto"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                          alt="Google"
                          className="w-5 h-5 mr-2"
                        />
                        Google
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleOAuthLogin('42')}
                        className="w-full sm:w-auto"
                      >
                        <Film2 className="w-5 h-5 mr-2" />
                        42
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <Film className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('featureOneTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('featureOneDesc')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('featureTwoTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('featureTwoDesc')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <Subtitles className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('featureThreeTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('featureThreeDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;