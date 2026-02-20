import { useState } from 'react';
import { Menu } from 'lucide-react';
import { TripSidebar } from '@/components/TripSidebar';
import { TripForm } from '@/components/TripForm';
import { ChatView } from '@/components/ChatView';
import { ProfilePanel } from '@/components/ProfilePanel';
import { useTripStore, useProfileStore } from '@/store/tripStore';
import { TripFormData } from '@/types/trip';

// Demo AI response for now — replace with your actual POST request
const mockAIResponse = (data: TripFormData): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`# 🗺️ Your ${data.duration} Trip to ${data.destination}

## Overview
Here's a curated **${data.budget}** itinerary for your **${data.companions}** adventure to **${data.destination}**!

---

## 📅 Day-by-Day Itinerary

### Day 1: Arrival & Exploration
- 🛬 Arrive at ${data.destination} and check into your hotel
- 🍽️ Enjoy a welcome dinner at a local restaurant
- 🌆 Take an evening stroll around the city center

### Day 2: Cultural Immersion
- 🏛️ Visit the top historical landmarks
- 🎨 Explore local art galleries and museums
- ☕ Afternoon break at a renowned local café

### Day 3: Adventure Day
- 🥾 Morning hike or outdoor activity
- 📸 Photography at scenic viewpoints
- 🍷 Evening wine tasting or cultural show

---

## 💰 Budget Breakdown
| Category | Estimated Cost |
|----------|---------------|
| Accommodation | $${data.budget === 'Luxury' ? '300' : data.budget === 'Moderate' ? '150' : '80'}/night |
| Food & Dining | $${data.budget === 'Luxury' ? '150' : data.budget === 'Moderate' ? '80' : '40'}/day |
| Activities | $${data.budget === 'Luxury' ? '200' : data.budget === 'Moderate' ? '100' : '50'}/day |
| Transport | $${data.budget === 'Luxury' ? '100' : data.budget === 'Moderate' ? '50' : '25'}/day |

---

## 🎒 Packing Essentials
- Comfortable walking shoes
- Weather-appropriate clothing
- Travel documents & copies
- Universal power adapter
- Reusable water bottle

## 💡 Pro Tips
> *Book attractions online in advance to skip queues. Consider getting a city pass for discounts on multiple attractions.*

Happy traveling! ✈️`);
    }, 2000);
  });
};

const Index = () => {
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createChat,
    addMessage,
    deleteChat,
    isLoading,
    setIsLoading,
  } = useTripStore();

  const { profile, updateProfile } = useProfileStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmitTrip = async (data: TripFormData) => {
    setIsLoading(true);
    const chatId = createChat(data);
    setShowForm(false);

    try {
      // Replace this with your actual POST request:
      // const response = await fetch('/api/plan-trip', { method: 'POST', body: JSON.stringify(data) });
      // const result = await response.json();
      const aiResponse = await mockAIResponse(data);
      addMessage(chatId, { role: 'assistant', content: aiResponse });
    } catch {
      addMessage(chatId, {
        role: 'assistant',
        content: '❌ Sorry, something went wrong while planning your trip. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = async (message: string) => {
    if (!activeChatId) return;
    addMessage(activeChatId, { role: 'user', content: message });
    setIsLoading(true);

    try {
      // Replace with actual API call for follow-up
      const aiResponse = await new Promise<string>(resolve =>
        setTimeout(
          () =>
            resolve(
              `Great question! Here's more detail:\n\n${message}\n\n---\n\nI'd recommend checking local tourism boards for the most up-to-date information. Would you like me to help with anything else?`
            ),
          1500
        )
      );
      addMessage(activeChatId, { role: 'assistant', content: aiResponse });
    } catch {
      addMessage(activeChatId, {
        role: 'assistant',
        content: '❌ Sorry, I couldn\'t process that. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTrip = () => {
    setActiveChatId(null);
    setShowForm(true);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowForm(false);
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <TripSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewTrip={handleNewTrip}
        onDeleteChat={deleteChat}
        onOpenProfile={() => setProfileOpen(true)}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-heading text-sm font-medium text-foreground">
            {activeChat ? activeChat.title : 'Plan a New Trip'}
          </h2>
        </header>

        {/* Content */}
        {showForm || !activeChat ? (
          <TripForm onSubmit={handleSubmitTrip} isLoading={isLoading} />
        ) : (
          <ChatView
            chat={activeChat}
            isLoading={isLoading}
            onSendFollowUp={handleFollowUp}
          />
        )}
      </div>

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </div>
  );
};

export default Index;
