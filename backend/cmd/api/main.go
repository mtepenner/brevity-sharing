package main

import (
	"log"
	"net/http"

	"github.com/mtepenner/brevity-sharing/internal/api"      // FIXED
	"github.com/mtepenner/brevity-sharing/internal/database" // FIXED
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
	}

	// Define our routes (Requires Go 1.22+ for method-based routing)
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/tweets", api.EnableCORS(srv.HandlePostTweet))
	mux.HandleFunc("GET /api/timeline", api.EnableCORS(srv.HandleGetTimeline))

	// Start the server
	port := ":8080"
	log.Printf("Backend server starting on port %s...\n", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
