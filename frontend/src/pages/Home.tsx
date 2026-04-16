import React, { useState } from 'react';
import { useTimeline } from '../hooks/useTimeline';
import { PostCard } from '../components/PostCard';
import { ComposePost } from '../components/ComposePost';
import { SearchUsers } from '../components/SearchUsers';
import { FriendsList } from '../components/FriendsList';
import { FriendRequests } from '../components/FriendRequests';
import { User, Page } from '../types';

interface HomeProps {
  user: User;
  onLogout: () => void;
  onNavigate?: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  const { tweets, loading, error, refetch } = useTimeline();
  const [showSearchUsers, setShowSearchUsers] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  return (
    <main className="w-full bg-white dark:bg-gray-900 min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Brevity
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your feed</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {user.username}
            </span>
          </button>
        </div>

        {/* Social Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowSearchUsers(true)}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition font-semibold text-sm"
          >
            🔍 Find Friends
          </button>
          <button
            onClick={() => setShowFriendsList(true)}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition font-semibold text-sm"
          >
            👥 Friends
          </button>
          <button
            onClick={() => setShowFriendRequests(true)}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition font-semibold text-sm"
          >
            👋 Requests
          </button>
        </div>
      </header>

      <ComposePost onPostCreated={refetch} />

      {error && (
        <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg m-4 shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3 animate-bounce">✨</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
            Loading your feed…
          </p>
        </div>
      ) : tweets.length === 0 && !error ? (
        <div className="p-12 text-center">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No posts yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Be the first to share something!
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          {tweets.map((tweet) => (
            <PostCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}

      {showSearchUsers && (
        <SearchUsers currentUserId={user.id} onClose={() => setShowSearchUsers(false)} />
      )}
      {showFriendsList && (
        <FriendsList userId={user.id} onClose={() => setShowFriendsList(false)} />
      )}
      {showFriendRequests && (
        <FriendRequests userId={user.id} onClose={() => setShowFriendRequests(false)} />
      )}
    </main>
  );
};
