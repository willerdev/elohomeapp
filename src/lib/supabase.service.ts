import { supabase } from './supabase';
import type { Database } from './database.types';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Chat = Database['public']['Tables']['chats']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];

// Favorite related functions
export const addToFavorite = async (listingId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorite')
    .insert({
      listing_id: listingId,
      user_id: userId,
    });

  if (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFromFavorite = async (listingId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorite')
    .delete()
    .match({
      listing_id: listingId,
      user_id: userId,
    });

  if (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const fetchUserFavorites = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('favorite')
    .select('listing_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }

  return data.map(fav => fav.listing_id);
};

export const fetchFavoriteListings = async (userId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      favorite!inner (*)
    `)
    .eq('favorite.user_id', userId);

  if (error) {
    console.error('Error fetching favorite listings:', error);
    throw error;
  }

  return data || [];
};

// ... (keep existing functions)

// Listings related functions
export const fetchListingsByCategory = async (category: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }

  return data || [];
};

export const fetchUserListings = async (userId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }

  return data || [];
};

export const createListing = async (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<Listing> => {
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    throw error;
  }

  return data;
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
};

// Chat related functions
export const fetchUserChats = async (userId: string): Promise<Chat[]> => {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      listings!inner (
        title,
        image_urls
      )
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_time', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }

  return data || [];
};

export const fetchChatMessages = async (chatId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data;
};

export const sendMessage = async (chatId: string, senderId: string, content: string): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      content
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  // Update last message in chat
  const { error: updateError } = await supabase
    .from('chats')
    .update({
      last_message: content,
      last_message_time: new Date().toISOString()
    })
    .eq('id', chatId);

  if (updateError) {
    console.error('Error updating chat:', updateError);
    throw updateError;
  }

  return data;
};