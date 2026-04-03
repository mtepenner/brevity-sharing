package main

import (
	"log"
	"net/http"

	"https://github.com/mtepenner/brevity-sharing/internal/api"
	"https://github.com/mtepenner/brevity-sharing/internal/database"
)

func main() {
	// Initialize our thread-safe in-memory database
	db := database.NewInMemoryDB()

	// Initialize our API server with the DB dependency injected
	srv := &api.Server{
		DB: db,
	}

	// Define our routes (Requires Go 1.22+ for method-based routing)
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/tweets", srv.HandlePostTweet)
	mux.HandleFunc("GET /api/timeline", srv.HandleGetTimeline)

	// Start the server
	port := ":8080"
	log.Printf("Backend server starting on port %s...\n", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
