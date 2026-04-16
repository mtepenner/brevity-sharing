package models

import "time"

// Tweet represents a single micro-blog post
type Tweet struct {
	ID        string    `json:"id"`
	Author    string    `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	TaggedUsers []string `json:"tagged_users,omitempty"`
	LocationPlace string `json:"location_place,omitempty"`
	Latitude  float64   `json:"latitude,omitempty"`
	Longitude float64   `json:"longitude,omitempty"`
}

// CreateTweetRequest is the expected payload from the frontend
type CreateTweetRequest struct {
	Author      string   `json:"author"`
	Content     string   `json:"content"`
	TaggedUsers []string `json:"tagged_users,omitempty"`
	LocationPlace string `json:"location_place,omitempty"`
	Latitude    float64  `json:"latitude,omitempty"`
	Longitude   float64  `json:"longitude,omitempty"`
}
