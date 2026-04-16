package models

import "time"

// User represents a user in the system
type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Bio       string    `json:"bio,omitempty"`
	Avatar    string    `json:"avatar,omitempty"`
	Latitude  float64   `json:"latitude,omitempty"`
	Longitude float64   `json:"longitude,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

// LoginRequest is the payload for login
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// SignupRequest is the payload for signup
type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse is the response after successful login/signup
type AuthResponse struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

// FriendRequest represents a friend request between users
type FriendRequest struct {
	ID         string    `json:"id"`
	FromUserID string    `json:"from_user_id"`
	ToUserID   string    `json:"to_user_id"`
	Status     string    `json:"status"` // pending, accepted, rejected
	CreatedAt  time.Time `json:"created_at"`
}

// Location represents a user's shared location
type Location struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	Place     string    `json:"place,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
