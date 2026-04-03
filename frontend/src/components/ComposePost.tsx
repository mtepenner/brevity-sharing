import React, { useState } from 'react';
import { api } from '../services/api';

interface ComposePostProps {
  onPostCreated: () => void;
}

export const ComposePost: React.FC<ComposePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await api.postTweet({
        author: 'matthew', // Hardcoded for MVP until auth is added
        content: content.trim()
      });
      setContent('');
      onPostCreated(); // Tell the parent to refresh the timeline
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          className="w-full resize-none outline-none text-lg placeholder-gray-500"
          placeholder="What's happening?"
          rows={3}
          maxLength={280}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {content.length}/280
          </span>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};
