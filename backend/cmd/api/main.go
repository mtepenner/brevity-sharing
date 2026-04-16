package main

import (
	"log"
	"net/http"

	"github.com/mtepenner/brevity-sharing/internal/api"      // FIXED
	"github.com/mtepenner/brevity-sharing/internal/database" // FIXED
	"github.com/mtepenner/brevity-sharing/internal/models"   // ADDED
	"github.com/mtepenner/brevity-sharing/internal/services" // ADDED
)

func main() {
	// Initialize our thread-safe in-memory database
	db := database.NewInMemoryDB()

	// Initialize the timeline service
	timelineService := services.NewTimelineService(db) // ADDED

	// Initialize our API server with the DB and Service dependencies injected
	srv := &api.Server{
		DB:              db,
		TimelineService: timelineService, // ADDED
		Users:           make(map[string]*models.User),
		UserPasswords:   make(map[string]string),
		FriendRequests:  make(map[string]*models.FriendRequest),
		Locations:       make(map[string]*models.Location),
		Messages:        make(map[string]*models.Message),
	}

	// Define our routes (Requires Go 1.22+ for method-based routing)
	mux := http.NewServeMux()
	
	// Auth routes
	mux.HandleFunc("POST /api/auth/login", api.EnableCORS(srv.HandleLogin))
	mux.HandleFunc("POST /api/auth/signup", api.EnableCORS(srv.HandleSignup))
	
	// Tweet routes
	mux.HandleFunc("POST /api/tweets", api.EnableCORS(srv.HandlePostTweet))
	mux.HandleFunc("GET /api/timeline", api.EnableCORS(srv.HandleGetTimeline))
	
	// Social/Friend routes
	mux.HandleFunc("GET /api/users/search", api.EnableCORS(srv.HandleSearchUsers))
	mux.HandleFunc("POST /api/friends/requests", api.EnableCORS(srv.HandleSendFriendRequest))
	mux.HandleFunc("GET /api/friends/requests", api.EnableCORS(srv.HandleGetFriendRequests))
	mux.HandleFunc("POST /api/friends/requests/accept", api.EnableCORS(srv.HandleAcceptFriendRequest))
	mux.HandleFunc("GET /api/users/friends", api.EnableCORS(srv.HandleGetUserFriends))
	
	// Location routes
	mux.HandleFunc("POST /api/locations", api.EnableCORS(srv.HandleShareLocation))
	mux.HandleFunc("GET /api/locations/nearby", api.EnableCORS(srv.HandleGetNearbyUsers))

	// Message routes
	mux.HandleFunc("POST /api/messages", api.EnableCORS(srv.HandleSendMessage))
	mux.HandleFunc("GET /api/messages/conversations", api.EnableCORS(srv.HandleGetConversations))
	mux.HandleFunc("GET /api/messages/conversation", api.EnableCORS(srv.HandleGetConversation))

	// Trending route
	mux.HandleFunc("GET /api/trending", api.EnableCORS(srv.HandleGetTrending))

	// Start the server
	port := ":8080"
	log.Printf("Backend server starting on port %s...\n", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
