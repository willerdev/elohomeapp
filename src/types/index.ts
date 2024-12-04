export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image_urls: string[];
  location: string;
  date: string;
  category: string;
  specifications?: Record<string, string | number>;
}

export interface Message {
  content: string;
  time: string;
  isSender: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

export interface AppState {
  favorites: string[];
}

export interface CategorySpecField {
  name: string;
  label: string;
  type: 'text' | 'number';
  placeholder: string;
  required: boolean;
}

export interface CategorySpec {
  category: string;
  fields: CategorySpecField[];
}