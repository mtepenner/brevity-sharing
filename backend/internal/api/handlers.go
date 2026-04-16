package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/mtepenner/brevity-sharing/internal/database"
	"github.com/mtepenner/brevity-sharing/internal/models"
	"github.com/mtepenner/brevity-sharing/internal/services" // ADDED
	"github.com/mtepenner/brevity-sharing/pkg/response"      // ADDED
)

type Server struct {
	DB              *database.InMemoryDB
	TimelineService *services.TimelineService // ADDED
	Users           map[string]*models.User   // In-memory user storage
	UserPasswords   map[string]string         // In-memory password storage (demo only)
	FriendRequests  map[string]*models.FriendRequest
	Locations       map[string]*models.Location
}

// HandleLogin authenticates a user
func (s *Server) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Demo: Check credentials (in production, use proper authentication)
	if req.Username == "demo" && req.Password == "demo" {
		user := &models.User{
			ID:       "demo-user-123",
			Username: "demo",
			Email:    "demo@brevity.io",
		}

		authResp := models.AuthResponse{
			User:  *user,
			Token: "demo-token-jwt-12345", // In production, generate a real JWT
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(authResp)
		return
	}

	// Check if user exists in our in-memory store
	if user, ok := s.Users[req.Username]; ok {
		if password, ok := s.UserPasswords[req.Username]; ok && password == req.Password {
			authResp := models.AuthResponse{
				User:  *user,
				Token: generateToken(req.Username),
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(authResp)
			return
		}
	}

	http.Error(w, "Invalid credentials", http.StatusUnauthorized)
}

// HandleSignup creates a new user account
func (s *Server) HandleSignup(w http.ResponseWriter, r *http.Request) {
	var req models.SignupRequest
	
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		http.Error(w, "Username, email, and password are required", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	if _, ok := s.Users[req.Username]; ok {
		http.Error(w, "Username already taken", http.StatusConflict)
		return
	}

	// Create new user
	user := &models.User{
		ID:       generateID(),
		Username: req.Username,
		Email:    req.Email,
	}

	// Store user and password (in-memory, demo only)
	s.Users[req.Username] = user
	s.UserPasswords[req.Username] = req.Password

	authResp := models.AuthResponse{
		User:  *user,
		Token: generateToken(req.Username),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(authResp)
}

// HandlePostTweet processes incoming tweets
func (s *Server) HandlePostTweet(w http.ResponseWriter, r *http.Request) {
	var req models.CreateTweetRequest
	
	// Decode the JSON body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Basic validation
	if req.Content == "" || len(req.Content) > 280 {
		http.Error(w, "Content must be between 1 and 280 characters", http.StatusBadRequest)
		return
	}

	// Save to DB
	tweet, err := s.DB.Insert(req.Author, req.Content)
	if err != nil {
		http.Error(w, "Failed to create tweet", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tweet)
}

// Updated HandleGetTimeline using our new packages
func (s *Server) HandleGetTimeline(w http.ResponseWriter, r *http.Request) {
    // 1. Ask the service layer for the data
    tweets := s.TimelineService.GetHomeFeed()

    // 2. Use the pkg/response utility to send it back
    response.JSON(w, http.StatusOK, tweets)
}

// Helper functions
func generateID() string {
	return "user-" + strings.ToLower(randomString(8))
}

func generateToken(username string) string {
	return "token-" + username + "-" + randomString(16)
}

func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[i%len(charset)]
	}
	return string(result)
}

func EnableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from any origin (in production, specify your domain)
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "86400")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests (OPTIONS)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}
