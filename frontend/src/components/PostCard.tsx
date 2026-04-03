import React from 'react';
import { Tweet } from '../types';

interface PostCardProps {
  tweet: Tweet;
}

export const PostCard: React.FC<PostCardProps> = ({ tweet }) => {
  const formattedDate = new Date(tweet.created_at).toLocaleString();

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-3">
        {/* Mock Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
          {tweet.author.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex flex-col w-full">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">{tweet.author}</span>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-gray-800 mt-1 whitespace-pre-wrap">{tweet.content}</p>
        </div>
      </div>
    </div>
  );
};
