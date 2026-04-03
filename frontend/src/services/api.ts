import { Tweet, CreateTweetRequest } from '../types';

const API_URL = 'http://localhost:8080/api';

export const api = {
  async getTimeline(): Promise<Tweet[]> {
    const response = await fetch(`${API_URL}/timeline`);
    if (!response.ok) throw new Error('Failed to fetch timeline');
    // If the database is empty, Go returns null for the slice. Default to empty array.
    const data = await response.json();
    return data || []; 
  },

  async postTweet(data: CreateTweetRequest): Promise<Tweet> {
    const response = await fetch(`${API_URL}/tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to post tweet');
    return response.json();
  }
};
