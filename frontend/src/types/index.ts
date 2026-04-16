export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface Tweet {
  id: string;
  author: string;
  content: string;
  created_at: string;
  tagged_users?: string[];
  location_place?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateTweetRequest {
  author: string;
  content: string;
  tagged_users?: string[];
  location_place?: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  place?: string;
  created_at: string;
}
