import React from 'react';
import { useTimeline } from '../hooks/useTimeline';
import { PostCard } from '../components/PostCard';
import { ComposePost } from '../components/ComposePost';

export const Home: React.FC = () => {
  // Destructure exactly what we need from our custom hook
  const { tweets, loading, error, refetch } = useTimeline();

  return (
    <main className="w-full max-w-xl bg-white min-h-screen shadow-sm border-x border-gray-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">Home</h1>
      </header>

      {/* Compose Area - pass the refetch function so it updates on submit */}
      <ComposePost onPostCreated={refetch} />

      {/* Error State */}
      {error && (
        <div className="p-4 text-center text-red-500 bg-red-50">{error}</div>
      )}

      {/* Timeline State Machine */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse">Loading feed...</div>
      ) : tweets.length === 0 && !error ? (
        <div className="p-8 text-center text-gray-500">No posts yet. Be the first!</div>
      ) : (
        <div className="flex flex-col">
          {tweets.map((tweet) => (
            <PostCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </main>
  );
};
