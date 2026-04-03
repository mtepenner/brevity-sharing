import React, { useEffect, useState } from 'react';
import { Tweet } from './types';
import { api } from './services/api';
import { PostCard } from './components/PostCard';
import { ComposePost } from './components/ComposePost';

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      const data = await api.getTimeline();
      setTweets(data);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load tweets on initial mount
  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <main className="w-full max-w-xl bg-white min-h-screen shadow-sm border-x border-gray-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </header>

        {/* Compose Area */}
        <ComposePost onPostCreated={fetchTimeline} />

        {/* Timeline */}
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : tweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No posts yet. Be the first!</div>
        ) : (
          <div className="flex flex-col">
            {tweets.map((tweet) => (
              <PostCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
