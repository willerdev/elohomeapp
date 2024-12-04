import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  KeyRound,
  Shield,
  Smartphone,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

interface Device {
  id: string;
  device_name: string;
  browser: string;
  os: string;
  ip_address: string;
  last_used: string;
  is_current: boolean;
}

export const Security = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSecuritySettings = async () => {
      if (!user) return;

      try {
        // Load 2FA status
        const { data: mfaData, error: mfaError } = await supabase
          .from('mfa_settings')
          .select('enabled')
          .eq('user_id', user.id)
          .single();

        if (mfaError) throw mfaError;
        setIs2FAEnabled(mfaData?.enabled || false);

        // Load devices
        const { data: devicesData, error: devicesError } = await supabase
          .from('user_devices')
          .select('*')
          .eq('user_id', user.id)
          .order('last_used', { ascending: false });

        if (devicesError) throw devicesError;
        setDevices(devicesData || []);
      } catch (err) {
        console.error('Error loading security settings:', err);
        setError('Failed to load security settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSecuritySettings();
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!user) return;

    setIsGeneratingQR(true);
    setError(null);
    setSuccess(null);

    try {
      if (!is2FAEnabled) {
        // Generate 2FA secret and QR code
        const { data, error } = await supabase.rpc('generate_2fa_secret', {
          user_id: user.id
        });

        if (error) throw error;

        setQrCodeData(data.qr_code);
        // Show QR code modal here
      } else {
        // Disable 2FA
        const { error } = await supabase
          .from('mfa_settings')
          .update({ enabled: false })
          .eq('user_id', user.id);

        if (error) throw error;

        setIs2FAEnabled(false);
        setSuccess('Two-factor authentication disabled');
      }
    } catch (err) {
      console.error('Error toggling 2FA:', err);
      setError('Failed to update 2FA settings');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const verifyAndEnable2FA = async () => {
    if (!user || !verificationCode) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.rpc('verify_2fa_token', {
        user_id: user.id,
        token: verificationCode
      });

      if (error) throw error;

      setIs2FAEnabled(true);
      setQrCodeData('');
      setVerificationCode('');
      setSuccess('Two-factor authentication enabled');
    } catch (err) {
      console.error('Error verifying 2FA:', err);
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceRemoval = async (deviceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_devices')
        .delete()
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      setDevices(prev => prev.filter(device => device.id !== deviceId));
      setSuccess('Device removed successfully');
    } catch (err) {
      console.error('Error removing device:', err);
      setError('Failed to remove device');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Please log in to access security settings</p>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Security Settings</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <p>{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {is2FAEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={handleToggle2FA}
                disabled={isGeneratingQR}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingQR ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : is2FAEnabled ? (
                  'Disable 2FA'
                ) : (
                  'Enable 2FA'
                )}
              </button>
            </div>

            {qrCodeData && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Scan this QR code with your authenticator app:
                </p>
                <div className="flex justify-center">
                  <QRCodeSVG value={qrCodeData} size={200} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Enter code from authenticator app"
                    />
                    <button
                      onClick={verifyAndEnable2FA}
                      disabled={!verificationCode}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Devices Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Connected Devices</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
            </div>
          ) : devices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No devices found</p>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {device.device_name}
                      </span>
                      {device.is_current && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {device.browser} on {device.os}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last used: {new Date(device.last_used).toLocaleDateString()}
                    </div>
                  </div>
                  {!device.is_current && (
                    <button
                      onClick={() => handleDeviceRemoval(device.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove device"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};