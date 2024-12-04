import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Shield, Trash2, Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

interface VerificationRequirement {
  id: string;
  verification_type: string;
  document_type: string;
  is_required: boolean;
  description: string;
}

export const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [requirements, setRequirements] = useState<VerificationRequirement[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch verification requirements
    const fetchRequirements = async () => {
      const { data, error } = await supabase
        .from('verification_requirements')
        .select('*')
        .eq('is_required', true);

      if (error) {
        console.error('Error fetching requirements:', error);
        return;
      }

      setRequirements(data);
    };

    // Fetch current verification status
    const fetchVerificationStatus = async () => {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('verification_status')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching verification status:', error);
        return;
      }

      setVerificationStatus(data?.verification_status || 'unverified');
    };

    fetchRequirements();
    fetchVerificationStatus();
  }, [user]);

  const handleFileChange = (requirementId: string, file: File) => {
    setSelectedFiles(prev => ({
      ...prev,
      [requirementId]: file
    }));
  };

  const handleVerificationSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload files to storage
      const uploadPromises = Object.entries(selectedFiles).map(async ([requirementId, file]) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${requirementId}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        return {
          requirementId,
          url: uploadData.path
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Create KYC verification record
      const { error: kycError } = await supabase
        .from('kyc_verifications')
        .insert({
          user_id: user.id,
          id_type: 'government_id', // Default type
          id_document_url: uploadedFiles[0]?.url,
          proof_of_address_url: uploadedFiles[1]?.url,
          verification_status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (kycError) throw kycError;

      setVerificationStatus('pending');
      setSelectedFiles({});
    } catch (err) {
      console.error('Error submitting verification:', err);
      setError('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      // Delete user's data
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError) throw authError;

      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Your account is verified</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Verification in progress</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span>Verification rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="w-5 h-5" />
            <span>Not verified</span>
          </div>
        );
    }
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Verification Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Verification</h2>
        {renderVerificationStatus()}

        {verificationStatus === 'unverified' && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              Verify your account to unlock all features
            </p>
            {requirements.map((requirement) => (
              <div key={requirement.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {requirement.document_type}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(requirement.id, file);
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-sky-50 file:text-sky-700
                    hover:file:bg-sky-100"
                />
                <p className="mt-1 text-xs text-gray-500">{requirement.description}</p>
              </div>
            ))}
            <button
              onClick={handleVerificationSubmit}
              disabled={isSubmitting || Object.keys(selectedFiles).length === 0}
              className="w-full mt-4 bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Upload className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Verification
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDeleting ? (
            <>
              <Trash2 className="w-5 h-5 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-5 h-5" />
              Delete Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};