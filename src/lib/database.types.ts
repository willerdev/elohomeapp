export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          title: string
          icon: string
          created_at: string
        }
        Insert: {
          title: string
          icon: string
          created_at?: string
        }
        Update: {
          title?: string
          icon?: string
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          title: string
          price: number
          description: string
          images: string[]
          location: string
          category: string
          specifications: Json
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          price: number
          description: string
          images: string[]
          location: string
          category: string
          specifications: Json
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          description?: string
          images?: string[]
          location?: string
          category?: string
          specifications?: Json
          user_id?: string
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          participant1_id: string
          participant2_id: string
          listing_id: string
          last_message: string | null
          last_message_time: string
          created_at: string
        }
        Insert: {
          id?: string
          participant1_id: string
          participant2_id: string
          listing_id: string
          last_message?: string | null
          last_message_time?: string
          created_at?: string
        }
        Update: {
          id?: string
          participant1_id?: string
          participant2_id?: string
          listing_id?: string
          last_message?: string | null
          last_message_time?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}