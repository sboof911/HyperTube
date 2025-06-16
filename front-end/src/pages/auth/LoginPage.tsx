import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Film, Film as Film2, User, Lock, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const { login, loginWithOAuth } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError(t('allFieldsRequired'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(formData.email, formData.password);
      
      // Redirect to the page the user was trying to access, or to library
      const from = location.state?.from?.pathname || '/library';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError(t('invalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | '42') => {
    try {
      setIsSubmitting(true);
      await loginWithOAuth(provider);
      
      // Redirect to the page the user was trying to access, or to library
      const from = location.state?.from?.pathname || '/library';
      navigate(from, { replace: true });
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(t('oauthError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Film className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="mt-4 text-center text-3xl font-bold">{t('welcomeBack')}</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t('loginToContinue')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* OAuth options */}
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleOAuthLogin('google')}
              disabled={isSubmitting}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              {t('continueWithGoogle')}
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleOAuthLogin('42')}
              disabled={isSubmitting}
            >
              <Film2 className="w-5 h-5 mr-2" />
              {t('continueWith42')}
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('emailOrUsername')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('password')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                  {t('forgotPassword')}
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<LogIn className="w-4 h-4" />}
              >
                {t('login')}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dontHaveAccount')}{' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;