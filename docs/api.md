# API Documentation

Base URL: `http://localhost:8080/api`

### 1. Get Timeline
Retrieves the reverse-chronological feed of the most recent posts.
* **Method:** `GET`
* **Endpoint:** `/timeline`
* **Response (200 OK):**
  ```json
  [
    {
      "id": "a1b2c3d4",
      "author": "matthew",
      "content": "Just setting up my twttr clone",
      "created_at": "2026-04-03T09:29:35Z"
    }
  ]
