import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Film, Home, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <Film className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-4">404</h1>
        
        <div className="flex items-center justify-center mb-6">
          <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold">{t('pageNotFound')}</h2>
        </div>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {t('pageNotFoundMessage')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-5 h-5" />}
          >
            {t('backToHome')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            {t('goBack')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;