package models

import "time"

// Tweet represents a single micro-blog post
type Tweet struct {
	ID        string    `json:"id"`
	Author    string    `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateTweetRequest is the expected payload from the frontend
type CreateTweetRequest struct {
	Author  string `json:"author"`
	Content string `json:"content"`
}
