'use client';

import { motion } from 'framer-motion';
import type { ChatMessage as ChatMessageType } from '@/hooks/useAIChat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-tropical-turquoise flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">👋</span>
        </div>
      )}
      
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-tropical-coral to-tropical-orange text-white shadow-lg'
            : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border border-white/20 shadow-lg shadow-cyan-500/15'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👋</span>
            <span className="font-semibold text-white/90">Lia</span>
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-white/70'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 text-sm">👤</span>
        </div>
      )}
    </motion.div>
  );
}

