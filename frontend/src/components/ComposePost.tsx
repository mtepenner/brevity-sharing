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

  const charPercentage = (content.length / 280) * 100;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
            M
          </div>
          
          {/* Compose Area */}
          <div className="flex-1">
            <textarea
              className="w-full resize-none outline-none text-lg placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              placeholder="What's happening?!"
              rows={3}
              maxLength={280}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Character Counter and Button */}
        <div className="flex justify-between items-center px-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-200 ${
                  charPercentage > 90 ? 'bg-red-500' :
                  charPercentage > 70 ? 'bg-yellow-500' :
                  'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                // eslint-disable-next-line react/forbid-dom-props
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${
              charPercentage > 90 ? 'text-red-500' :
              charPercentage > 70 ? 'text-yellow-500' :
              'text-gray-500'
            }`}>
              {content.length}/280
            </span>
          </div>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg smooth-transition"
          >
            {isSubmitting ? '✨ Posting...' : '✨ Post'}
          </button>
        </div>
      </form>
    </div>
  );
};
