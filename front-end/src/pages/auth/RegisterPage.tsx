import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Film, UserPlus, User, Mail, Lock } from 'lucide-react';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }
    
    if (!formData.username.trim()) {
      newErrors.username = t('usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('usernameTooShort');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordTooShort');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDontMatch');
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t('mustAcceptTerms');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(formData.name, formData.username, formData.email, formData.password);
      navigate('/library');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: t('registrationError'),
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
        <h2 className="mt-4 text-center text-3xl font-bold">{t('createAccount')}</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t('registerToStart')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('fullName')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.name ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('username')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.username ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')}
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.email ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.password ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('confirmPassword')}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.confirmPassword ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className={`h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded ${
                  errors.acceptTerms ? 'border-red-500' : ''
                }`}
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('agreeToTerms')}{' '}
                <a href="#" className="text-red-600 hover:text-red-500">
                  {t('termsAndConditions')}
                </a>
              </label>
            </div>
            {errors.acceptTerms && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>}

            <div>
              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<UserPlus className="w-4 h-4" />}
              >
                {t('register')}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;