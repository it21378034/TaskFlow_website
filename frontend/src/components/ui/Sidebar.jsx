import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and insights'
    },
    {
      label: 'Tasks',
      path: '/task-list',
      icon: 'CheckSquare',
      description: 'Manage your tasks'
    },
    {
      label: 'Profile',
      path: '/user-profile',
      icon: 'User',
      description: 'Account settings'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isAuthPage = location.pathname === '/login-screen' || location.pathname === '/register-screen';

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-999 lg:flex-col bg-surface border-r border-border transition-all duration-300 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col h-full pt-16">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                Navigation
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-secondary-100 transition-smooth focus-ring"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon 
                name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
                size={16} 
                className="text-text-muted"
              />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-smooth focus-ring group ${
                    isActive
                      ? 'bg-primary-50 text-primary border-r-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    className={`flex-shrink-0 ${
                      isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
                    }`}
                  />
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  {!isCollapsed && isActive && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="bg-secondary-50 rounded-md p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Lightbulb" size={16} className="text-accent" />
                  <p className="text-xs font-medium text-text-primary">Pro Tip</p>
                </div>
                <p className="text-xs text-text-secondary">
                  Use Ctrl+K to quickly search and navigate between tasks.
                </p>
              </div>
            ) : (
              <button
                className="w-full p-2 rounded-md hover:bg-secondary-100 transition-smooth focus-ring"
                title="Pro Tips"
              >
                <Icon name="Lightbulb" size={20} className="text-accent mx-auto" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      <div className="lg:hidden">
        {/* This will be handled by the Header component's mobile menu */}
      </div>
    </>
  );
};

export default Sidebar;