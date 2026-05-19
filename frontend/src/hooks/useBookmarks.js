import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import api from '../services/api';

export const useBookmarks = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/bookmarks')
        .then(res => setBookmarks(res.data.map(b => b._id)))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const isBookmarked = (policyId) => bookmarks.includes(policyId);

  const toggleBookmark = async (policyId) => {
    if (isBookmarked(policyId)) {
      await api.delete(`/users/bookmarks/${policyId}`);
      setBookmarks(prev => prev.filter(id => id !== policyId));
    } else {
      await api.post(`/users/bookmarks/${policyId}`);
      setBookmarks(prev => [...prev, policyId]);
    }
  };

  return { bookmarks, isBookmarked, toggleBookmark };
};

export default useBookmarks;
