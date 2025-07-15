import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const TermsAndPrivacy = ({ onAgreementChange }) => {
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleAgreementChange = (type, checked) => {
    const newAgreements = {
      ...agreements,
      [type]: checked
    };
    setAgreements(newAgreements);
    
    // Notify parent component about required agreements
    const isValid = newAgreements.terms && newAgreements.privacy;
    onAgreementChange(isValid);
  };

  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50">
      <div className="bg-surface rounded-lg shadow-elevated max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Terms of Service</h2>
          <button
            onClick={() => setShowTermsModal(false)}
            className="p-2 rounded-md hover:bg-secondary-100 transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-medium text-text-primary mb-4">1. Acceptance of Terms</h3>
            <p className="text-text-secondary mb-4">
              By creating an account with TaskFlow Manager, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">2. User Accounts</h3>
            <p className="text-text-secondary mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">3. Acceptable Use</h3>
            <p className="text-text-secondary mb-4">
              You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">4. Data and Privacy</h3>
            <p className="text-text-secondary mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">5. Service Availability</h3>
            <p className="text-text-secondary mb-4">
              We strive to maintain service availability but cannot guarantee uninterrupted access to the platform.
            </p>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-border">
          <button
            onClick={() => setShowTermsModal(false)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-600 transition-smooth"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const PrivacyModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50">
      <div className="bg-surface rounded-lg shadow-elevated max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Privacy Policy</h2>
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="p-2 rounded-md hover:bg-secondary-100 transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-medium text-text-primary mb-4">Information We Collect</h3>
            <p className="text-text-secondary mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">How We Use Your Information</h3>
            <p className="text-text-secondary mb-4">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">Information Sharing</h3>
            <p className="text-text-secondary mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">Data Security</h3>
            <p className="text-text-secondary mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h3 className="text-lg font-medium text-text-primary mb-4">Your Rights</h3>
            <p className="text-text-secondary mb-4">
              You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.
            </p>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-border">
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-600 transition-smooth"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {/* Terms of Service Agreement */}
        <div className="flex items-start space-x-3">
          <Input
            type="checkbox"
            id="terms"
            checked={agreements.terms}
            onChange={(e) => handleAgreementChange('terms', e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-text-secondary leading-relaxed">
            I agree to the{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-primary hover:text-primary-600 underline transition-smooth"
            >
              Terms of Service
            </button>
            {' '}*
          </label>
        </div>

        {/* Privacy Policy Agreement */}
        <div className="flex items-start space-x-3">
          <Input
            type="checkbox"
            id="privacy"
            checked={agreements.privacy}
            onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="privacy" className="text-sm text-text-secondary leading-relaxed">
            I agree to the{' '}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-primary hover:text-primary-600 underline transition-smooth"
            >
              Privacy Policy
            </button>
            {' '}*
          </label>
        </div>

        {/* Marketing Communications (Optional) */}
        <div className="flex items-start space-x-3">
          <Input
            type="checkbox"
            id="marketing"
            checked={agreements.marketing}
            onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="marketing" className="text-sm text-text-secondary leading-relaxed">
            I would like to receive product updates and marketing communications via email (optional)
          </label>
        </div>

        {/* Required Fields Notice */}
        <div className="flex items-center space-x-2 text-xs text-text-muted">
          <Icon name="Info" size={14} />
          <span>* Required to create an account</span>
        </div>
      </div>

      {/* Modals */}
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}
    </>
  );
};

export default TermsAndPrivacy;