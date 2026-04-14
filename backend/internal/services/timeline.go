package services

import (
	"github.com/mtepenner/brevity-sharing/internal/database" 
	"github.com/mtepenner/brevity-sharing/internal/models"   
)


// TimelineService isolates the logic for building user feeds
type TimelineService struct {
	DB *database.InMemoryDB
}

func NewTimelineService(db *database.InMemoryDB) *TimelineService {
	return &TimelineService{DB: db}
}

// GetHomeFeed abstracts the complexity of fetching tweets.
// In the future, this is where you would implement caching lookups
// or fan-out read architecture before ever touching the main database.
func (s *TimelineService) GetHomeFeed() []models.Tweet {
	// For the MVP, it simply passes through to the DB
	return s.DB.GetTimeline()
}
