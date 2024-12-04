import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { PostAd } from './pages/PostAd';
import { MyAds } from './pages/MyAds';
import { MySearches } from './pages/MySearches';
import { Chats } from './pages/Chats';
import { Menu } from './pages/Menu';
import { CategoryDetail } from './pages/CategoryDetail';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { AccountSettings } from './pages/AccountSettings';
import { AppSettings } from './pages/AppSettings';
import { Security } from './pages/Security';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Profile } from './pages/Profile';
import { HelpCenter } from './pages/HelpCenter';
import { useAuth } from './contexts/AuthContext';
import './index.css';

// Helper component to handle navigation visibility
const NavigationWrapper = () => {
  const location = useLocation();
  // Hide navigation on specific pages
  const shouldShowNavigation = !location.pathname.includes('/product/') && 
                              !location.pathname.includes('/terms') &&
                              !location.pathname.includes('/help') &&
                              !location.pathname.includes('/onboarding');
  return shouldShowNavigation ? <Navigation /> : null;
};

// Helper component to check onboarding status
const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isOnboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
  const isOnboardingPath = location.pathname === '/onboarding';
  const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';

  if (!isOnboardingCompleted && !isOnboardingPath && !isAuthPath) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <OnboardingCheck>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            {/* Public routes */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={
              !isAuthenticated ? <Login /> : <Navigate to="/" />
            } />
            <Route path="/signup" element={
              !isAuthenticated ? <Signup /> : <Navigate to="/" />
            } />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/help" element={<HelpCenter />} />

            {/* Protected routes */}
            <Route path="/" element={
              isAuthenticated ? <Home /> : <Navigate to="/login" />
            } />
            <Route path="/profile" element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" />
            } />
            <Route path="/favorites" element={
              isAuthenticated ? <Favorites /> : <Navigate to="/login" />
            } />
            <Route path="/post" element={
              isAuthenticated ? <PostAd /> : <Navigate to="/login" />
            } />
            <Route path="/my-ads" element={
              isAuthenticated ? <MyAds /> : <Navigate to="/login" />
            } />
            <Route path="/my-searches" element={
              isAuthenticated ? <MySearches /> : <Navigate to="/login" />
            } />
            <Route path="/chats" element={
              isAuthenticated ? <Chats /> : <Navigate to="/login" />
            } />
            <Route path="/menu" element={
              isAuthenticated ? <Menu /> : <Navigate to="/login" />
            } />
            <Route path="/account-settings" element={
              isAuthenticated ? <AccountSettings /> : <Navigate to="/login" />
            } />
            <Route path="/app-settings" element={
              isAuthenticated ? <AppSettings /> : <Navigate to="/login" />
            } />
            <Route path="/security" element={
              isAuthenticated ? <Security /> : <Navigate to="/login" />
            } />
            <Route path="/category/:category" element={
              isAuthenticated ? <CategoryDetail /> : <Navigate to="/login" />
            } />
            <Route path="/product/:id" element={
              isAuthenticated ? <ProductDetail /> : <Navigate to="/login" />
            } />
          </Routes>
          {isAuthenticated && <NavigationWrapper />}
        </div>
      </OnboardingCheck>
    </Router>
  );
}

export default App;