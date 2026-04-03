export interface Tweet {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface CreateTweetRequest {
  author: string;
  content: string;
}
