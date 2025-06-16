import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Film, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Check scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? `${theme === 'dark' ? 'bg-gray-900/95 shadow-md' : 'bg-white/95 shadow-md'} backdrop-blur-sm`
      : `${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold tracking-tight">Hypertube</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="hover:text-red-600 transition-colors font-medium">
              {t('home')}
            </Link>
            
            {isAuthenticated && (
              <Link to="/library" className="hover:text-red-600 transition-colors font-medium">
                {t('library')}
              </Link>
            )}

            {/* Authentication links */}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-red-600 transition-colors font-medium">
                  {t('profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-600 transition-colors font-medium flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-600 transition-colors font-medium">
                  {t('login')}
                </Link>
                <Link to="/register" className="hover:text-red-600 transition-colors font-medium">
                  {t('register')}
                </Link>
              </>
            )}

            {/* Language toggle */}
            <div className="flex items-center space-x-2 border-l pl-2 border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded ${
                  language === 'en'
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded ${
                  language === 'fr'
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                FR
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <div className="px-4 py-3 space-y-4">
            <Link
              to="/"
              className="block hover:text-red-600 transition-colors font-medium py-2"
            >
              {t('home')}
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/library"
                className="block hover:text-red-600 transition-colors font-medium py-2"
              >
                {t('library')}
              </Link>
            )}

            {/* Authentication links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block hover:text-red-600 transition-colors font-medium py-2"
                >
                  {t('profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-red-600 transition-colors font-medium py-2"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-red-600 transition-colors font-medium py-2"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="block hover:text-red-600 transition-colors font-medium py-2"
                >
                  {t('register')}
                </Link>
              </>
            )}

            {/* Language toggle */}
            <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm">{t('language')}:</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded ${
                  language === 'en'
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded ${
                  language === 'fr'
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                FR
              </button>
            </div>

            {/* Theme toggle */}
            <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm">{t('theme')}:</span>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>{t('lightMode')}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>{t('darkMode')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;