import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = () => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    
    // Simulate social login process
    setTimeout(() => {
      // Mock successful social login
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', `user@${provider}.com`);
      navigate('/dashboard');
    }, 2000);
  };

  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50'
    },
    {
      name: 'Microsoft',
      icon: 'Square',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface text-text-muted">Or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            size="md"
            onClick={() => handleSocialLogin(provider.name.toLowerCase())}
            loading={loadingProvider === provider.name.toLowerCase()}
            disabled={loadingProvider !== null}
            className={`flex items-center justify-center space-x-2 ${provider.bgColor} transition-smooth`}
          >
            <Icon 
              name={provider.icon} 
              size={18} 
              className={provider.color}
            />
            <span className="text-text-primary">
              {loadingProvider === provider.name.toLowerCase() ? 'Connecting...' : provider.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;