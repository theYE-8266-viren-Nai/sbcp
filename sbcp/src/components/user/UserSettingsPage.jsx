import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Key, 
  Eye, 
  EyeOff, 
  Save,
  AlertTriangle,
  Check,
  ArrowLeft
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';

const SettingsSection = ({ title, description, icon: Icon, children }) => {
  return (
    <div className="p-6 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
      <div className="flex items-center mb-4 space-x-3">
        <div className="p-2 bg-brand-100 rounded-pinterest">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-brand-600">{title}</h3>
          {description && <p className="text-sm text-brand-500/70">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

const ToggleSetting = ({ label, description, checked, onChange, disabled = false }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-brand-50 rounded-pinterest">
      <div className="flex-1">
        <h4 className="font-medium text-brand-600">{label}</h4>
        {description && <p className="mt-1 text-sm text-brand-500/70">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
      </label>
    </div>
  );
};

const UserSettingsPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    isProfilePublic: true,
    allowMessagesFromStrangers: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: true
  });

  // Password Change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const fetchCurrentSettings = async () => {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data;
      
      setPrivacySettings({
        isProfilePublic: userData.isProfilePublic ?? true,
        allowMessagesFromStrangers: userData.allowMessagesFromStrangers ?? true
      });

      setNotificationSettings({
        emailNotificationsEnabled: userData.emailNotificationsEnabled ?? true,
        pushNotificationsEnabled: userData.pushNotificationsEnabled ?? true
      });
    } catch (err) {
      setError('Failed to load settings');
      console.error('Settings fetch error:', err);
    }
  };

  const updatePrivacySettings = async (newSettings) => {
    try {
      await api.put('/users/preferences/privacy', newSettings);
      setSuccess('Privacy settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update privacy settings');
      console.error('Privacy update error:', err);
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      await api.put('/users/preferences/notifications', newSettings);
      setSuccess('Notification settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update notification settings');
      console.error('Notification update error:', err);
    }
  };

  const handlePrivacyChange = (key, value) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    updatePrivacySettings({ [key]: value });
  };

  const handleNotificationChange = (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    updateNotificationSettings({ [key]: value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      setSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? You can reactivate it later.')) {
      try {
        await api.post('/users/account/deactivate', {
          reason: 'User requested deactivation'
        });
        alert('Account deactivated successfully');
        // Redirect to login
        window.location.href = '/auth';
      } catch (err) {
        setError('Failed to deactivate account');
      }
    }
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'account', label: 'Account', icon: Settings }
  ];

  return (
    <div className="max-w-6xl p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4 space-x-4">
          <button
            onClick={onBack}
            className="p-2 transition-colors text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-pinterest"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-brand-600">Settings</h1>
            <p className="text-brand-500/70">Manage your account preferences and privacy settings</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="flex items-center p-4 mb-6 space-x-2 border border-green-200 bg-green-50 rounded-pinterest">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center p-4 mb-6 space-x-2 border bg-pinterest-red/10 border-pinterest-red/20 rounded-pinterest">
            <AlertTriangle className="w-5 h-5 text-pinterest-red" />
            <p className="text-sm font-medium text-pinterest-red">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1">
          <div className="p-4 border bg-white/90 backdrop-blur-xl rounded-pinterest-lg shadow-pinterest-lg border-brand-200/30">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-pinterest transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-brand-500 text-white'
                        : 'text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 lg:col-span-3">
          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <SettingsSection 
              title="Privacy Settings" 
              description="Control who can see your information and interact with you"
              icon={Shield}
            >
              <div className="space-y-4">
                <ToggleSetting
                  label="Public Profile"
                  description="Allow other users to view your profile information"
                  checked={privacySettings.isProfilePublic}
                  onChange={(value) => handlePrivacyChange('isProfilePublic', value)}
                />
                <ToggleSetting
                  label="Allow Messages from Anyone"
                  description="Receive messages from users you're not connected with"
                  checked={privacySettings.allowMessagesFromStrangers}
                  onChange={(value) => handlePrivacyChange('allowMessagesFromStrangers', value)}
                />
              </div>
            </SettingsSection>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <SettingsSection 
              title="Notification Preferences" 
              description="Choose how you want to be notified about activity"
              icon={Bell}
            >
              <div className="space-y-4">
                <ToggleSetting
                  label="Email Notifications"
                  description="Receive important updates and activity summaries via email"
                  checked={notificationSettings.emailNotificationsEnabled}
                  onChange={(value) => handleNotificationChange('emailNotificationsEnabled', value)}
                />
                <ToggleSetting
                  label="Push Notifications"
                  description="Get real-time notifications in your browser or mobile device"
                  checked={notificationSettings.pushNotificationsEnabled}
                  onChange={(value) => handleNotificationChange('pushNotificationsEnabled', value)}
                />
              </div>
            </SettingsSection>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <SettingsSection 
              title="Security" 
              description="Manage your password and account security"
              icon={Key}
            >
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                  rightIcon={showPasswords.current ? EyeOff : Eye}
                  onRightIconClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  required
                />
                
                <Input
                  label="New Password"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter your new password"
                  rightIcon={showPasswords.new ? EyeOff : Eye}
                  onRightIconClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  required
                  minLength={8}
                />
                
                <Input
                  label="Confirm New Password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your new password"
                  rightIcon={showPasswords.confirm ? EyeOff : Eye}
                  onRightIconClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  required
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Change Password</span>
                  </Button>
                </div>
              </form>
            </SettingsSection>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <SettingsSection 
                title="Account Management" 
                description="Manage your account status and data"
                icon={Settings}
              >
                <div className="space-y-4">
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-pinterest">
                    <h4 className="mb-2 font-medium text-yellow-800">Deactivate Account</h4>
                    <p className="mb-4 text-sm text-yellow-700">
                      Temporarily disable your account. You can reactivate it anytime by logging back in.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={handleDeactivateAccount}
                      className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                    >
                      Deactivate Account
                    </Button>
                  </div>

                  <div className="p-4 border border-red-200 bg-red-50 rounded-pinterest">
                    <h4 className="mb-2 font-medium text-red-800">Delete Account</h4>
                    <p className="mb-4 text-sm text-red-700">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="outline"
                      className="text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => alert('Account deletion feature coming soon')}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;