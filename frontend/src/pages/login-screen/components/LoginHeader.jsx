import React from 'react';


const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
          <svg
            width="24"
            height="24"
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
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            TaskFlow Manager
          </h1>
          <p className="text-sm text-text-secondary">
            Organize. Track. Achieve.
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-text-secondary">
          Sign in to your account to continue managing your tasks
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;