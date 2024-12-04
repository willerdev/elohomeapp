import { supabase } from './supabase';
import type { FilterValues } from '../components/FilterSection';

export interface SavedSearch {
  id: string;
  user_id: string;
  query: string;
  filters: FilterValues;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_checked: string;
  new_listings_count: number;
}

export const saveSearch = async (
  userId: string,
  query: string,
  filters: FilterValues
): Promise<void> => {
  const { error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: userId,
      query,
      filters,
      notifications_enabled: true,
      last_checked: new Date().toISOString(),
      new_listings_count: 0
    });

  if (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};

export const applyFilters = async (
  filters: FilterValues,
  query?: string
) => {
  let queryBuilder = supabase
    .from('listings')
    .select('*');

  // Apply price range filter
  if (filters.priceMin !== undefined) {
    queryBuilder = queryBuilder.gte('price', filters.priceMin);
  }
  if (filters.priceMax !== undefined) {
    queryBuilder = queryBuilder.lte('price', filters.priceMax);
  }

  // Apply location filter
  if (filters.location) {
    queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
  }

  // Apply category filter
  if (filters.category) {
    queryBuilder = queryBuilder.eq('category', filters.category);
  }

  // Apply condition filter (assuming it's stored in specifications)
  if (filters.condition) {
    queryBuilder = queryBuilder.contains('specifications', { condition: filters.condition });
  }

  // Apply search query to title and description
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // Execute query with sorting
  const { data, error } = await queryBuilder
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error applying filters:', error);
    throw error;
  }

  return data;
};