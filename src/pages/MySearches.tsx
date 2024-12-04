import { useState, useEffect } from 'react';
import { AlertCircle, Bell, BellOff, ChevronRight, Search, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SavedSearch {
  id: string;
  query: string;
  filters: Record<string, any>;
  notifications_enabled: boolean;
  last_updated: string;
  new_listings_count: number;
}

export const MySearches = () => {
  const { user } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const loadSearches = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_searches')
          .select('*')
          .eq('user_id', user.id)
          .order('last_updated', { ascending: false });

        if (error) throw error;
        setSearches(data || []);
      } catch (err) {
        console.error('Error loading searches:', err);
        setError('Failed to load saved searches');
      } finally {
        setIsLoading(false);
      }
    };

    loadSearches();
  }, [user]);

  const toggleNotifications = async (searchId: string) => {
    try {
      const search = searches.find(s => s.id === searchId);
      if (!search) return;

      const { error } = await supabase
        .from('saved_searches')
        .update({ notifications_enabled: !search.notifications_enabled })
        .eq('id', searchId);

      if (error) throw error;

      setSearches(prevSearches =>
        prevSearches.map(s =>
          s.id === searchId
            ? { ...s, notifications_enabled: !s.notifications_enabled }
            : s
        )
      );
    } catch (err) {
      console.error('Error toggling notifications:', err);
      setError('Failed to update notification settings');
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;

      setSearches(prevSearches => 
        prevSearches.filter(s => s.id !== searchId)
      );
    } catch (err) {
      console.error('Error deleting search:', err);
      setError('Failed to delete saved search');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Please log in to view your saved searches</p>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Searches</h1>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-600 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
        </div>
      ) : searches.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No saved searches yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map(search => (
            <div
              key={search.id}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{search.query}</h3>
                  <p className="text-sm text-gray-500">
                    {Object.entries(search.filters)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(' • ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleNotifications(search.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {search.notifications_enabled ? (
                      <Bell className="w-5 h-5 text-sky-600" />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteSearch(search.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Updated {new Date(search.last_updated).toLocaleDateString()}
                </span>
                {search.new_listings_count > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-100 text-sky-600 px-2 py-1 rounded-full text-xs font-medium">
                      {search.new_listings_count} new
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};