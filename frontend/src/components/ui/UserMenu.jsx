import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const UserMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    initials: 'JD'
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      icon: 'User',
      action: () => {
        navigate('/user-profile');
        setIsOpen(false);
      }
    },
    {
      label: 'Preferences',
      icon: 'Settings',
      action: () => {
        console.log('Opening preferences');
        setIsOpen(false);
      }
    },
    {
      label: 'Notifications',
      icon: 'Bell',
      action: () => {
        console.log('Opening notifications');
        setIsOpen(false);
      }
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => {
        console.log('Opening help');
        setIsOpen(false);
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      action: () => {
        navigate('/login-screen');
        setIsOpen(false);
      },
      variant: 'danger'
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* User Menu Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary-100 transition-smooth focus-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
          {userInfo.avatar ? (
            <img 
              src={userInfo.avatar} 
              alt={userInfo.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-primary">
              {userInfo.initials}
            </span>
          )}
        </div>

        {/* User Name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium text-text-primary truncate max-w-24">
          {userInfo.name}
        </span>

        {/* Dropdown Arrow */}
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-surface rounded-md shadow-elevated border border-border z-1001 animate-fade-in"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {userInfo.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt={userInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">
                    {userInfo.initials}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <div 
                    key={`divider-${index}`} 
                    className="border-t border-border my-2" 
                    role="separator"
                  />
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center w-full px-4 py-2.5 text-sm transition-smooth text-left ${
                    item.variant === 'danger' ?'text-error hover:bg-error-50 hover:text-error-600' :'text-text-primary hover:bg-secondary-50'
                  }`}
                  role="menuitem"
                >
                  <Icon 
                    name={item.icon} 
                    size={16} 
                    className={`mr-3 flex-shrink-0 ${
                      item.variant === 'danger' ? 'text-error' : 'text-text-muted'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-secondary-50">
            <p className="text-xs text-text-muted">
              TaskFlow Manager v2.1.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;