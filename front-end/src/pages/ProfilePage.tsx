import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, History } from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm';
import WatchedMoviesList from '../components/profile/WatchedMoviesList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="pt-20 md:pt-24 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4 lg:w-1/5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <img
                  src={user.profilePicture || 'https://i.pravatar.cc/150?img=68'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-red-600"
                />
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-gray-100 dark:bg-gray-700 font-medium border-l-4 border-red-600 pl-5' 
                        : ''
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    {t('profileSettings')}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      activeTab === 'history' 
                        ? 'bg-gray-100 dark:bg-gray-700 font-medium border-l-4 border-red-600 pl-5' 
                        : ''
                    }`}
                  >
                    <History className="w-5 h-5 mr-3" />
                    {t('watchHistory')}
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4 lg:w-4/5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {activeTab === 'profile' ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">{t('profileSettings')}</h2>
                  <ProfileForm />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">{t('watchHistory')}</h2>
                  <WatchedMoviesList userId={user.id} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;