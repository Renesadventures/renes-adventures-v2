'use client';

import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages from localStorage on mount
  const loadMessages = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lia-chat-history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setMessages(
            parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        } catch (e) {
          console.error('Failed to load chat history:', e);
        }
      }
    }
  }, []);

  // Save messages to localStorage
  const saveMessages = useCallback((newMessages: ChatMessage[]) => {
    if (typeof window !== 'undefined') {
      // Keep only last 10 messages
      const toSave = newMessages.slice(-10);
      localStorage.setItem('lia-chat-history', JSON.stringify(toSave));
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, context?: { pageName?: string; weather?: any; selectedTour?: string }) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/concierge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };

        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        console.error('AI chat error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, saveMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lia-chat-history');
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    loadMessages,
  };
}

