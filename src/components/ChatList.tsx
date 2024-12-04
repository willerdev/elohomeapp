import { User } from 'lucide-react';
import type { Chat } from '../lib/chat.service';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  selectedChatId: string | null;
  currentUserId: string;
}

export const ChatList = ({ chats, onSelectChat, selectedChatId, currentUserId }: ChatListProps) => {
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'some time ago';
    }
  };

  const getOtherParticipantId = (chat: Chat) => {
    return chat.participant1_id === currentUserId ? chat.participant2_id : chat.participant1_id;
  };

  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
            selectedChatId === chat.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
            {chat.listing?.images?.[0] ? (
              <img 
                src={chat.listing.images[0]}
                alt="Listing"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/48";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex justify-between items-baseline">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {chat.listing?.title || `Chat with User ${getOtherParticipantId(chat)}`}
              </h3>
              <span className="text-xs text-gray-500">
                {formatTime(chat.last_message_time)}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {chat.last_message || 'No messages yet'}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};