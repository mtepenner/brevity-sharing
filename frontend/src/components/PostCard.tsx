import React, { useState } from 'react';
import { Tweet } from '../types';

interface PostCardProps {
  tweet: Tweet;
}

export const PostCard: React.FC<PostCardProps> = ({ tweet }) => {
  const [liked, setLiked] = useState(false);
  const formattedDate = new Date(tweet.created_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getAvatarGradient = (name: string) => {
    const hash = name.charCodeAt(0);
    const gradients = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-cyan-400 to-blue-600',
      'bg-gradient-to-br from-violet-400 to-purple-600',
    ];
    return gradients[hash % gradients.length];
  };

  return (
    <div className="tweet-container group">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full ${getAvatarGradient(tweet.author)} flex items-center justify-center text-white font-bold shrink-0 shadow-md`}>
          {tweet.author.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex flex-col w-full">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 hover:text-indigo-600 smooth-transition">{tweet.author}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
          
          {/* Content */}
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-3">{tweet.content}</p>
          
          {/* Action Buttons */}
          <div className="flex gap-8 text-gray-500 text-sm opacity-0 group-hover:opacity-100 smooth-transition">
            <button className="flex items-center gap-2 hover:text-blue-500 smooth-transition">
              <span>💬</span>
              <span className="text-xs">Reply</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 smooth-transition">
              <span>🔄</span>
              <span className="text-xs">Repost</span>
            </button>
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 smooth-transition ${
                liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span className="text-xs">Like</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 smooth-transition">
              <span>📤</span>
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
