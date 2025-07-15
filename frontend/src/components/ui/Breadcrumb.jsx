import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard': { label: 'Dashboard', parent: null },
    '/task-list': { label: 'Tasks', parent: '/dashboard' },
    '/task-detail': { label: 'Task Details', parent: '/task-list' },
    '/user-profile': { label: 'Profile', parent: '/dashboard' }
  };

  const generateBreadcrumbs = () => {
    const currentPath = location.pathname;
    const breadcrumbs = [];
    
    // Always start with Dashboard for authenticated pages
    if (currentPath !== '/dashboard' && pathMap[currentPath]) {
      breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
    }

    // Add parent paths
    const currentPage = pathMap[currentPath];
    if (currentPage) {
      if (currentPage.parent && currentPage.parent !== '/dashboard') {
        const parentPage = pathMap[currentPage.parent];
        if (parentPage) {
          breadcrumbs.push({ label: parentPage.label, path: currentPage.parent });
        }
      }
      
      // Add current page (not clickable)
      breadcrumbs.push({ label: currentPage.label, path: currentPath, current: true });
    }

    return breadcrumbs;
  };

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  const isAuthPage = location.pathname === '/login-screen' || location.pathname === '/register-screen';
  
  if (isAuthPage) {
    return null;
  }

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-text-muted mx-2" 
                aria-hidden="true"
              />
            )}
            
            {breadcrumb.current ? (
              <span 
                className="text-text-primary font-medium"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <button
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                className="text-text-secondary hover:text-primary transition-smooth focus-ring rounded px-1 py-0.5"
              >
                {breadcrumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;