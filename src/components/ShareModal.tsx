import { X, MessageCircle, Facebook, Instagram } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productUrl: string;
}

export const ShareModal = ({ isOpen, onClose, productTitle, productUrl }: ShareModalProps) => {
  if (!isOpen) return null;

  const shareText = `Check out ${productTitle} on EloHome`;
  
  const handleWhatsAppShare = () => {
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${shareText}\n${productUrl}`)}`;
    window.location.href = whatsappUrl;
  };

  const handleSMSShare = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(`${shareText}\n${productUrl}`)}`;
    window.location.href = smsUrl;
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't have a direct sharing API, so we'll copy the link
    navigator.clipboard.writeText(productUrl).then(() => {
      alert('Link copied! You can now paste it on Instagram.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Share</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Share buttons */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Share on WhatsApp
          </button>

          <button
            onClick={handleSMSShare}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Share via SMS
          </button>

          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1877F2] text-white hover:bg-[#1664d1] transition-colors"
          >
            <Facebook className="w-5 h-5" />
            Share on Facebook
          </button>

          <button
            onClick={handleInstagramShare}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-5 h-5" />
            Share on Instagram
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};