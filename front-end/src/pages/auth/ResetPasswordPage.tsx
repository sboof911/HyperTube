import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Film, Lock, ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/common/Button';

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError(t('invalidToken'));
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDontMatch'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword(token, formData.password);
      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(t('resetPasswordError'));
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
        <h2 className="mt-4 text-center text-3xl font-bold">{t('resetPassword')}</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t('enterNewPassword')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800/30 p-4 rounded-md mb-4">
                <h3 className="text-green-800 dark:text-green-200 font-medium mb-1">{t('passwordResetSuccess')}</h3>
                <p className="text-green-700 dark:text-green-300">{t('redirectingToLogin')}</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center font-medium text-red-600 hover:text-red-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('backToLogin')}
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {!token && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-md text-sm">
                  {t('missingToken')}
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('newPassword')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={!token}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('confirmNewPassword')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={!token}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={!token}
                  rightIcon={<Save className="w-4 h-4" />}
                >
                  {t('resetPassword')}
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center font-medium text-red-600 hover:text-red-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  {t('backToLogin')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;