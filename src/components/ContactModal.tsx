import { Phone, Mail, Clock, X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Hours */}
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday<br />
                9:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-3">
            <Phone className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
              <a 
                href="tel:07878282828" 
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                07878282828 (EloHome)
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Email</h3>
              <a 
                href="mailto:customersupport@elohome.com"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                customersupport@elohome.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};