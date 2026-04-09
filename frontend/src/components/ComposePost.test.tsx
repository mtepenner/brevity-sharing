import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComposePost } from './ComposePost';
import { api } from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  api: {
    postTweet: vi.fn(),
  },
}));

describe('ComposePost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables the post button when input is empty', () => {
    render(<ComposePost onPostCreated={vi.fn()} />);
    const button = screen.getByRole('button', { name: /Post/i });
    expect(button).toBeDisabled();
  });

  it('submits a tweet, clears the input, and calls onPostCreated', async () => {
    const mockOnPostCreated = vi.fn();
    (api.postTweet as any).mockResolvedValueOnce({ id: '1', author: 'matthew', content: 'Testing' });

    render(<ComposePost onPostCreated={mockOnPostCreated} />);
    
    const input = screen.getByPlaceholderText("What's happening?");
    const button = screen.getByRole('button', { name: /Post/i });

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello world!' } });
    expect(button).not.toBeDisabled();
    
    // Submit
    fireEvent.click(button);
    
    // Assert button state changes to 'Posting...'
    expect(screen.getByText('Posting...')).toBeInTheDocument();

    await waitFor(() => {
      // Assert API was called with right params
      expect(api.postTweet).toHaveBeenCalledWith({ author: 'matthew', content: 'Hello world!' });
      
      // Assert the parent was notified to refresh the timeline
      expect(mockOnPostCreated).toHaveBeenCalled();
      
      // Assert the text area was cleared
      expect((input as HTMLTextAreaElement).value).toBe('');
    });
  });
});
