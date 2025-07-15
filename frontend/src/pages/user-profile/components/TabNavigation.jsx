import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'account',
      label: 'Account Settings',
      icon: 'User',
      description: 'Personal information and profile'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      description: 'Theme, language, and defaults'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Email, browser, and mobile alerts'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Password, 2FA, and sessions'
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-2 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-3 p-4 rounded-md text-left transition-smooth focus-ring ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-card'
                : 'text-text-primary hover:bg-secondary-50'
            }`}
          >
            <Icon
              name={tab.icon}
              size={20}
              className={activeTab === tab.id ? 'text-white' : 'text-text-muted'}
            />
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                activeTab === tab.id ? 'text-white' : 'text-text-primary'
              }`}>
                {tab.label}
              </p>
              <p className={`text-xs truncate ${
                activeTab === tab.id ? 'text-primary-100' : 'text-text-secondary'
              }`}>
                {tab.description}
              </p>
            </div>
            
            {activeTab === tab.id && (
              <Icon name="Check" size={16} className="text-white flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;