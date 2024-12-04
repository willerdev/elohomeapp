import { useState, useEffect } from 'react';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { fetchUserChats, fetchChatMessages, sendMessage } from '../lib/supabase.service';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import type { Chat, Message } from '../lib/supabase.service';

export const Chats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chats
  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;

      try {
        const data = await fetchUserChats(user.id);
        setChats(data);
      } catch (err) {
        console.error('Error loading chats:', err);
        setError('Failed to load chats');
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [user]);

  // Fetch messages when chat is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChatId) return;

      try {
        const data = await fetchChatMessages(selectedChatId);
        setMessages(data);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, [selectedChatId]);

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedChatId) return;

    try {
      const newMessage = await sendMessage(selectedChatId, user.id, content);
      setMessages(prev => [...prev, newMessage]);
      
      // Update chat's last message in the list
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId
          ? {
              ...chat,
              last_message: content,
              last_message_time: new Date().toISOString()
            }
          : chat
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Please log in to view your chats</p>
      </div>
    );
  }

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="pb-20">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      ) : error ? (
        <div className="p-4 text-red-600 text-center">{error}</div>
      ) : selectedChat ? (
        <ChatWindow
          conversation={{
            id: selectedChat.id,
            name: `User ${selectedChat.participant1_id === user.id ? selectedChat.participant2_id : selectedChat.participant1_id}`,
            messages: messages.map(msg => ({
              content: msg.content,
              time: new Date(msg.created_at).toLocaleTimeString(),
              isSender: msg.sender_id === user.id
            })),
            lastMessage: messages[messages.length - 1]?.content || '',
            lastMessageTime: messages[messages.length - 1]?.created_at || ''
          }}
          onBack={() => setSelectedChatId(null)}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="pt-4 px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Chats</h1>
          {chats.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No chats yet</p>
          ) : (
            <ChatList
              chats={chats.map(chat => ({
                ...chat,
                last_message: chat.last_message || ''  // Convert null to empty string
              }))}
              onSelectChat={setSelectedChatId}
              selectedChatId={selectedChatId}
              currentUserId={user.id}
            />
          )}
        </div>
      )}
    </div>
  );
};