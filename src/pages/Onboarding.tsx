import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Search, ShoppingBag, MessageCircle, CreditCard } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    title: "Welcome to EloHome",
    subtitle: "Your Premier Marketplace",
    description: "Discover amazing items and connect with sellers in your local area. Buy and sell with confidence.",
    icon: Search,
    gradient: "from-violet-500 to-purple-500",
    buttonText: "Let's Start",
    features: ["Browse thousands of items", "Find great deals", "Local marketplace"]
  },
  {
    title: "Easy Buying & Selling",
    subtitle: "Post in Minutes",
    description: "List your items quickly and reach thousands of potential buyers. Or find exactly what you're looking for.",
    icon: ShoppingBag,
    gradient: "from-cyan-500 to-blue-500",
    buttonText: "Continue",
    features: ["Quick listings", "Secure payments", "Real-time updates"]
  },
  {
    title: "Connect & Chat",
    subtitle: "Safe Communication",
    description: "Chat directly with buyers and sellers. Negotiate prices and arrange meetings securely.",
    icon: MessageCircle,
    gradient: "from-emerald-500 to-teal-500",
    buttonText: "Next",
    features: ["In-app messaging", "Safe meetups", "Real-time chat"]
  },
  {
    title: "Secure Transactions",
    subtitle: "Buy with Confidence",
    description: "Enjoy secure payments and protected transactions. Your safety is our priority.",
    icon: CreditCard,
    gradient: "from-rose-500 to-pink-500",
    buttonText: "Get Started",
    features: ["Protected payments", "Verified users", "Buyer protection"]
  }
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiper, setSwiper] = useState<any>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      handleComplete();
    } else {
      swiper?.slideNext();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
          bulletActiveClass: '!opacity-100'
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiper}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
        className="h-full w-full"
        allowTouchMove={true}
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={index}>
              <div className={`h-full w-full bg-gradient-to-br ${slide.gradient} p-8 flex flex-col items-center justify-between text-white`}>
                {/* Top Section */}
                <div className="w-full pt-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="space-y-1">
                      <div className="h-1 w-16 bg-white/30 rounded">
                        <div 
                          className="h-full bg-white rounded" 
                          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium">
                        {currentSlide + 1}/{slides.length}
                      </p>
                    </div>
                    {currentSlide < slides.length - 1 && (
                      <button
                        onClick={handleComplete}
                        className="text-sm font-medium hover:opacity-80 transition-opacity"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </div>

                {/* Middle Section */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="transform transition-all duration-500 hover:scale-110">
                    <Icon className="w-24 h-24" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm uppercase tracking-wider font-medium opacity-90">
                      {slide.subtitle}
                    </h3>
                    <h2 className="text-4xl font-bold">
                      {slide.title}
                    </h2>
                    <p className="text-lg opacity-90 max-w-md">
                      {slide.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {slide.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-white/10 text-sm backdrop-blur-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full space-y-4">
                  <button
                    onClick={handleNext}
                    className="w-full bg-white text-gray-900 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};