import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegistrationSuccess = ({ userEmail, onResendEmail }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail();
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary">
          Account Created Successfully!
        </h2>
        <p className="text-text-secondary">
          Welcome to TaskFlow Manager. We've sent a verification email to:
        </p>
        <p className="text-primary font-medium">{userEmail}</p>
      </div>

      {/* Email Verification Instructions */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
        <div className="flex items-start space-x-3">
          <Icon name="Mail" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium text-text-primary">Next Steps:</h3>
            <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
              <li>Check your email inbox for a verification message</li>
              <li>Click the verification link in the email</li>
              <li>Return here to access your dashboard</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Resend Email Section */}
      <div className="space-y-3">
        <p className="text-sm text-text-secondary">
          Didn't receive the email? Check your spam folder or:
        </p>
        
        <Button
          variant="outline"
          size="md"
          onClick={handleResendEmail}
          disabled={!canResend || isResending}
          loading={isResending}
          iconName="RefreshCw"
          iconPosition="left"
        >
          {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
        </Button>
      </div>

      {/* Continue to Dashboard */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-text-secondary mb-3">
          You can also continue to your dashboard and verify your email later:
        </p>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinueToDashboard}
          iconName="ArrowRight"
          iconPosition="right"
          fullWidth
        >
          Continue to Dashboard
        </Button>
      </div>

      {/* Help Section */}
      <div className="pt-4 text-center">
        <p className="text-xs text-text-muted">
          Need help? Contact our{' '}
          <button className="text-primary hover:text-primary-600 underline transition-smooth">
            support team
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;