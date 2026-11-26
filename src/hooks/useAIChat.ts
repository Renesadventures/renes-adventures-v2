'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/** One id per browser, so Rene's Desk can follow this conversation live. */
function chatId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    let id = localStorage.getItem('lia-chat-id');
    if (!id) {
      id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '');
      localStorage.setItem('lia-chat-id', id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastActivity = useRef<number>(0);
  const since = useRef<string>(
    typeof window !== 'undefined' ? (() => { try { return localStorage.getItem('lia-human-since') || ''; } catch { return ''; } })() : '',
  );
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
            chatId: chatId(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        lastActivity.current = Date.now();
        if (data.human || !data.message) {
          // A person from Rene's team is answering; their reply arrives by polling.
          saveMessages(newMessages);
          return;
        }
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

  // While a conversation is active, check every 5 s for replies typed by a
  // person on Rene's Desk. Stops 30 minutes after the guest's last message.
  useEffect(() => {
    if (!messages.length) return;
    if (!lastActivity.current) lastActivity.current = Date.now();
    const timer = setInterval(async () => {
      if (Date.now() - lastActivity.current > 30 * 60 * 1000) return;
      const id = chatId();
      if (!id) return;
      try {
        const r = await fetch(`/api/ai/concierge/updates?chatId=${encodeURIComponent(id)}&since=${encodeURIComponent(since.current)}`, { cache: 'no-store' });
        if (!r.ok) return;
        const data = (await r.json()) as { messages?: { t: string; from: string; text: string }[] };
        const fresh = (data.messages || []).filter((m) => m.t > since.current);
        if (!fresh.length) return;
        since.current = fresh[fresh.length - 1].t;
        try { localStorage.setItem('lia-human-since', since.current); } catch {}
        setMessages((prev) => {
          const next = [
            ...prev,
            ...fresh.map((m, i) => ({
              id: `h-${m.t}-${i}`,
              role: 'assistant' as const,
              content: `${m.from} (Rene's team): ${m.text}`,
              timestamp: new Date(),
            })),
          ];
          saveMessages(next);
          return next;
        });
      } catch {
        // offline or server busy — try again next tick
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [messages.length, saveMessages]);

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

