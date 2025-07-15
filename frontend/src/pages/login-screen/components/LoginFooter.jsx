import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const LoginFooter = () => {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email address');
  };

  const handleCreateAccount = () => {
    navigate('/register-screen');
  };

  return (
    <div className="space-y-6">
      {/* Forgot Password Link */}
      <div className="text-center">
        <Button
          variant="link"
          size="sm"
          onClick={handleForgotPassword}
          className="text-primary hover:text-primary-700 transition-smooth"
        >
          Forgot your password?
        </Button>
      </div>

      {/* Create Account Section */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-text-secondary text-sm mb-3">
          Don't have an account?
        </p>
        <Button
          variant="outline"
          size="md"
          onClick={handleCreateAccount}
          className="w-full sm:w-auto"
        >
          Create Account
        </Button>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-6">
        <p className="text-xs text-text-muted">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
        <p className="text-xs text-text-muted mt-2">
          © {new Date().getFullYear()} TaskFlow Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;