package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/mtepenner/brevity-sharing/internal/api"
	"github.com/mtepenner/brevity-sharing/internal/database"
	"github.com/mtepenner/brevity-sharing/internal/models"
)

func TestHandlePostTweet_Success(t *testing.T) {
	db := database.NewInMemoryDB()
	srv := &api.Server{DB: db}

	reqBody := models.CreateTweetRequest{Author: "test_user", Content: "This is a test tweet"}
	bodyBytes, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", "/api/tweets", bytes.NewBuffer(bodyBytes))
	rr := httptest.NewRecorder()

	srv.HandlePostTweet(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	// Verify it was actually inserted into the mock DB
	if len(db.GetTimeline()) != 1 {
		t.Errorf("expected 1 tweet in db, got %d", len(db.GetTimeline()))
	}
}

func TestHandlePostTweet_ValidationError(t *testing.T) {
	db := database.NewInMemoryDB()
	srv := &api.Server{DB: db}

	// Test empty content
	reqBody := models.CreateTweetRequest{Author: "test_user", Content: ""}
	bodyBytes, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", "/api/tweets", bytes.NewBuffer(bodyBytes))
	rr := httptest.NewRecorder()

	srv.HandlePostTweet(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code for empty content: got %v want %v", status, http.StatusBadRequest)
	}
}
