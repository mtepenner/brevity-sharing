import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface SearchUsersProps {
  currentUserId: string;
  onClose: () => void;
}

export const SearchUsers: React.FC<SearchUsersProps> = ({ currentUserId, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const users = await api.searchUsers(value);
      // Filter out current user
      setResults(users.filter(u => u.id !== currentUserId));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (toUserId: string) => {
    try {
      await api.sendFriendRequest(currentUserId, toUserId);
      setSentRequests(new Set([...sentRequests, toUserId]));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔍 Find Friends</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        {loading && (
          <div className="text-center py-8 text-gray-500">
            Searching...
          </div>
        )}

        {!loading && results.length === 0 && query.length >= 2 && (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        )}

        <div className="space-y-3">
          {results.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => handleSendFriendRequest(user.id)}
                disabled={sentRequests.has(user.id)}
                className={`ml-2 px-4 py-2 rounded-lg font-semibold transition ${
                  sentRequests.has(user.id)
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                }`}
              >
                {sentRequests.has(user.id) ? '✓ Sent' : '+ Add'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
