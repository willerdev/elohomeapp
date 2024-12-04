import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createChat } from '../lib/chat.service';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  askingPrice: number;
  sellerUserId: string;
  listingId: string;
  onError?: (error: string) => void;
}

export const OfferModal = ({ isOpen, onClose, askingPrice, sellerUserId, listingId, onError }: OfferModalProps) => {
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(offerPrice);
    
    if (!user) {
      onError?.('You must be logged in to make an offer');
      return;
    }

    if (!isNaN(numericPrice) && numericPrice > 0) {
      setIsSubmitting(true);
      try {
        const initialMessage = `I would like to make an offer of ${formatCurrency(numericPrice)} for your item.`;
        const chatId = await createChat({
          participant1_id: user.id,
          participant2_id: sellerUserId,
          listing_id: listingId,
          initialMessage
        });

        // Close modal and redirect to chat
        onClose();
        navigate(`/chats/${chatId}`);
      } catch (error) {
        console.error('Error creating chat:', error);
        onError?.('Failed to send offer. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Make an Offer</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Asking Price</div>
            <div className="text-lg font-semibold">{formatCurrency(askingPrice)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Offer
            </label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Enter your offer"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sending Offer...
              </>
            ) : (
              'Submit Offer'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};