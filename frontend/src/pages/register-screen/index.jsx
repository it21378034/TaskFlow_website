import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import BrandHeader from './components/BrandHeader';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';
import TermsAndPrivacy from './components/TermsAndPrivacy';
import RegistrationSuccess from './components/RegistrationSuccess';

const RegisterScreen = () => {
  const [isAgreementValid, setIsAgreementValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleAgreementChange = (isValid) => {
    setIsAgreementValid(isValid);
  };

  const handleRegistrationSuccess = (email) => {
    setUserEmail(email);
    setShowSuccess(true);
  };

  const handleResendEmail = async () => {
    // Simulate resending verification email
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Verification email resent to:', userEmail);
        resolve();
      }, 1000);
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Helmet>
          <title>Registration Successful - TaskFlow Manager</title>
          <meta name="description" content="Account created successfully. Please verify your email to continue." />
        </Helmet>
        
        <div className="w-full max-w-md">
          <div className="bg-surface rounded-lg shadow-card p-6 sm:p-8">
            <RegistrationSuccess 
              userEmail={userEmail}
              onResendEmail={handleResendEmail}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Helmet>
        <title>Create Account - TaskFlow Manager</title>
        <meta name="description" content="Create your TaskFlow Manager account to start organizing and managing your tasks efficiently." />
        <meta name="keywords" content="register, sign up, create account, task management, productivity" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg shadow-card p-6 sm:p-8">
          {/* Brand Header */}
          <BrandHeader />

          {/* Registration Form */}
          <div className="space-y-6">
            <RegistrationForm 
              onSuccess={handleRegistrationSuccess}
              isAgreementValid={isAgreementValid}
            />

            {/* Terms and Privacy Agreements */}
            <TermsAndPrivacy onAgreementChange={handleAgreementChange} />

            {/* Social Registration */}
            <SocialRegistration />
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-muted">
              By creating an account, you agree to our terms and privacy policy.
              <br />
              © {new Date().getFullYear()} TaskFlow Manager. All rights reserved.
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Need assistance?{' '}
            <button className="text-primary hover:text-primary-600 underline transition-smooth">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;