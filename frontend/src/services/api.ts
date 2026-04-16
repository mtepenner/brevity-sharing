import { Tweet, CreateTweetRequest, LoginRequest, SignupRequest, AuthResponse, User, FriendRequest, Location, Message, Conversation, TrendingTopic } from '../types';

// Use relative path so nginx can proxy it to the backend
const API_URL = '/api';

console.log('API URL:', API_URL);

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

export const api = {
  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Logging in with username:', data.username);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', response.status, errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      localStorage.setItem('auth_token', result.token);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      console.log('Signing up with username:', data.username);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Signup failed:', response.status, errorText);
        throw new Error(`Signup failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      localStorage.setItem('auth_token', result.token);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  // Tweet endpoints
  async getTimeline(): Promise<Tweet[]> {
    try {
      const response = await fetch(`${API_URL}/timeline`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch timeline');
      const data = await response.json();
      return data || []; 
    } catch (error) {
      console.error('Get timeline error:', error);
      throw error;
    }
  },

  async postTweet(data: CreateTweetRequest): Promise<Tweet> {
    try {
      const response = await fetch(`${API_URL}/tweets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to post tweet');
      return response.json();
    } catch (error) {
      console.error('Post tweet error:', error);
      throw error;
    }
  },

  // User search
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Friend request endpoints
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequest> {
    try {
      const response = await fetch(`${API_URL}/friends/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ from_user_id: fromUserId, to_user_id: toUserId }),
      });
      if (!response.ok) throw new Error('Failed to send friend request');
      return response.json();
    } catch (error) {
      console.error('Send friend request error:', error);
      throw error;
    }
  },

  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    try {
      const response = await fetch(`${API_URL}/friends/requests?user_id=${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch friend requests');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get friend requests error:', error);
      throw error;
    }
  },

  async acceptFriendRequest(friendRequestId: string): Promise<FriendRequest> {
    try {
      const response = await fetch(`${API_URL}/friends/requests/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ friend_request_id: friendRequestId }),
      });
      if (!response.ok) throw new Error('Failed to accept friend request');
      return response.json();
    } catch (error) {
      console.error('Accept friend request error:', error);
      throw error;
    }
  },

  async getUserFriends(userId: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users/friends?user_id=${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get friends error:', error);
      throw error;
    }
  },

  // Location endpoints
  async shareLocation(userId: string, latitude: number, longitude: number, place: string): Promise<Location> {
    try {
      const response = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ user_id: userId, latitude, longitude, place }),
      });
      if (!response.ok) throw new Error('Failed to share location');
      return response.json();
    } catch (error) {
      console.error('Share location error:', error);
      throw error;
    }
  },

  async getNearbyUsers(latitude: number, longitude: number, radius?: number): Promise<User[]> {
    try {
      const url = new URL(`${window.location.origin}${API_URL}/locations/nearby`);
      url.searchParams.append('latitude', latitude.toString());
      url.searchParams.append('longitude', longitude.toString());
      if (radius) url.searchParams.append('radius', radius.toString());
      
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch nearby users');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get nearby users error:', error);
      throw error;
    }
  },

  // Message endpoints
  async sendMessage(senderId: string, recipientId: string, content: string): Promise<Message> {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ sender_id: senderId, recipient_id: recipientId, content }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`${API_URL}/messages/conversations?user_id=${encodeURIComponent(userId)}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get conversations error:', error);
      return [];
    }
  },

  async getConversation(user1: string, user2: string): Promise<Message[]> {
    try {
      const response = await fetch(
        `${API_URL}/messages/conversation?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`,
        { headers: getAuthHeaders() },
      );
      if (!response.ok) throw new Error('Failed to fetch conversation');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get conversation error:', error);
      return [];
    }
  },

  // Trending topics
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    try {
      const response = await fetch(`${API_URL}/trending`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get trending error:', error);
      return [];
    }
  },
};
