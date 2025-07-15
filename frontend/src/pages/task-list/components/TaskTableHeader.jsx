import React from 'react';

import Button from '../../../components/ui/Button';

const TaskTableHeader = ({ 
  selectedTasks, 
  onSelectAll, 
  onBulkComplete, 
  onBulkDelete, 
  onBulkAssign,
  totalTasks,
  isAllSelected 
}) => {
  const hasSelectedTasks = selectedTasks.length > 0;

  return (
    <div className="bg-surface border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm text-text-secondary">
              {hasSelectedTasks ? `${selectedTasks.length} selected` : `${totalTasks} tasks`}
            </span>
          </div>

          {hasSelectedTasks && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <Button
                variant="ghost"
                size="sm"
                iconName="Check"
                onClick={onBulkComplete}
                className="text-success hover:bg-success-50"
              >
                Mark Complete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Users"
                onClick={onBulkAssign}
                className="text-primary hover:bg-primary-50"
              >
                Assign
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={onBulkDelete}
                className="text-error hover:bg-error-50"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-muted">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location.reload()}
            className="text-text-muted hover:text-text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskTableHeader;