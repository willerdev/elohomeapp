import { supabase } from './supabase';


export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  participant1_id: string;
  participant2_id: string;
  listing_id: string;
  last_message: string;
  last_message_time: string;
  created_at: string;
  listing?: {
    title: string;
    images: string[];
  };
}

export interface CreateChatParams {
  participant1_id: string;
  participant2_id: string;
  listing_id: string;
  initialMessage: string;
}

export const createChat = async ({
  participant1_id,
  participant2_id,
  listing_id,
  initialMessage
}: CreateChatParams): Promise<string> => {
  try {
    // First, check if a chat already exists between these users for this listing
    const { data: existingChat, error: findError } = await supabase
      .from('chats')
      .select(`
        id,
        listings!inner (
          title,
          images
        )
      `)
      .eq('participant1_id', participant1_id)
      .eq('participant2_id', participant2_id)
      .eq('listing_id', listing_id)
      .maybeSingle();

    if (findError) {
      console.error('Error finding existing chat:', findError);
      throw findError;
    }

    // If chat exists, return its ID
    if (existingChat) {
      return existingChat.id;
    }

    // If no existing chat, create a new one using a transaction
    const { data: newChat, error: chatError } = await supabase
      .from('chats')
      .insert({
        participant1_id,
        participant2_id,
        listing_id,
        last_message: initialMessage,
        last_message_time: new Date().toISOString()
      })
      .select(`
        *,
        listings!inner (
          title,
          images
        )
      `)
      .single();

    if (chatError) {
      console.error('Error creating chat:', chatError);
      throw chatError;
    }

    // Create the initial message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        chat_id: newChat.id,
        sender_id: participant1_id,
        receiver_id: participant2_id,
        content: initialMessage
      });

    if (messageError) {
      console.error('Error creating initial message:', messageError);
      throw messageError;
    }

    return newChat.id;
  } catch (error) {
    console.error('Error in createChat:', error);
    throw new Error('Failed to create or find chat');
  }
};

export const fetchUserChats = async (userId: string): Promise<Chat[]> => {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      listings!inner (
        title,
        images
      )
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_time', { ascending: false });

  if (error) {
    console.error('Error fetching user chats:', error);
    throw error;
  }

  return data || [];
};

export const fetchChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }

  return data || [];
};

export const sendMessage = async ({
  chatId,
  senderId,
  receiverId,
  content
}: {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
}): Promise<void> => {
  try {
    // Start a transaction to update both messages and chat's last message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        receiver_id: receiverId,
        content
      });

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw messageError;
    }

    const { error: chatError } = await supabase
      .from('chats')
      .update({
        last_message: content,
        last_message_time: new Date().toISOString()
      })
      .eq('id', chatId);

    if (chatError) {
      console.error('Error updating chat:', chatError);
      throw chatError;
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw new Error('Failed to send message');
  }
};

export const subscribeToChat = (
  chatId: string,
  callback: (message: ChatMessage) => void
) => {
  return supabase
    .channel(`chat:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();
};