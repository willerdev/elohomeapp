import { Megaphone, X, Mail, Phone } from 'lucide-react';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvertiseModal = ({ isOpen, onClose }: AdvertiseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Advertise with Us</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 text-center">
          <Megaphone className="w-16 h-16 text-sky-600 mx-auto mb-4" />
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Coming Soon!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Our advertising platform is under development. Meanwhile, you can contact us for more information about advertising opportunities.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sky-600">
              <Mail className="w-5 h-5" />
              <a href="mailto:advertising@elohome.com" className="hover:underline">
                advertising@elohome.com
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sky-600">
              <Phone className="w-5 h-5" />
              <a href="tel:+97141234567" className="hover:underline">
                +971 4 123 4567
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};