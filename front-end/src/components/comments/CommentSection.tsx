import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Send, Edit3, Trash2 } from 'lucide-react';
import Button from '../common/Button';

export interface Comment {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  movieId: string;
}

const CommentSection = ({ movieId }: CommentSectionProps) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments (mock implementation)
  useEffect(() => {
    // Mock data
    const mockComments: Comment[] = [
      {
        id: '1',
        movieId,
        userId: '123',
        userName: 'John Doe',
        userPhoto: 'https://i.pravatar.cc/150?img=68',
        text: 'Great movie! One of my favorites.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        movieId,
        userId: '456',
        userName: 'Jane Smith',
        userPhoto: 'https://i.pravatar.cc/150?img=47',
        text: 'The cinematography was amazing, but the plot had some holes.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    setComments(mockComments);
  }, [movieId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        movieId,
        userId: user.id,
        userName: user.name,
        userPhoto: user.profilePicture,
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditText(comment.text);
    }
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingComment) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComments(prev => 
        prev.map(comment => 
          comment.id === editingComment
            ? { ...comment, text: editText.trim() }
            : comment
        )
      );
      
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm(t('confirmDeleteComment'))) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return t('justNow');
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? t('minuteAgo') : t('minutesAgo')}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? t('hourAgo') : t('hoursAgo')}`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? t('dayAgo') : t('daysAgo')}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{t('comments')}</h3>
      
      {isAuthenticated ? (
        <div className="mb-6">
          <textarea
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={t('writeComment')}
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="mt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitComment}
              isLoading={isSubmitting}
              disabled={!newComment.trim()}
              rightIcon={<Send size={16} />}
            >
              {t('postComment')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-center">
          <p>{t('loginToComment')}</p>
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('noComments')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="flex items-start">
                <img
                  src={comment.userPhoto || 'https://i.pravatar.cc/150?img=65'}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{comment.userName}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    
                    {user && user.id === comment.userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400"
                          aria-label={t('edit')}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400"
                          aria-label={t('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      ></textarea>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingComment(null)}
                        >
                          {t('cancel')}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleUpdateComment}
                          isLoading={isSubmitting}
                          disabled={!editText.trim()}
                        >
                          {t('update')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;