import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, FriendRequest } from '../types';

interface FriendRequestsProps {
  userId: string;
  onClose: () => void;
}

export const FriendRequests: React.FC<FriendRequestsProps> = ({ userId, onClose }) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [userId]);

  const loadRequests = async () => {
    try {
      const data = await api.getFriendRequests(userId);
      setRequests(data);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await api.acceptFriendRequest(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const incomingRequests = requests.filter(r => r.to_user_id === userId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">👋 Friend Requests</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : incomingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending friend requests
          </div>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{request.from_user_id}</p>
                  <p className="text-xs text-gray-600">wants to be your friend</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
