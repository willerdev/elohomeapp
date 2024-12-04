import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, MessageCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'To create an account, click on the "Sign Up" button and fill in your email address and password. You\'ll receive a verification email to confirm your account.'
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you instructions to reset your password.'
  },
  {
    category: 'Listings',
    question: 'How do I post an ad?',
    answer: 'Click the "Post Ad" button in the navigation bar. Fill in your item details, add photos, and set your price. Review the information and click "Post" to publish.'
  },
  {
    category: 'Listings',
    question: 'How many photos can I add to my listing?',
    answer: 'You can add up to 5 photos per listing. Make sure they clearly show your item and any relevant details.'
  },
  {
    category: 'Messages',
    question: 'How do I message a seller?',
    answer: 'On any listing, click the "Chat" button to start a conversation with the seller. You can discuss details, negotiate price, and arrange meetups.'
  },
  {
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'Payment methods are arranged between buyers and sellers. We recommend discussing payment options in the chat and meeting in safe locations for transactions.'
  },
  {
    category: 'Safety',
    question: 'How can I stay safe when meeting buyers/sellers?',
    answer: 'Always meet in public places, bring someone with you, and verify the item before payment. Don\'t share personal financial information.'
  }
];

export const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleQuestion = (question: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(question)) {
      newExpanded.delete(question);
    } else {
      newExpanded.add(question);
    }
    setExpandedQuestions(newExpanded);
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Help Center</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === null
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-8">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(faq.question)}
                className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-left">
                  {faq.question}
                </span>
                {expandedQuestions.has(faq.question) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedQuestions.has(faq.question) && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Still need help?
          </h2>
          <div className="space-y-4">
            <a
              href="mailto:support@elohome.com"
              className="flex items-center gap-3 text-sky-600 hover:text-sky-700"
            >
              <Mail className="w-5 h-5" />
              <span>support@elohome.com</span>
            </a>
            <a
              href="tel:+97141234567"
              className="flex items-center gap-3 text-sky-600 hover:text-sky-700"
            >
              <Phone className="w-5 h-5" />
              <span>+971 4 123 4567</span>
            </a>
            <div className="flex items-center gap-3 text-sky-600">
              <MessageCircle className="w-5 h-5" />
              <span>Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};