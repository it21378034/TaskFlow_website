import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created': return 'Plus';
      case 'task_completed': return 'CheckCircle';
      case 'task_updated': return 'Edit';
      case 'task_deleted': return 'Trash2';
      case 'comment_added': return 'MessageCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created': return 'text-primary';
      case 'task_completed': return 'text-success';
      case 'task_updated': return 'text-warning';
      case 'task_deleted': return 'text-error';
      case 'comment_added': return 'text-accent';
      default: return 'text-text-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary-600 transition-smooth">
          View All
        </button>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-secondary-50 transition-smooth">
              <div className={`p-2 rounded-full bg-secondary-100 ${getActivityColor(activity.type)}`}>
                <Icon name={getActivityIcon(activity.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{activity.user}</span>
                  {' '}
                  <span className="text-text-secondary">{activity.action}</span>
                  {activity.taskTitle && (
                    <span className="font-medium text-text-primary">
                      {' "'}
                      <span className="truncate">{activity.taskTitle}</span>
                      {'"'}
                    </span>
                  )}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;