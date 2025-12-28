'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChat } from '@/hooks/useAIChat';
import ChatMessage from './ChatMessage';
import { Send } from 'lucide-react';

interface LiaChatWidgetProps {
  context?: {
    pageName?: string;
    weather?: any;
    selectedTour?: string;
  };
}

const quickActions = [
  "Show me fishing trips",
  "What's the weather?",
  "Help me plan a 3-day itinerary",
  "Tell me about Chris",
];

export default function LiaChatWidget({ context }: LiaChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage, loadMessages, clearMessages } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.message) {
        setInput(customEvent.detail.message);
      }
    };

    window.addEventListener('lia:open', handler);
    return () => window.removeEventListener('lia:open', handler);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message, context);
  };

  const handleQuickAction = async (action: string) => {
    setInput(action);
    await sendMessage(action, context);
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Collapsed Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-belize-turquoise hover:bg-belize-turquoise/90 text-white rounded-full px-6 py-4 shadow-2xl flex items-center gap-3 transition-all hover:scale-105"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <div className="text-left">
            <p className="font-semibold">Chat with Lia</p>
            <p className="text-xs opacity-90">Your adventure guide</p>
          </div>
          <div className="animate-pulse w-2 h-2 bg-white rounded-full" />
        </motion.button>
      )}

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-[500px] sm:bottom-24 sm:right-6 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌴</span>
                <div>
                  <h3 className="text-white font-bold text-lg">Chat with Lia</h3>
                  <p className="text-white/80 text-xs">Your adventure guide</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl transition-all"
                  aria-label="Minimize chat"
                >
                  −
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    clearMessages();
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl transition-all"
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
            </div>

            {messages.length > 3 && (
              <button
                onClick={scrollToTop}
                className="absolute top-20 right-4 bg-black/10 hover:bg-black/20 text-gray-900 rounded-full w-9 h-9 flex items-center justify-center transition"
                aria-label="Scroll to top"
              >
                ↑
              </button>
            )}

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Hi! I'm Lia, your adventure guide
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ask me about tours, weather, pricing, or help plan your perfect Belize adventure!
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    {quickActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="block w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-belize-turquoise flex items-center justify-center">
                    <span className="text-white text-sm">👋</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-belize-turquoise"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-belize-turquoise hover:bg-belize-turquoise/90 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

