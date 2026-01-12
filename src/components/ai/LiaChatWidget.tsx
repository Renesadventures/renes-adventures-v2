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
          className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-tropical-coral hover:bg-tropical-orange text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <span className="text-xl" aria-hidden>
            👋
          </span>
          <span className="sr-only">Chat with Lia</span>
        </motion.button>
      )}

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-4 z-50 w-full max-w-sm h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="relative bg-gradient-to-r from-tropical-coral to-tropical-turquoise p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌴</span>
                <div>
                  <h3 className="text-white font-semibold text-base">Chat with Lia</h3>
                  <p className="text-white/80 text-xs">Your adventure guide</p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-all"
                  aria-label="Minimize chat"
                >
                  −
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    clearMessages();
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-all"
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
            </div>

            {messages.length > 3 && (
              <button
                onClick={scrollToTop}
                className="absolute top-16 right-3 bg-gray-900/10 hover:bg-gray-900/20 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition text-sm"
                aria-label="Scroll to top"
              >
                ↑
              </button>
            )}

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-4 text-sm leading-relaxed bg-white">
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
                        className="block w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700 border border-gray-200"
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
                  <div className="w-8 h-8 rounded-full bg-tropical-turquoise flex items-center justify-center">
                    <span className="text-white text-sm">👋</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
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
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-tropical-turquoise placeholder:text-gray-400 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-tropical-coral hover:bg-tropical-orange text-white rounded-lg w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

