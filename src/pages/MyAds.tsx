import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { fetchUserListings } from '../lib/supabase.service';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Listing } from '../lib/supabase.service';

export const MyAds = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadListings = async () => {
      if (!user) return;
      
      try {
        const data = await fetchUserListings(user.id);
        setListings(data);
      } catch (err) {
        setError('Failed to load your listings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [user]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your ads</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">My Ads</h1>
          </div>
          <Link
            to="/post"
            className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post Ad</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
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
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">You haven't posted any ads yet</p>
            <Link
              to="/post"
              className="bg-sky-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post Your First Ad</span>
            </Link>
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