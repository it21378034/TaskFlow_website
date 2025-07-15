import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import AccountSettings from './components/AccountSettings';
import Preferences from './components/Preferences';
import Notifications from './components/Notifications';
import Security from './components/Security';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'preferences':
        return <Preferences />;
      case 'notifications':
        return <Notifications />;
      case 'security':
        return <Security />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          <div className="space-y-8">
            <ProfileHeader />
            
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <TabNavigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              
              <div className="p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;