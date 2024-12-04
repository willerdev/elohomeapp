import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { 
  Heart, 
  Share2, 
  Flag,
  MessageCircle,
  DollarSign,
  ChevronLeft,
  MapPin,
  Clock,
  User,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ShareModal } from '../components/ShareModal';
import { ReportModal } from '../components/ReportModal';
import { OfferModal } from '../components/OfferModal';
import { formatCurrency } from '../lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image_urls: string[];
  location: string;
  category: string;
  specifications: Record<string, any>;
  created_at: string;
  user_id: string;
  seller_email?: string;
  seller_name?: string;
  seller_avatar?: string;
}

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data: listing, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (listingError) throw listingError;
        if (!listing) throw new Error('Product not found');

        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', listing.user_id)
          .single();

        if (sellerError) {
          console.error('Error fetching seller details:', sellerError);
        }

        const productData: Product = {
          ...listing,
          seller_name: sellerData?.full_name,
          seller_avatar: sellerData?.avatar_url
        };

        setProduct(productData);

        if (user) {
          const { data: favorite } = await supabase
            .from('favorite')
            .select('id')
            .eq('listing_id', id)
            .eq('user_id', user.id)
            .maybeSingle();

          setIsFavorite(!!favorite);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user || !product) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorite')
          .delete()
          .eq('listing_id', product.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('favorite')
          .insert({
            listing_id: product.id,
            user_id: user.id
          });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleChat = async () => {
    if (!user || !product) return;
    navigate(`/chats/new?listing=${product.id}&seller=${product.user_id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleFavoriteToggle}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Flag className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mt-16">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="aspect-square bg-gray-100"
        >
          {product.image_urls?.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                src={url}
                alt={`${product.title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {product.title}
          </h1>
          <span className="text-2xl font-bold text-sky-600">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{product.location}</span>
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4" />
          <span>{new Date(product.created_at).toLocaleDateString()}</span>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
        </div>

        {/* Seller Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
              {product.seller_avatar ? (
                <img
                  src={product.seller_avatar}
                  alt="Seller"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {product.seller_name || 'Anonymous User'}
              </h3>
              <p className="text-sm text-gray-500">Seller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-2">
        <button
          onClick={() => setIsOfferModalOpen(true)}
          className="flex-1 bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          Make Offer
        </button>
        <button
          onClick={handleChat}
          className="flex-1 border border-sky-600 text-sky-600 py-3 rounded-lg font-medium hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Chat
        </button>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productTitle={product.title}
        productUrl={window.location.href}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={product.id}
      />

      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        askingPrice={product.price}
        sellerUserId={product.user_id}
        listingId={product.id}
      />
    </div>
  );
};