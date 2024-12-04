import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

import { FilterSection, FilterValues } from '../components/FilterSection';
import { applyFilters } from '../lib/search.service';
import type { Listing } from '../lib/supabase.service';



export const CategoryDetail = () => {
  const { category } = useParams<{ category: string }>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});
  const [searchQuery] = useState('');

  useEffect(() => {
    const loadListings = async () => {
      if (!category) return;
      
      setIsLoading(true);
      try {
        const decodedCategory = decodeURIComponent(category);
        // Apply both category and other filters
        const filters = {
          ...activeFilters,
          category: decodedCategory
        };
        const data = await applyFilters(filters, searchQuery);
        setListings(data);
      } catch (err) {
        setError('Failed to load listings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [category, activeFilters, searchQuery]);

  const handleFiltersChange = async (newFilters: FilterValues) => {
    setIsLoading(true);
    setActiveFilters(newFilters);
    try {
      if (!category) return;
      
      const decodedCategory = decodeURIComponent(category);
      const filters = {
        ...newFilters,
        category: decodedCategory
      };
      const data = await applyFilters(filters, searchQuery);
      setListings(data);
    } catch (err) {
      setError('Failed to apply filters');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (!category) {
    return <div className="p-4">Invalid category</div>;
  }

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {decodeURIComponent(category)}
        </h1>

        <FilterSection
          onApplyFilters={handleFiltersChange}
          initialFilters={activeFilters}
          searchQuery={searchQuery}
        />
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 rounded-lg aspect-square"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No items found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map(listing => (
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