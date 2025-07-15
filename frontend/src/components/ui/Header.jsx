import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login-screen');
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
    setIsUserMenuOpen(false);
  };

  const isAuthPage = location.pathname === '/login-screen' || location.pathname === '/register-screen';

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-border shadow-subtle">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-secondary-100 transition-smooth focus-ring"
            aria-label="Toggle mobile menu"
          >
            <Icon name="Menu" size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <svg
                width="20"
                height="20"
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
            <h1 className="text-xl font-heading font-semibold text-text-primary">
              TaskFlow Manager
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              />
              <Input
                type="search"
                placeholder="Search tasks, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`pl-10 pr-4 py-2 w-full bg-secondary-50 border-0 rounded-md transition-smooth ${
                  isSearchFocused ? 'bg-surface shadow-card' : ''
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-smooth"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search */}
          <button className="md:hidden p-2 rounded-md hover:bg-secondary-100 transition-smooth focus-ring">
            <Icon name="Search" size={20} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-md hover:bg-secondary-100 transition-smooth focus-ring">
            <Icon name="Bell" size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* Quick Add Task */}
          <Button
            variant="primary"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/task-detail')}
            className="hidden sm:flex"
          >
            New Task
          </Button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary-100 transition-smooth focus-ring"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
              )}
              <Icon name="ChevronDown" size={16} className="text-text-muted" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-elevated border border-border z-1001 animate-fade-in">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">
                      {userProfile?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-text-secondary">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-smooth"
                  >
                    <Icon name="User" size={16} className="mr-3" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-smooth"
                  >
                    <Icon name="Settings" size={16} className="mr-3" />
                    Preferences
                  </button>
                  
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-smooth"
                  >
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help & Support
                  </button>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-smooth"
                    >
                      <Icon name="LogOut" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-999 bg-secondary-900/50" onClick={handleMobileMenuToggle}>
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-surface shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                  />
                  <Input
                    type="search"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
              </form>
              
              <Button
                variant="primary"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={() => {
                  navigate('/task-detail');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
              >
                New Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;