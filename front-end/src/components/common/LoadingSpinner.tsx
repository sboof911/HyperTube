import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'md', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm dark:bg-black/40 z-50">
        <div className="flex flex-col items-center">
          <Loader2 className={`${sizeClasses[size]} text-red-600 animate-spin`} />
          <span className="mt-2 text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} text-red-600 animate-spin`} />
      <span className="mt-2 text-sm font-medium">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;