import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface FriendsListProps {
  userId: string;
  onClose: () => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({ userId, onClose }) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    try {
      const data = await api.getUserFriends(userId);
      setFriends(data);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">👥 My Friends</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No friends yet. Search and add some!
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:shadow-md transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{friend.username}</p>
                    <p className="text-xs text-gray-600">{friend.email}</p>
                  </div>
                </div>
                {friend.latitude && friend.longitude && (
                  <span className="text-lg" title="Sharing location">📍</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
