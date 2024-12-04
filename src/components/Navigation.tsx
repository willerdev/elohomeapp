import { Home, Heart, PlusCircle, MessageCircle, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const activeClass = "text-sky-600";
  const inactiveClass = "text-gray-500";
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <Link to="/" className="flex flex-col items-center">
          <Home className={`w-6 h-6 ${isActive('/') ? activeClass : inactiveClass}`} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/favorites" className="flex flex-col items-center">
          <Heart className={`w-6 h-6 ${isActive('/favorites') ? activeClass : inactiveClass}`} />
          <span className="text-xs mt-1">Favorite</span>
        </Link>
        
        <Link to="/post" className="flex flex-col items-center">
          <PlusCircle className={`w-6 h-6 ${isActive('/post') ? activeClass : inactiveClass}`} />
          <span className="text-xs mt-1">Post Ad</span>
        </Link>
        
        <Link to="/chats" className="flex flex-col items-center">
          <MessageCircle className={`w-6 h-6 ${isActive('/chats') ? activeClass : inactiveClass}`} />
          <span className="text-xs mt-1">Chats</span>
        </Link>
        
        <Link to="/menu" className="flex flex-col items-center">
          <Menu className={`w-6 h-6 ${isActive('/menu') ? activeClass : inactiveClass}`} />
          <span className="text-xs mt-1">Menu</span>
        </Link>
      </div>
    </nav>
  );
};