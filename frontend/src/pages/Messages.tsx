import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { User, Message, Conversation } from '../types';

interface MessagesProps {
  user: User;
}

export const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await api.getConversations(user.id);
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    try {
      const data = await api.getConversation(user.id, conv.partner_id);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    try {
      const msg = await api.sendMessage(user.id, selectedConv.partner_id, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
      loadConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await api.searchUsers(query);
      setSearchResults(results.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const startNewConversation = (partner: User) => {
    setSelectedConv({ partner_id: partner.id, partner_username: partner.username, unread_count: 0 });
    setMessages([]);
    setShowNewMsg(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <main className="w-full bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedConv && (
            <button
              onClick={() => setSelectedConv(null)}
              className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
              aria-label="Back"
            >
              ←
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {selectedConv ? `@${selectedConv.partner_username}` : 'Messages'}
          </h1>
        </div>
        {!selectedConv && (
          <button
            onClick={() => setShowNewMsg(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition"
          >
            ✏️ New
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden" /* minHeight calc handled by flex */>
        {/* Conversation list */}
        <div
          className={`${
            selectedConv ? 'hidden sm:flex' : 'flex'
          } flex-col w-full sm:w-72 border-r border-gray-200 dark:border-gray-700 overflow-y-auto`}
        >
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">✉️</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No messages yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start a conversation!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.partner_id}
                onClick={() => openConversation(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                  selectedConv?.partner_id === conv.partner_id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold shrink-0">
                  {conv.partner_username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      @{conv.partner_username}
                    </span>
                    {conv.last_message && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-1">
                        {formatTime(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  {conv.last_message && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {conv.last_message.sender_id === user.id ? 'You: ' : ''}
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Message thread */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">👋</div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Start a conversation with @{selectedConv.partner_username}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender_id === user.id
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === user.id
                            ? 'text-indigo-200'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Compose input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message…"
                  maxLength={1000}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-semibold text-sm transition"
                >
                  {sending ? '…' : '➤'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <div className="text-5xl mb-3">✉️</div>
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm mt-1">or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* New message modal */}
      {showNewMsg && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowNewMsg(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMsg(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users…"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                autoFocus
              />
              <div className="mt-3 max-h-60 overflow-y-auto space-y-1">
                {searchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => startNewConversation(u)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {u.username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      @{u.username}
                    </span>
                  </button>
                ))}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    No users found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
