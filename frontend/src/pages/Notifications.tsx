import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';

interface Notification {
  id: string;
  type: 'like' | 'reply' | 'follow' | 'retweet';
  actor: { name: string; handle: string; avatar: string };
  message: string;
  timestamp: string;
  read: boolean;
  relatedPost?: string;
}

export const Notifications: React.FC = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      actor: { name: 'Sarah', handle: '@sarah_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      message: 'liked your post',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'reply',
      actor: { name: 'Mike', handle: '@mike_code', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      message: 'repliedto your post',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'follow',
      actor: { name: 'Emma', handle: '@emma_designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
      message: 'started following you',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: '4',
      type: 'retweet',
      actor: { name: 'Alex', handle: '@alex_tech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      message: 'retweeted your post',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'reply':
        return '💬';
      case 'follow':
        return '👤';
      case 'retweet':
        return '🔄';
      default:
        return '📢';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <main className="w-full bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
      </header>

      {/* Notifications list */}
      {notifications.length > 0 ? (
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={notification.actor.avatar}
                  alt={notification.actor.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {notification.actor.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{notification.actor.handle}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">No notifications yet</div>
      )}
    </main>
  );
};
