import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { Tweet } from '../types';

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  joinDate: string;
}

export const Profile: React.FC = () => {
  const [user] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    handle: '@johndoe',
    bio: 'Software engineer | Coffee enthusiast | Open source contributor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
    followers: 1234,
    following: 567,
    joinDate: 'January 2024',
  });

  // Mock user tweets
  const [userTweets] = useState<Tweet[]>([
    {
      id: '1',
      author: user.name,
      content: 'Just launched my new project!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      author: user.name,
      content: 'Wednesday tip: Always write tests for your code',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  return (
    <main className="w-full max-w-xl bg-white min-h-screen shadow-sm border-x border-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      {/* Profile Card */}
      <div className="bg-white border-b border-gray-200">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="-mt-16 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white bg-gray-100"
            />
          </div>

          {/* User Details */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.handle}</p>
          </div>

          {/* Bio */}
          <p className="text-gray-700 mb-4">{user.bio}</p>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-500 mb-4">
            <span>
              <strong className="text-gray-900">{user.followers}</strong> Followers
            </span>
            <span>
              <strong className="text-gray-900">{user.following}</strong> Following
            </span>
            <span>Joined {user.joinDate}</span>
          </div>

          {/* Action Button */}
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* User's Tweets */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Posts</h3>
        </div>

        {userTweets.length > 0 ? (
          <div className="flex flex-col">
            {userTweets.map((tweet) => (
              <PostCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No posts yet</div>
        )}
      </div>
    </main>
  );
};
