import { useState } from 'react';
import { useAuth, User } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../common/Button';
import { Save, Upload } from 'lucide-react';

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
    languagePreference: user?.languagePreference || language,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateProfile(formData);
      
      // Update language if changed
      if (formData.languagePreference && formData.languagePreference !== language) {
        setLanguage(formData.languagePreference);
      }
      
      setMessage({
        text: t('profileUpdateSuccess'),
        type: 'success',
      });
    } catch (error) {
      setMessage({
        text: t('profileUpdateError'),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload the file to a server and get a URL back
    // For this demo, we'll use a placeholder
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={formData.profilePicture || 'https://i.pravatar.cc/150?img=68'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-600"
          />
          <label
            htmlFor="profilePicture"
            className="absolute -bottom-2 -right-2 p-2 bg-red-600 text-white rounded-full cursor-pointer hover:bg-red-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="sr-only">{t('uploadPhoto')}</span>
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('profilePictureHint')}</p>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {t('name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="languagePreference" className="block text-sm font-medium mb-1">
            {t('preferredLanguage')}
          </label>
          <select
            id="languagePreference"
            name="languagePreference"
            value={formData.languagePreference}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            rightIcon={<Save className="w-4 h-4" />}
          >
            {t('saveChanges')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;