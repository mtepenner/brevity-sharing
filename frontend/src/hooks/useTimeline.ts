import { useState, useEffect, useCallback } from 'react';
import { Tweet } from '../types';
import { api } from '../services/api';

export const useTimeline = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback prevents this function from being recreated on every render
  const fetchTimeline = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getTimeline();
      setTweets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load timeline. Is the Go backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch immediately when the hook mounts
  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  return { 
    tweets, 
    loading, 
    error, 
    refetch: fetchTimeline // Expose this so the compose component can refresh the feed
  };
};
