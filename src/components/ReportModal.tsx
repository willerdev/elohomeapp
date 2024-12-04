import { useState, useEffect } from 'react';
import { X, Flag, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  onError?: (error: string) => void;
}

const REPORT_REASONS = [
  'Prohibited item',
  'Counterfeit item',
  'Incorrect category',
  'Fraudulent listing',
  'Inappropriate content',
  'Spam',
  'Other'
];

export const ReportModal = ({ isOpen, onClose, listingId, onError }: ReportModalProps) => {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkExistingReport = async () => {
      if (!user || !listingId) return;

      setIsChecking(true);
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id')
          .eq('listing_id', listingId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setHasReported(!!data);
      } catch (err) {
        console.error('Error checking existing report:', err);
        onError?.('Failed to check report status');
      } finally {
        setIsChecking(false);
      }
    };

    if (isOpen) {
      checkExistingReport();
    }
  }, [isOpen, listingId, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onError?.('You must be logged in to report a listing');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          listing_id: listingId,
          user_id: user.id,
          reason: selectedReason,
          description,
          status: 'pending'
        });

      if (error) throw error;

      setHasReported(true);
      // Don't close the modal immediately to show success state
    } catch (err) {
      console.error('Error submitting report:', err);
      onError?.('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Report Listing</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isChecking ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
            <p className="text-gray-600">Checking report status...</p>
          </div>
        ) : hasReported ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report Already Submitted
            </h3>
            <p className="text-gray-600 mb-6">
              You have already reported this listing. Our team will review it and take appropriate action if necessary.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for reporting
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              >
                <option value="">Select a reason</option>
                {REPORT_REASONS.map(reason => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                rows={4}
                placeholder="Please provide any additional information about the issue"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedReason}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};