package database

import (
	"crypto/rand"
	"encoding/hex"
	"sort"
	"sync"
	"time"

	"github.com/mtepenner/brevity-sharing/internal/models" // FIXED
)

// InMemoryDB simulates a database connection
type InMemoryDB struct {
	mu     sync.RWMutex
	tweets []models.Tweet
}

func NewInMemoryDB() *InMemoryDB {
	return &InMemoryDB{
		tweets: make([]models.Tweet, 0),
	}
}

// Insert adds a new tweet to the database safely
func (db *InMemoryDB) Insert(author, content string) (models.Tweet, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	// Generate a simple mock ID
	bytes := make([]byte, 4)
	rand.Read(bytes)

	newTweet := models.Tweet{
		ID:        hex.EncodeToString(bytes),
		Author:    author,
		Content:   content,
		CreatedAt: time.Now(),
	}

	db.tweets = append(db.tweets, newTweet)
	return newTweet, nil
}

// GetTimeline fetches all tweets sorted by newest first
func (db *InMemoryDB) GetTimeline() []models.Tweet {
	db.mu.RLock()
	defer db.mu.RUnlock()

	// Create a copy to avoid mutating the original slice during read
	timeline := make([]models.Tweet, len(db.tweets))
	copy(timeline, db.tweets)

	// Sort reverse chronologically
	sort.Slice(timeline, func(i, j int) bool {
		return timeline[i].CreatedAt.After(timeline[j].CreatedAt)
	})

	return timeline
}
