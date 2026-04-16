import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { Tweet, TrendingTopic } from '../types';
import { api } from '../services/api';

export const Explore: React.FC = () => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [trendingPosts] = useState<Tweet[]>([
    {
      id: '1',
      author: 'Tech News Daily',
      content: 'New JavaScript framework released — faster and lighter than ever! Check out the benchmarks. #webdev #javascript',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '2',
      author: 'Dev Tips',
      content: 'Pro tip: Always use meaningful variable names. Your future self will thank you! #coding #bestpractices',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      author: 'Code Mentor',
      content: 'The best way to learn programming? Build projects. Build something meaningful today. #learntocode',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      author: 'Web Development',
      content: 'CSS Grid vs Flexbox: a comprehensive comparison for 2026. #css #webdev',
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'design' | 'business'>('all');

  useEffect(() => {
    api.getTrendingTopics().then(setTrendingTopics).catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'tech', label: 'Technology' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
  ];

  return (
    <main className="w-full bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Trending</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search posts…"
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-600 dark:text-gray-400">
            🔍
          </button>
        </div>
      </header>

      {/* Category filter */}
      <div className="sticky top-[73px] z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap font-semibold text-sm transition ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending hashtags */}
      {trendingTopics.length > 0 && (
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Trending Hashtags
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((t) => (
              <span
                key={t.topic}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold"
              >
                {t.topic}
                <span className="ml-1.5 text-indigo-400 dark:text-indigo-500 font-normal text-xs">
                  {t.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trending posts */}
      <div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Trending Posts</h2>
        </div>
        {trendingPosts.length > 0 ? (
          <div className="flex flex-col">
            {trendingPosts.map((post) => (
              <PostCard key={post.id} tweet={post} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No trending posts found
          </div>
        )}
      </div>
    </main>
  );
};
