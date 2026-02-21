import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { TripSidebar } from '@/components/TripSidebar';
import { TripForm } from '@/components/TripForm';
import { ChatView } from '@/components/ChatView';
import { ProfilePanel } from '@/components/ProfilePanel';
import { useTripStore, useProfileStore } from '@/store/tripStore';
import { TripFormData, TripChat } from '@/types/trip';
import { apiService, ASSETS_URL } from '@/services/ApiService';
import { useNavigate } from 'react-router-dom';



const Index = () => {
  const navigate = useNavigate();
  const {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    createChat,
    addMessage,
    updateChat,
    deleteChat,
    isLoading,
    setIsLoading,
  } = useTripStore();

  const { profile, setProfile, updateLocalProfile } = useProfileStore();

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Map backend trip object to frontend TripChat format
  const mapBackendTripToChat = (trip: any): TripChat => {
    const markdown = formatTripToMarkdown(trip);
    return {
      id: trip._id,
      title: `Trip to ${trip.destination}`,
      destination: trip.destination,
      createdAt: new Date(trip.createdAt),
      messages: [
        {
          id: 'initial-user',
          role: 'user',
          content: `Plan a trip to **${trip.destination}** for **${trip.duration}** with a budget of **${trip.budget}** traveling with **${trip.companions}**.`,
          timestamp: new Date(trip.createdAt),
        },
        {
          id: 'ai-response',
          role: 'assistant',
          content: markdown,
          timestamp: new Date(trip.createdAt),
        }
      ]
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setIsLoading(true);
        const [userProfile, backendTrips] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.getTrips()
        ]);

        setProfile({
          name: userProfile.name,
          email: userProfile.email,
          avatarUrl: userProfile.profileImage ? `${ASSETS_URL}${userProfile.profileImage}` : '',
        });

        const mappedChats = backendTrips.map(mapBackendTripToChat);
        setChats(mappedChats);
      } catch (error: any) {
        console.error("Failed to fetch initial data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTripToMarkdown = (trip: any) => {
    const it = trip.itinerary;
    if (!it || typeof it !== 'object') return '❌ Error: Invalid itinerary structure from AI.';

    let md = `# 🗺️ ${it.tripTitle || 'Your Trip'}\n\n`;
    md += `${it.description || ''}\n\n---\n\n`;

    if (it.itinerary && Array.isArray(it.itinerary)) {
      it.itinerary.forEach((day: any) => {
        md += `## 📅 Day ${day.day || '?'}: ${day.theme || 'Exploration'}\n`;
        if (day.activities && Array.isArray(day.activities)) {
          day.activities.forEach((act: any) => {
            md += `- **${act.time || ''}**: ${act.activity || ''} ${act.location ? `at *${act.location}*` : ''} — ${act.description || ''}\n`;
          });
        }
        if (day.food) {
          md += `\n**🍽️ Dining:**\n`;
          if (day.food.breakfast) md += `- *Breakfast*: ${day.food.breakfast}\n`;
          if (day.food.lunch) md += `- *Lunch*: ${day.food.lunch}\n`;
          if (day.food.dinner) md += `- *Dinner*: ${day.food.dinner}\n\n`;
        }
      });
    }

    if (it.travelTips && Array.isArray(it.travelTips)) {
      md += `---\n\n## 💡 Travel Tips\n`;
      it.travelTips.forEach((tip: string) => {
        md += `> ${tip}\n\n`;
      });
    }

    if (it.estimatedExpenses) {
      md += `---\n\n## 💰 Estimated Expenses\n`;
      if (it.estimatedExpenses.accommodation) md += `- **Accommodation**: ${it.estimatedExpenses.accommodation}\n`;
      if (it.estimatedExpenses.food) md += `- **Food**: ${it.estimatedExpenses.food}\n`;
      if (it.estimatedExpenses.activities) md += `- **Activities**: ${it.estimatedExpenses.activities}\n`;
    }

    return md;
  };

  const handleSubmitTrip = async (data: TripFormData) => {
    console.log("Submitting trip for:", data.destination);
    setIsLoading(true);
    const chatId = createChat(data);
    setShowForm(false);

    try {
      const response = await apiService.createTrip(data);
      console.log("API Response received:", response);
      const backendChat = mapBackendTripToChat(response);
      updateChat(chatId, backendChat);
    } catch (error: any) {
      console.error('Trip Creation Error:', error);
      const errorMessage = error.response?.data?.message || '❌ Sorry, something went wrong while planning your trip. Please try again.';
      addMessage(chatId, {
        role: 'assistant',
        content: errorMessage,
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

  const handleUpdateProfile = async (data: any) => {
    try {
      setIsLoading(true);
      const updatedUser = await apiService.updateProfile(data);
      setProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.profileImage ? `${ASSETS_URL}${updatedUser.profileImage}` : '',
      });
      // If token changed (optional but often returned on email update)
      if (updatedUser.token) {
        localStorage.setItem('token', updatedUser.token);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteTrip = async (id: string) => {
    try {
      setIsLoading(true);
      await apiService.deleteTrip(id);
      deleteChat(id);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <TripSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewTrip={handleNewTrip}
        onDeleteChat={handleDeleteTrip}
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
        onSave={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
