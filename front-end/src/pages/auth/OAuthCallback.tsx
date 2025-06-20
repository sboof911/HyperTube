import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, defaultHeaders } from "../../config";
import { User } from "../../contexts/AuthContext";
import { useAuth } from '../../contexts/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();

  const { syncAuthFromStorage } = useAuth();

  useEffect(() => {
    const handleOAuthResponse = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        console.error('Missing token in OAuth callback');
        navigate('/login');
        return;
      }

      localStorage.setItem('token', JSON.stringify(token));
      try {
        const headers = {
          ...defaultHeaders,
          ...{ Authorization: token },
        };
        const response = await fetch(`${API_URL}/users/public`, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json(); 
        const loginUser = data as User;
        console.log('OAuth login successful:', loginUser);

        localStorage.setItem('user', JSON.stringify(loginUser));
        syncAuthFromStorage(); // 👈 update context state
      } catch (err) {
        console.error('OAuth login failed:', err);
      }
      finally {
        navigate('/library');
      }
    };

    handleOAuthResponse();
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default OAuthCallback;
