import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimeline } from './useTimeline';
import { api } from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  api: {
    getTimeline: vi.fn(),
  },
}));

describe('useTimeline Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and sets timeline data on mount', async () => {
    const mockTweets = [
      { id: '1', author: 'alice', content: 'test post', created_at: new Date().toISOString() }
    ];
    (api.getTimeline as any).mockResolvedValueOnce(mockTweets);

    const { result } = renderHook(() => useTimeline());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.tweets).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tweets).toEqual(mockTweets);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles API errors gracefully', async () => {
    (api.getTimeline as any).mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useTimeline());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tweets).toEqual([]);
      expect(result.current.error).toContain('Failed to load timeline');
    });
  });
});
