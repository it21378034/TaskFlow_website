import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskSidebar = ({ task, onTaskUpdate, onDuplicate, onArchive, onDelete }) => {
  const relatedTasks = [
    {
      id: 2,
      title: 'Design user interface mockups',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Implement authentication system',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Write API documentation',
      status: 'completed',
      priority: 'low'
    }
  ];

  const timeTracking = {
    estimated: '8h',
    logged: '5h 30m',
    remaining: '2h 30m'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-600';
      case 'in-progress': return 'bg-warning-100 text-warning-600';
      case 'pending': return 'bg-secondary-100 text-secondary-600';
      default: return 'bg-secondary-100 text-secondary-600';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Task Metadata */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Task Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Status</span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Priority</span>
            <div className="flex items-center space-x-1">
              <Icon name="Flag" size={14} className={getPriorityColor(task.priority)} />
              <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Created</span>
            <span className="text-sm text-text-primary">
              {formatDate(task.createdAt)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Due Date</span>
            <span className="text-sm text-text-primary">
              {formatDate(task.dueDate)}
            </span>
          </div>
          
          {task.assignee && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Assignee</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-sm text-text-primary">{task.assignee.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Tracking */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Time Tracking</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Estimated</span>
            <span className="text-sm text-text-primary">{timeTracking.estimated}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Logged</span>
            <span className="text-sm text-text-primary">{timeTracking.logged}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Remaining</span>
            <span className="text-sm text-warning">{timeTracking.remaining}</span>
          </div>
          
          <div className="pt-2">
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <p className="text-xs text-text-muted mt-1">68% complete</p>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            iconName="Play"
            iconPosition="left"
            className="w-full mt-3"
          >
            Start Timer
          </Button>
        </div>
      </div>

      {/* Related Tasks */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Related Tasks</h3>
        <div className="space-y-3">
          {relatedTasks.map((relatedTask) => (
            <div key={relatedTask.id} className="p-3 border border-border rounded-md hover:bg-secondary-50 cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-text-primary font-medium line-clamp-2">
                  {relatedTask.title}
                </p>
                <Icon name="ExternalLink" size={14} className="text-text-muted flex-shrink-0 ml-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(relatedTask.status)}`}>
                  {relatedTask.status.charAt(0).toUpperCase() + relatedTask.status.slice(1).replace('-', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="Flag" size={12} className={getPriorityColor(relatedTask.priority)} />
                  <span className={`text-xs ${getPriorityColor(relatedTask.priority)}`}>
                    {relatedTask.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="secondary"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            onClick={onDuplicate}
            className="w-full justify-start"
          >
            Duplicate Task
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            iconName="Archive"
            iconPosition="left"
            onClick={onArchive}
            className="w-full justify-start"
          >
            Archive Task
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            iconName="Share"
            iconPosition="left"
            className="w-full justify-start"
          >
            Share Task
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            iconName="Download"
            iconPosition="left"
            className="w-full justify-start"
          >
            Export Task
          </Button>
          
          <div className="border-t border-border pt-2 mt-3">
            <Button
              variant="danger"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={onDelete}
              className="w-full justify-start"
            >
              Delete Task
            </Button>
          </div>
        </div>
      </div>

      {/* Collaboration */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Currently Viewing</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
            <span className="text-sm text-text-primary">You</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary">SW</span>
            </div>
            <span className="text-sm text-text-primary">Sarah Wilson</span>
            <div className="w-2 h-2 bg-success rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSidebar;