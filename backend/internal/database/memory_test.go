package database_test

import (
	"github.com/mtepenner/brevity-sharing/internal/database"
	"sync"
	"testing"
)

func TestInMemoryDB_Insert(t *testing.T) {
	db := database.NewInMemoryDB()

	tweet, err := db.Insert("alice", "Hello world")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if tweet.Author != "alice" {
		t.Errorf("expected author alice, got %s", tweet.Author)
	}
	if tweet.Content != "Hello world" {
		t.Errorf("expected content 'Hello world', got %s", tweet.Content)
	}
}

func TestInMemoryDB_GetTimeline_Ordering(t *testing.T) {
	db := database.NewInMemoryDB()
	db.Insert("alice", "First post")
	db.Insert("bob", "Second post")

	timeline := db.GetTimeline()

	if len(timeline) != 2 {
		t.Fatalf("expected 2 tweets, got %d", len(timeline))
	}

	// Ensure reverse-chronological sorting (newest first)
	if timeline[0].Author != "bob" {
		t.Errorf("expected newest tweet first (bob), got %s", timeline[0].Author)
	}
}

func TestInMemoryDB_Concurrency(t *testing.T) {
	db := database.NewInMemoryDB()
	var wg sync.WaitGroup

	// Simulate 100 concurrent users posting at the exact same time
	numPosts := 100
	wg.Add(numPosts)
	for i := 0; i < numPosts; i++ {
		go func() {
			defer wg.Done()
			db.Insert("concurrent_user", "Load testing!")
		}()
	}

	wg.Wait()

	if len(db.GetTimeline()) != numPosts {
		t.Errorf("expected %d tweets after concurrent inserts, got %d", numPosts, len(db.GetTimeline()))
	}
}
