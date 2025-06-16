import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Film, Mail, ArrowLeft, Send } from 'lucide-react';
import Button from '../../components/common/Button';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({
        text: t('emailRequired'),
        type: 'error',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await forgotPassword(email);
      
      setMessage({
        text: t('resetLinkSent'),
        type: 'success',
      });
      setEmail('');
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({
        text: t('resetLinkError'),
        type: 'error',
      });
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
        <h2 className="mt-4 text-center text-3xl font-bold">{t('forgotPassword')}</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t('resetPasswordInstructions')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {message.text && (
              <div
                className={`p-4 rounded-md ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('emailAddress')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                {t('sendResetLink')}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center font-medium text-red-600 hover:text-red-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;