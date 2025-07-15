import React from 'react';
import { useNavigate } from 'react-router-dom';


const BrandHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-card">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
        TaskFlow Manager
      </h1>

      {/* Tagline */}
      <p className="text-text-secondary text-sm sm:text-base mb-6">
        Create your account to start organizing your tasks efficiently
      </p>

      {/* Back to Login Link */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <span className="text-text-secondary">Already have an account?</span>
        <button
          onClick={() => navigate('/login-screen')}
          className="text-primary hover:text-primary-600 font-medium transition-smooth focus-ring rounded px-1 py-0.5"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
};

export default BrandHeader;