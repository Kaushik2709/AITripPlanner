import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { TripChat } from '@/types/trip';
import { motion } from 'framer-motion';
import { Compass, User, Send } from 'lucide-react';
import { useState } from 'react';

interface ChatViewProps {
  chat: TripChat;
  isLoading: boolean;
  onSendFollowUp?: (message: string) => void;
}

export function ChatView({ chat, isLoading, onSendFollowUp }: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [followUp, setFollowUp] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, isLoading]);

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim() || !onSendFollowUp) return;
    onSendFollowUp(followUp.trim());
    setFollowUp('');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {chat.title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {chat.createdAt.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-6">
        {chat.messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-1">
                <Compass className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border text-card-foreground shadow-card rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose-trip">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="prose-trip">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-primary-foreground animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4 shadow-card">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Follow-up Input */}
      <form onSubmit={handleSendFollowUp} className="px-4 py-3 border-t border-border bg-card/50">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Ask a follow-up question..."
            value={followUp}
            onChange={e => setFollowUp(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!followUp.trim() || isLoading}
            className="p-2.5 rounded-xl gradient-primary text-primary-foreground disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
