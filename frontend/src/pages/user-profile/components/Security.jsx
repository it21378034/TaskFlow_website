import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const Security = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [activeSessions] = useState([
    {
      id: 1,
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
      ip: '192.168.1.101'
    },
    {
      id: 3,
      device: 'Windows PC',
      browser: 'Edge 120.0',
      location: 'Boston, MA',
      lastActive: '3 days ago',
      current: false,
      ip: '10.0.0.50'
    }
  ]);

  const passwordStrength = {
    score: 0,
    feedback: []
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('One special character');

    return { score, feedback };
  };

  const currentPasswordStrength = calculatePasswordStrength(passwordForm.newPassword);

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Changing password');
    // Handle password change
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      setTwoFactorEnabled(false);
      setShowQRCode(false);
    }
  };

  const handleTwoFactorVerify = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode('');
      console.log('2FA enabled');
    }
  };

  const handleSessionRevoke = (sessionId) => {
    console.log('Revoking session:', sessionId);
    // Handle session revocation
  };

  const handleAccountDelete = () => {
    if (deleteConfirmText === 'DELETE MY ACCOUNT') {
      console.log('Deleting account');
      // Handle account deletion
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  const getStrengthColor = (score) => {
    if (score <= 1) return 'bg-error';
    if (score <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthText = (score) => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Change Password</h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Password
            </label>
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter new password"
              required
            />
            
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1 bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getStrengthColor(currentPasswordStrength.score)}`}
                      style={{ width: `${(currentPasswordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    currentPasswordStrength.score <= 1 ? 'text-error' :
                    currentPasswordStrength.score <= 3 ? 'text-warning' : 'text-success'
                  }`}>
                    {getStrengthText(currentPasswordStrength.score)}
                  </span>
                </div>
                
                {currentPasswordStrength.feedback.length > 0 && (
                  <div className="text-xs text-text-secondary">
                    Missing: {currentPasswordStrength.feedback.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
              required
            />
            
            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-xs text-error mt-1">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            iconName="Lock"
            iconPosition="left"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || 
                     passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Two-Factor Authentication</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Two-Factor Authentication {twoFactorEnabled ? '(Enabled)' : '(Disabled)'}
              </p>
              <p className="text-xs text-text-secondary">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={twoFactorEnabled}
                onChange={handleTwoFactorToggle}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {showQRCode && (
            <div className="p-4 bg-secondary-50 rounded-lg">
              <div className="text-center space-y-4">
                <div className="w-48 h-48 bg-white border-2 border-border rounded-lg mx-auto flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="QrCode" size={64} className="text-text-muted mx-auto mb-2" />
                    <p className="text-xs text-text-secondary">QR Code would appear here</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">
                    Scan with your authenticator app
                  </p>
                  <p className="text-xs text-text-secondary mb-4">
                    Use Google Authenticator, Authy, or similar app to scan this QR code
                  </p>
                  
                  <div className="max-w-xs mx-auto">
                    <Input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center"
                    />
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleTwoFactorVerify}
                      disabled={verificationCode.length !== 6}
                      className="w-full mt-3"
                    >
                      Verify & Enable
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Active Sessions</h3>
        
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={session.device.includes('iPhone') ? 'Smartphone' : 'Monitor'} 
                    size={20} 
                    className="text-text-muted" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-text-primary">
                      {session.device}
                    </p>
                    {session.current && (
                      <span className="px-2 py-1 bg-success-100 text-success-600 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {session.browser} • {session.location}
                  </p>
                  <p className="text-xs text-text-muted">
                    {session.ip} • Last active {session.lastActive}
                  </p>
                </div>
              </div>
              
              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="LogOut"
                  iconPosition="left"
                  onClick={() => handleSessionRevoke(session.id)}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-error-50 border border-error-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-error">Delete Account</p>
              <p className="text-xs text-error-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            
            <Button
              variant="danger"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>

          {showDeleteConfirm && (
            <div className="p-4 bg-surface border border-error-300 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-error mb-2">
                      Are you absolutely sure?
                    </p>
                    <p className="text-xs text-error-600 mb-4">
                      This action cannot be undone. This will permanently delete your account,
                      all your tasks, and remove all associated data from our servers.
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-error mb-2">
                    Type "DELETE MY ACCOUNT" to confirm:
                  </label>
                  <Input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="mb-4"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleAccountDelete}
                    disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;