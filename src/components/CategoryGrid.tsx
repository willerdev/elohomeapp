import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Car,
  Home,
  Briefcase,
  Shirt,
  Gamepad,
  ShoppingBag,
  Book,
  MoreHorizontal,
  Sofa,
  Watch,
  Laptop,
  PawPrint,
  Baby,
  Dumbbell,
  Music,
  Wrench,
  LucideIcon
} from 'lucide-react';
import { fetchCategories } from '../lib/supabase.service';
import type { Category } from '../lib/supabase.service';

// Define a more comprehensive icon map
const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  car: Car,
  home: Home,
  briefcase: Briefcase,
  shirt: Shirt,
  gamepad: Gamepad,
  shopping_bag: ShoppingBag,
  book: Book,
  more: MoreHorizontal,
  sofa: Sofa,
  watch: Watch,
  laptop: Laptop,
  paw_print: PawPrint,
  baby: Baby,
  dumbbell: Dumbbell,
  music: Music,
  wrench: Wrench
};

export const CategoryGrid = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryTitle: string) => {
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName.toLowerCase()] || iconMap.more;
    return <IconComponent className="w-6 h-6" />;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {categories.map((category) => (
        <button
          key={category.title}
          onClick={() => handleCategoryClick(category.title)}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="text-sky-600 mb-2">
            {renderIcon(category.icon)}
          </div>
          <span className="text-sm text-gray-700 text-center">
            {category.title}
          </span>
        </button>
      ))}
    </div>
  );
};