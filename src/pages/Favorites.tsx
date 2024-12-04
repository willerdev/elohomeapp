import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { fetchFavoriteListings, removeFromFavorite } from '../lib/supabase.service';
import type { Listing } from '../lib/supabase.service';
import { FilterSection, FilterValues } from '../components/FilterSection';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { applyFilters } from '../lib/search.service';


export const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFavoriteListings(user.id);
        setAllListings(data);
        setFilteredListings(data);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, navigate]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;

    try {
      await removeFromFavorite(id, user.id);
      setAllListings(prev => prev.filter(listing => listing.id !== id));
      setFilteredListings(prev => prev.filter(listing => listing.id !== id));
    } catch (err) {
      console.error('Error updating favorite:', err);
      setError('Failed to update favorite');
    }
  };

  const handleFiltersChange = async (newFilters: FilterValues) => {
    setIsLoading(true);
    setError(null);
    setActiveFilters(newFilters);

    try {
      // Apply filters to the existing favorites list
      const results = await applyFilters(newFilters, searchQuery);
      // Only show results that are in our favorites list
      const favoriteIds = new Set(allListings.map(listing => listing.id));
      const filteredResults = results.filter(listing => favoriteIds.has(listing.id));
      setFilteredListings(filteredResults);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = async (query: string, filters: FilterValues) => {
    setSearchQuery(query);
    handleFiltersChange(filters);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Favorites</h1>
        
        <FilterSection
          onApplyFilters={handleFiltersChange}
          onSaveSearch={handleSaveSearch}
          initialFilters={activeFilters}
          searchQuery={searchQuery}
        />

        {error && (
          <div className="flex items-center gap-2 p-4 mb-4 bg-red-50 rounded-lg text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {filteredListings.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No favorites match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map(listing => (
              <ProductCard
                key={listing.id}
                product={{
                  id: listing.id,
                  title: listing.title,
                  price: listing.price,
                  description: listing.description,
                  image_urls: listing.images || [],
                  images: listing.images || [],
                  location: listing.location,
                  date: new Date(listing.created_at).toLocaleDateString(),
                  category: listing.category
                }}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};