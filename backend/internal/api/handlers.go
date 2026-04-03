package api

import (
	"encoding/json"
	"net/http"

	"github.com/mtepenner/brevity-sharing/internal/database"
	"github.com/mtepenner/brevity-sharing/internal/models"
)

type Server struct {
	DB *database.InMemoryDB
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

// HandleGetTimeline returns the reverse-chronological feed
func (s *Server) HandleGetTimeline(w http.ResponseWriter, r *http.Request) {
	tweets := s.DB.GetTimeline()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tweets)
}
