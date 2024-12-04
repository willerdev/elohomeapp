import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { addToFavorite, removeFromFavorite } from "../lib/supabase.service";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";
import { formatCurrency } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

// Initialize Supabase client
const supabaseUrl = "https://asxsxkbfxzkzsceudhxo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeHN4a2JmeHprenNjZXVkaHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTYyNzksImV4cCI6MjA0NzM5MjI3OX0.LzNbDBUE_0LGm5TMZKu0KclR2zqA52cv-iZqOP433NQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export const ProductCard = ({ product, isFavorite, onToggleFavorite }: ProductCardProps) => {
  const { user } = useAuth();
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [firstImage, setFirstImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstImage = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("image_urls")
          .eq("id", product.id)
          .single();

        if (error) {
          console.error("Error fetching images:", error);
        } else if (data?.image_urls?.[0]) {
          setFirstImage(data.image_urls[0]);
        } else {
          setFirstImage(null);
        }
      } catch (err) {
        console.error("Error fetching first image:", err);
      }
    };

    fetchFirstImage();
  }, [product.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUpdatingFavorite || !user) return;

    setIsUpdatingFavorite(true);
    try {
      if (isFavorite) {
        await removeFromFavorite(product.id, user.id);
      } else {
        await addToFavorite(product.id, user.id);
      }
      onToggleFavorite(product.id);
    } catch (err) {
      console.error("Error updating favorite:", err);
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  // Get price display based on specifications
  const getPriceDisplay = () => {
    const priceType = product.specifications?.priceType;
    if (priceType === "free") {
      return "Free";
    }
    if (priceType === "contact") {
      return "Contact Seller";
    }
    if (priceType === "negotiable") {
      return `${formatCurrency(product.price)} (Negotiable)`;
    }
    return formatCurrency(product.price);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm p-3 relative">
        <div className="aspect-square w-full mb-2 relative rounded-lg overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.title || "Listing Image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/300x200";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              No Image Available
            </div>
          )}
        </div>
        <button
          onClick={handleFavoriteClick}
          disabled={isUpdatingFavorite || !user}
          className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-md"
        >
          {isUpdatingFavorite ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
          ) : (
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-sky-600 text-sky-600" : "text-gray-400"
              }`}
            />
          )}
        </button>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2">
            {product.title || "Untitled Listing"}
          </h3>
          <p className="text-sky-600 font-bold text-sm">{getPriceDisplay()}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="truncate">{product.location}</span>
            <span>{product.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};