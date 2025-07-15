import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange,
  onQuickAdd,
  totalTasks,
  filteredTasks 
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const viewModes = [
    { value: 'list', label: 'List', icon: 'List' },
    { value: 'grid', label: 'Grid', icon: 'Grid3X3' },
    { value: 'board', label: 'Board', icon: 'Columns' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date', icon: 'Calendar' },
    { value: 'priority', label: 'Priority', icon: 'AlertTriangle' },
    { value: 'status', label: 'Status', icon: 'CheckCircle' },
    { value: 'title', label: 'Alphabetical', icon: 'AlphabeticalSort' },
    { value: 'created', label: 'Date Created', icon: 'Clock' },
    { value: 'updated', label: 'Last Updated', icon: 'RefreshCw' }
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Sort';
  };

  return (
    <div className="bg-surface border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - View Controls */}
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-secondary-100 rounded-md p-1">
            {viewModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onViewModeChange(mode.value)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-smooth ${
                  viewMode === mode.value
                    ? 'bg-surface text-primary shadow-subtle'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title={mode.label}
              >
                <Icon name={mode.icon} size={16} />
                <span className="hidden sm:block">{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Task Count */}
          <div className="text-sm text-text-secondary">
            {filteredTasks !== totalTasks ? (
              <span>
                {filteredTasks} of {totalTasks} tasks
              </span>
            ) : (
              <span>{totalTasks} tasks</span>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowUpDown"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="text-text-muted hover:text-text-primary"
            >
              <span className="hidden sm:inline ml-2">{getCurrentSortLabel()}</span>
            </Button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-elevated border border-border z-1001 animate-fade-in">
                <div className="py-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm transition-smooth ${
                        sortBy === option.value
                          ? 'bg-primary-50 text-primary' :'text-text-primary hover:bg-secondary-50'
                      }`}
                    >
                      <Icon name={option.icon} size={16} className="mr-3" />
                      {option.label}
                      {sortBy === option.value && (
                        <Icon name="Check" size={16} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Task */}
          <Button
            variant="primary"
            size="sm"
            iconName="Plus"
            onClick={onQuickAdd}
            className="hidden sm:flex"
          >
            Add Task
          </Button>

          {/* Mobile Add Button */}
          <Button
            variant="primary"
            size="sm"
            iconName="Plus"
            onClick={onQuickAdd}
            className="sm:hidden"
          />

          {/* More Actions */}
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            className="text-text-muted hover:text-text-primary"
          />
        </div>
      </div>

      {/* Click outside handler for sort menu */}
      {showSortMenu && (
        <div
          className="fixed inset-0 z-1000"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
};

export default TaskToolbar;