import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { CategoryGrid } from '../components/CategoryGrid';
import { FilterSection, FilterValues } from '../components/FilterSection';
import { Loader2 } from 'lucide-react';
import { fetchUserFavorites } from '../lib/supabase.service';
import { applyFilters, saveSearch } from '../lib/search.service';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

export const Home = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load initial listings with any active filters
        const data = await applyFilters(activeFilters, searchQuery);
        setListings(data);

        // Load favorites if user is logged in
        if (user) {
          const favoriteIds = await fetchUserFavorites(user.id);
          setFavorites(favoriteIds);
        }
      } catch (err) {
        setError('Failed to load listings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, activeFilters, searchQuery]);

  const handleFiltersChange = async (newFilters: FilterValues) => {
    setIsLoading(true);
    setActiveFilters(newFilters);
    try {
      const data = await applyFilters(newFilters, searchQuery);
      setListings(data);
    } catch (err) {
      setError('Failed to apply filters');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = async (query: string, filters: FilterValues) => {
    if (!user) {
      showToast('Please log in to save searches', 'error');
      return;
    }

    try {
      await saveSearch(user.id, query, filters);
      showToast('Search saved successfully', 'success');
    } catch (err) {
      console.error('Error saving search:', err);
      showToast('Failed to save search', 'error');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      return newFavorites;
    });
  };

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <FilterSection
          onApplyFilters={handleFiltersChange}
          onSaveSearch={handleSaveSearch}
          initialFilters={activeFilters}
          searchQuery={searchQuery}
        />

        <CategoryGrid />
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No listings found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ProductCard
                key={listing.id}
                product={{
                  id: listing.id,
                  title: listing.title,
                  price: listing.price,
                  description: listing.description,
                  images: listing.image_urls || [],
                  location: listing.location,
                  date: new Date(listing.created_at).toLocaleDateString(),
                  category: listing.category
                }}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};