import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskHeader = ({ task, onTaskUpdate, onBack }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onTaskUpdate({ ...task, title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(task.title);
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-600';
      case 'in-progress': return 'bg-warning-100 text-warning-600';
      case 'pending': return 'bg-secondary-100 text-secondary-600';
      default: return 'bg-secondary-100 text-secondary-600';
    }
  };

  return (
    <div className="bg-surface border-b border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          iconName="ArrowLeft"
          iconPosition="left"
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary"
        >
          Back to Tasks
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            iconName="Share"
            size="sm"
            className="text-text-secondary"
          >
            Share
          </Button>
          <Button
            variant="ghost"
            iconName="MoreHorizontal"
            size="sm"
            className="text-text-secondary"
          />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex-1 mr-6">
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-2xl font-semibold bg-transparent border-0 p-0 focus:ring-0"
                autoFocus
              />
              <Button
                variant="ghost"
                iconName="Check"
                size="sm"
                onClick={handleTitleSave}
                className="text-success"
              />
              <Button
                variant="ghost"
                iconName="X"
                size="sm"
                onClick={handleTitleCancel}
                className="text-error"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-semibold text-text-primary">
                {task.title}
              </h1>
              <Button
                variant="ghost"
                iconName="Edit2"
                size="sm"
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
            </span>
            
            <div className="flex items-center space-x-1">
              <Icon name="Flag" size={14} className={getPriorityColor(task.priority)} />
              <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>
            
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} className="text-text-muted" />
                <span className="text-sm text-text-secondary">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm text-text-secondary">
                Assigned to {task.assignee.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;