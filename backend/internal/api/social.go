package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/mtepenner/brevity-sharing/internal/models"
)

// HandleSearchUsers searches for users by username
func (s *Server) HandleSearchUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Search query required", http.StatusBadRequest)
		return
	}

	var results []models.User
	for _, user := range s.Users {
		if strings.Contains(strings.ToLower(user.Username), strings.ToLower(query)) {
			results = append(results, *user)
		}
	}

	if results == nil {
		results = []models.User{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// HandleSendFriendRequest sends a friend request from one user to another
func (s *Server) HandleSendFriendRequest(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ToUserID string `json:"to_user_id"`
		FromUserID string `json:"from_user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.ToUserID == "" || req.FromUserID == "" {
		http.Error(w, "Both user IDs required", http.StatusBadRequest)
		return
	}

	// Check users exist
	if _, ok := s.Users[req.ToUserID]; !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Create friend request
	fr := &models.FriendRequest{
		ID:         generateID(),
		FromUserID: req.FromUserID,
		ToUserID:   req.ToUserID,
		Status:     "pending",
		CreatedAt:  time.Now(),
	}

	s.FriendRequests[fr.ID] = fr

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(fr)
}

// HandleGetFriendRequests gets pending friend requests for a user
func (s *Server) HandleGetFriendRequests(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	var requests []models.FriendRequest
	for _, fr := range s.FriendRequests {
		if (fr.ToUserID == userID || fr.FromUserID == userID) && fr.Status == "pending" {
			requests = append(requests, *fr)
		}
	}

	if requests == nil {
		requests = []models.FriendRequest{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(requests)
}

// HandleAcceptFriendRequest accepts a friend request
func (s *Server) HandleAcceptFriendRequest(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FriendRequestID string `json:"friend_request_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	fr, ok := s.FriendRequests[req.FriendRequestID]
	if !ok {
		http.Error(w, "Friend request not found", http.StatusNotFound)
		return
	}

	fr.Status = "accepted"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fr)
}

// HandleGetUserFriends gets all friends for a user
func (s *Server) HandleGetUserFriends(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	var friends []models.User
	for _, fr := range s.FriendRequests {
		if fr.Status == "accepted" {
			if fr.FromUserID == userID {
				if user, ok := s.Users[fr.ToUserID]; ok {
					friends = append(friends, *user)
				}
			} else if fr.ToUserID == userID {
				if user, ok := s.Users[fr.FromUserID]; ok {
					friends = append(friends, *user)
				}
			}
		}
	}

	if friends == nil {
		friends = []models.User{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(friends)
}

// HandleShareLocation shares a user's location
func (s *Server) HandleShareLocation(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID    string  `json:"user_id"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
		Place     string  `json:"place"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Update user's location
	if user, ok := s.Users[req.UserID]; ok {
		user.Latitude = req.Latitude
		user.Longitude = req.Longitude
		s.Users[req.UserID] = user
	}

	// Create location record
	loc := &models.Location{
		ID:        generateID(),
		UserID:    req.UserID,
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Place:     req.Place,
		CreatedAt: time.Now(),
	}

	s.Locations[loc.ID] = loc

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(loc)
}

// HandleGetNearbyUsers gets users near a certain location
func (s *Server) HandleGetNearbyUsers(w http.ResponseWriter, r *http.Request) {
	latStr := r.URL.Query().Get("latitude")
	lonStr := r.URL.Query().Get("longitude")

	if latStr == "" || lonStr == "" {
		http.Error(w, "Latitude and longitude required", http.StatusBadRequest)
		return
	}

	// For now, return all users with locations
	// In production, calculate actual distance using haversine formula
	var nearbyUsers []models.User
	for _, user := range s.Users {
		if user.Latitude != 0 && user.Longitude != 0 {
			nearbyUsers = append(nearbyUsers, *user)
		}
	}

	if nearbyUsers == nil {
		nearbyUsers = []models.User{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(nearbyUsers)
}
