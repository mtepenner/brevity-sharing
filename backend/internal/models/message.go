package models

import "time"

// Message represents a private message between two users
type Message struct {
	ID          string     `json:"id"`
	SenderID    string     `json:"sender_id"`
	RecipientID string     `json:"recipient_id"`
	Content     string     `json:"content"`
	CreatedAt   time.Time  `json:"created_at"`
	ReadAt      *time.Time `json:"read_at,omitempty"`
}
