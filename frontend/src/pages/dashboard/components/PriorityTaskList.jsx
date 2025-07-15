import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriorityTaskList = ({ tasks, onTaskUpdate, onTaskClick }) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Tasks', count: tasks.length },
    { value: 'my', label: 'My Tasks', count: tasks.filter(t => t.assignedTo === 'me').length },
    { value: 'team', label: 'Team Tasks', count: tasks.filter(t => t.assignedTo !== 'me').length }
  ];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'my') return task.assignedTo === 'me';
    if (filter === 'team') return task.assignedTo !== 'me';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error-50 border-error-200';
      case 'medium': return 'text-warning bg-warning-50 border-warning-200';
      case 'low': return 'text-success bg-success-50 border-success-200';
      default: return 'text-text-muted bg-secondary-50 border-secondary-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'pending': return 'Circle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'pending': return 'text-text-muted';
      default: return 'text-text-muted';
    }
  };

  const handleStatusToggle = (taskId, currentStatus) => {
    const statusFlow = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending'
    };
    
    onTaskUpdate(taskId, { status: statusFlow[currentStatus] });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Priority Tasks</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => onTaskClick('new')}
          >
            New Task
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                filter === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
              }`}
            >
              {option.label}
              <span className="ml-1 opacity-75">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="CheckSquare" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No tasks found</p>
            <p className="text-sm text-text-muted mt-1">Create your first task to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-secondary-50 transition-smooth cursor-pointer"
                onClick={() => onTaskClick(task.id)}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(task.id, task.status);
                    }}
                    className={`mt-0.5 ${getStatusColor(task.status)} hover:scale-110 transition-transform`}
                  >
                    <Icon name={getStatusIcon(task.status)} size={20} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${
                        task.status === 'completed' 
                          ? 'text-text-muted line-through' :'text-text-primary'
                      }`}>
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <div className="flex items-center space-x-4">
                        {task.dueDate && (
                          <span className={`flex items-center space-x-1 ${
                            isOverdue(task.dueDate) ? 'text-error' : ''
                          }`}>
                            <Icon name="Calendar" size={14} />
                            <span>{formatDueDate(task.dueDate)}</span>
                          </span>
                        )}
                        
                        {task.assignedTo && task.assignedTo !== 'me' && (
                          <span className="flex items-center space-x-1">
                            <Icon name="User" size={14} />
                            <span>{task.assignedTo}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {task.comments > 0 && (
                          <span className="flex items-center space-x-1">
                            <Icon name="MessageCircle" size={14} />
                            <span>{task.comments}</span>
                          </span>
                        )}
                        
                        {task.attachments > 0 && (
                          <span className="flex items-center space-x-1">
                            <Icon name="Paperclip" size={14} />
                            <span>{task.attachments}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityTaskList;