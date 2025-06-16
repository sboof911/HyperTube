import { useLanguage } from '../../contexts/LanguageContext';
import { Film, Github, Heart } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <Film className="w-6 h-6 text-red-600" />
              <span className="text-lg font-bold">Hypertube</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              {t('footerTagline')}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-4">{t('quickLinks')}</h3>
            <div className="flex flex-col items-center space-y-2">
              <a href="#" className="text-sm hover:text-red-600 transition-colors">
                {t('about')}
              </a>
              <a href="#" className="text-sm hover:text-red-600 transition-colors">
                {t('faq')}
              </a>
              <a href="#" className="text-sm hover:text-red-600 transition-colors">
                {t('contact')}
              </a>
              <a href="#" className="text-sm hover:text-red-600 transition-colors">
                {t('privacyPolicy')}
              </a>
            </div>
          </div>

          {/* Social & Legal */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-4">{t('connect')}</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-right">
              &copy; {currentYear} Hypertube. {t('allRightsReserved')}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center">
            {t('madeWith')} <Heart className="w-4 h-4 mx-1 text-red-600" /> {t('usingReact')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;