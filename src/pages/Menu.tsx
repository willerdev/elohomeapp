import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Search,
  ShieldCheck,
  Phone,
  FileText,
  MessageSquare,
  UserCog,
  Monitor,
  UserCircle,
  Lock,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ContactModal } from '../components/ContactModal';
import { AdvertiseModal } from '../components/AdvertiseModal';
import { getProfile } from '../lib/profile.service';
import type { Profile } from '../lib/profile.service';

export const Menu = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuSections = [
    {
      title: 'Account & Listings',
      items: [
        { icon: <UserCircle className="w-5 h-5" />, label: 'My Profile', onClick: () => navigate('/profile') },
        { icon: <ShoppingBag className="w-5 h-5" />, label: 'My Ads', onClick: () => navigate('/my-ads') },
        { icon: <Search className="w-5 h-5" />, label: 'My Searches', onClick: () => navigate('/my-searches') },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: <UserCog className="w-5 h-5" />, label: 'Account Settings', onClick: () => navigate('/account-settings') },
        { icon: <Monitor className="w-5 h-5" />, label: 'App Settings', onClick: () => navigate('/app-settings') },
        { icon: <Lock className="w-5 h-5" />, label: 'Security', onClick: () => navigate('/security') },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: 'Help Center', onClick: () => navigate('/help') },
        { icon: <Phone className="w-5 h-5" />, label: 'Call Us', onClick: () => setIsContactModalOpen(true) },
        { icon: <FileText className="w-5 h-5" />, label: 'Terms & Conditions', onClick: () => navigate('/terms') },
        { icon: <MessageSquare className="w-5 h-5" />, label: 'Advertise with Us', onClick: () => setIsAdvertiseModalOpen(true) },
        { icon: <LogOut className="w-5 h-5" />, label: 'Log Out', onClick: handleLogout },
      ]
    }
  ];

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Menu</h1>
      
      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : (
            profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/48';
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-sky-600" />
              </div>
            )
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile?.full_name || user?.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
              {section.title}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-300">{item.icon}</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
                  </div>
                  {item.label !== 'Log Out' && (
                    <span className="text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      <AdvertiseModal
        isOpen={isAdvertiseModalOpen}
        onClose={() => setIsAdvertiseModalOpen(false)}
      />
    </div>
  );
};