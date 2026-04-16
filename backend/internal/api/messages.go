package api

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/mtepenner/brevity-sharing/internal/models"
)

// userByID looks up a user by their ID across the username-keyed Users map.
func (s *Server) userByID(id string) *models.User {
	for _, u := range s.Users {
		if u.ID == id {
			return u
		}
	}
	return nil
}

// HandleSendMessage sends a private message from one user to another.
func (s *Server) HandleSendMessage(w http.ResponseWriter, r *http.Request) {
	var req struct {
		SenderID    string `json:"sender_id"`
		RecipientID string `json:"recipient_id"`
		Content     string `json:"content"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.SenderID == "" || req.RecipientID == "" || req.Content == "" {
		http.Error(w, "sender_id, recipient_id, and content are required", http.StatusBadRequest)
		return
	}

	if len(req.Content) > 1000 {
		http.Error(w, "Message too long (max 1000 characters)", http.StatusBadRequest)
		return
	}

	if req.SenderID == req.RecipientID {
		http.Error(w, "Cannot send a message to yourself", http.StatusBadRequest)
		return
	}

	msg := &models.Message{
		ID:          generateID(),
		SenderID:    req.SenderID,
		RecipientID: req.RecipientID,
		Content:     req.Content,
		CreatedAt:   time.Now(),
	}

	s.Messages[msg.ID] = msg

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(msg)
}

// Conversation summarises the last message and unread count for a conversation partner.
type Conversation struct {
	PartnerID       string          `json:"partner_id"`
	PartnerUsername string          `json:"partner_username"`
	LastMessage     *models.Message `json:"last_message"`
	UnreadCount     int             `json:"unread_count"`
}

// HandleGetConversations returns a list of conversations for a given user.
func (s *Server) HandleGetConversations(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "user_id required", http.StatusBadRequest)
		return
	}

	convMap := make(map[string]*Conversation)

	for _, msg := range s.Messages {
		if msg.SenderID != userID && msg.RecipientID != userID {
			continue
		}

		partnerID := msg.RecipientID
		if msg.RecipientID == userID {
			partnerID = msg.SenderID
		}

		conv, exists := convMap[partnerID]
		if !exists {
			partnerUsername := partnerID
			if partner := s.userByID(partnerID); partner != nil {
				partnerUsername = partner.Username
			}
			conv = &Conversation{
				PartnerID:       partnerID,
				PartnerUsername: partnerUsername,
			}
			convMap[partnerID] = conv
		}

		if conv.LastMessage == nil || msg.CreatedAt.After(conv.LastMessage.CreatedAt) {
			msgCopy := *msg
			conv.LastMessage = &msgCopy
		}

		if msg.RecipientID == userID && msg.ReadAt == nil {
			conv.UnreadCount++
		}
	}

	conversations := make([]*Conversation, 0, len(convMap))
	for _, conv := range convMap {
		conversations = append(conversations, conv)
	}

	sort.Slice(conversations, func(i, j int) bool {
		if conversations[i].LastMessage == nil {
			return false
		}
		if conversations[j].LastMessage == nil {
			return true
		}
		return conversations[i].LastMessage.CreatedAt.After(conversations[j].LastMessage.CreatedAt)
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(conversations)
}

// HandleGetConversation returns all messages exchanged between two users.
func (s *Server) HandleGetConversation(w http.ResponseWriter, r *http.Request) {
	user1 := r.URL.Query().Get("user1")
	user2 := r.URL.Query().Get("user2")

	if user1 == "" || user2 == "" {
		http.Error(w, "user1 and user2 required", http.StatusBadRequest)
		return
	}

	messages := make([]models.Message, 0)
	for _, msg := range s.Messages {
		if (msg.SenderID == user1 && msg.RecipientID == user2) ||
			(msg.SenderID == user2 && msg.RecipientID == user1) {
			messages = append(messages, *msg)
		}
	}

	sort.Slice(messages, func(i, j int) bool {
		return messages[i].CreatedAt.Before(messages[j].CreatedAt)
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}

// HandleGetTrending returns the top trending hashtags extracted from stored tweets.
func (s *Server) HandleGetTrending(w http.ResponseWriter, r *http.Request) {
	tweets := s.DB.GetTimeline()

	topicCounts := make(map[string]int)
	for _, tweet := range tweets {
		for _, word := range strings.Fields(tweet.Content) {
			word = strings.Trim(word, ".,!?\"';:()")
			if strings.HasPrefix(word, "#") && len(word) > 1 {
				topicCounts[strings.ToLower(word)]++
			}
		}
	}

	type TrendingTopic struct {
		Topic string `json:"topic"`
		Count int    `json:"count"`
	}

	topics := make([]TrendingTopic, 0, len(topicCounts))
	for topic, count := range topicCounts {
		topics = append(topics, TrendingTopic{Topic: topic, Count: count})
	}

	sort.Slice(topics, func(i, j int) bool {
		return topics[i].Count > topics[j].Count
	})

	if len(topics) > 10 {
		topics = topics[:10]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topics)
}
