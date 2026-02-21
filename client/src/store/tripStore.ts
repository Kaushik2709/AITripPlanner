import { create } from 'zustand';
import { TripChat, TripMessage, TripFormData, UserProfile } from '@/types/trip';

interface TripStore {
  chats: TripChat[];
  activeChatId: string | null;
  isLoading: boolean;
  setChats: (chats: TripChat[]) => void;
  setActiveChatId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  createChat: (formData: TripFormData) => string;
  addMessage: (chatId: string, message: Omit<TripMessage, 'id' | 'timestamp'>) => void;
  updateChat: (oldId: string, newChat: TripChat) => void;
  deleteChat: (chatId: string) => void;
}

export const useTripStore = create<TripStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,

  setChats: (chats) => set({ chats }),
  setActiveChatId: (id) => set({ activeChatId: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  createChat: (formData) => {
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
    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChatId: id,
    }));
    return id;
  },

  addMessage: (chatId, message) => {
    const newMsg: TripMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c
      ),
    }));
  },

  updateChat: (oldId, newChat) => {
    set((state) => ({
      chats: state.chats.map((c) => (c.id === oldId ? newChat : c)),
      // Atomic update of activeChatId if necessary
      activeChatId: state.activeChatId === oldId ? newChat.id : state.activeChatId,
    }));
  },

  deleteChat: (chatId) => {
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
    }));
  },
}));

interface ProfileStore {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateLocalProfile: (data: Partial<UserProfile>) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
  },
  setProfile: (profile) => set({ profile }),
  updateLocalProfile: (data) =>
    set((state) => ({ profile: { ...state.profile, ...data } })),
}));
