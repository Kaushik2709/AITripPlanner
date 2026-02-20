import { Plus, MessageSquare, Trash2, User, Compass } from 'lucide-react';
import { TripChat } from '@/types/trip';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TripSidebarProps {
  chats: TripChat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewTrip: () => void;
  onDeleteChat: (id: string) => void;
  onOpenProfile: () => void;
  isOpen: boolean;
}

export function TripSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewTrip,
  onDeleteChat,
  onOpenProfile,
  isOpen,
}: TripSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-screen bg-sidebar text-sidebar-foreground flex flex-col overflow-hidden border-r border-sidebar-border shrink-0"
    >
      <div className="min-w-[280px]">
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-lg font-semibold text-sidebar-foreground">
            TripAI
          </h1>
        </div>

        {/* New Trip Button */}
        <div className="px-3 mb-2">
          <button
            onClick={onNewTrip}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
          <p className="text-xs uppercase tracking-wider text-sidebar-muted px-2 mb-2 font-medium">
            Recent Trips
          </p>
          <AnimatePresence mode="popLayout">
            {chats.map(chat => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                layout
              >
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors group mb-0.5',
                    activeChatId === chat.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 opacity-60" />
                  <span className="truncate flex-1">{chat.title}</span>
                  <Trash2
                    className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 hover:!opacity-100 shrink-0 transition-opacity"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {chats.length === 0 && (
            <p className="text-xs text-sidebar-muted px-2 py-4 text-center">
              No trips yet. Start planning!
            </p>
          )}
        </div>

        {/* Profile Button */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
