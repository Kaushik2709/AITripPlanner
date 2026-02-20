import { useState, useCallback } from 'react';
import { TripChat, TripMessage, TripFormData, UserProfile } from '@/types/trip';

// Simple state hook for trip chats
export function useTripStore() {
  const [chats, setChats] = useState<TripChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const createChat = useCallback((formData: TripFormData): string => {
    const id = crypto.randomUUID();
    const userMessage: TripMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: `Plan a trip to **${formData.destination}** for **${formData.duration}** with a budget of **${formData.budget}** traveling with **${formData.companions}**.`,
      timestamp: new Date(),
    };
    const newChat: TripChat = {
      id,
      title: `Trip to ${formData.destination}`,
      destination: formData.destination,
      createdAt: new Date(),
      messages: [userMessage],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    return id;
  }, []);

  const addMessage = useCallback((chatId: string, message: Omit<TripMessage, 'id' | 'timestamp'>) => {
    const newMsg: TripMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setChats(prev =>
      prev.map(c =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  }, [activeChatId]);

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createChat,
    addMessage,
    deleteChat,
    isLoading,
    setIsLoading,
  };
}

export function useProfileStore() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
  });

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  }, []);

  return { profile, updateProfile };
}
