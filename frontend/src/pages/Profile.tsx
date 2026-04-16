import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { Tweet, User } from '../types';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  // Mock tweets for the logged-in user (replace with API call as the app grows)
  const [userTweets] = useState<Tweet[]>([
    {
      id: '1',
      author: user.username,
      content: 'Just joined Brevity! 👋',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      author: user.username,
      content: 'Loving the minimalist design of this platform.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <main className="w-full bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
      </header>

      {/* Profile card */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-400 to-purple-500" />

        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="-mt-16 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.username[0].toUpperCase()}
            </div>
          </div>

          {/* Details */}
          <div className="mb-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.username}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
          </div>

          {user.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-3">{user.bio}</p>
          )}

          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>📅 Joined {joinDate}</span>
          </div>

          <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* User tweets */}
      <div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Posts</h3>
        </div>
        {userTweets.length > 0 ? (
          <div className="flex flex-col">
            {userTweets.map((tweet) => (
              <PostCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No posts yet</div>
        )}
      </div>
    </main>
  );
};
