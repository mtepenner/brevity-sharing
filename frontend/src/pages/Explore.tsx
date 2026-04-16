import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { Tweet } from '../types';

export const Explore: React.FC = () => {
  const [trendingPosts] = useState<Tweet[]>([
    {
      id: '1',
      author: 'Tech News Daily',
      content: 'New JavaScript framework released: it\'s faster and lighter than ever before! Check out the benchmarks.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '2',
      author: 'Dev Tips',
      content: 'Pro tip: Always use meaningful variable names. Your future self will thank you!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      author: 'Code Mentor',
      content: 'The best way to learn programming? Build projects. Build something meaningful today.',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      author: 'Web Development',
      content: 'CSS Grid vs Flexbox: A comprehensive comparison for 2024. Link in bio.',
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'design' | 'business'>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'tech', label: 'Technology' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
  ];

  return (
    <main className="w-full max-w-xl bg-white min-h-screen shadow-sm border-x border-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold mb-4">Explore</h1>

        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search posts..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="p-2 hover:bg-gray-100 rounded-full transition">🔍</button>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Trending Posts */}
      {trendingPosts.length > 0 ? (
        <div className="flex flex-col">
          {trendingPosts.map((post) => (
            <PostCard key={post.id} tweet={post} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">No trending posts found</div>
      )}
    </main>
  );
};
