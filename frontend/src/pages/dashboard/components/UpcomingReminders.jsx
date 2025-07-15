import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingReminders = ({ reminders }) => {
  const formatReminderTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((date - now) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'In less than 1 hour';
    if (diffInHours < 24) return `In ${diffInHours} hours`;
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `In ${diffInDays} days`;
    return date.toLocaleDateString();
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'due_date': return 'Calendar';
      case 'meeting': return 'Users';
      case 'deadline': return 'Clock';
      case 'follow_up': return 'ArrowRight';
      default: return 'Bell';
    }
  };

  const getReminderColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error bg-error-50 border-l-error';
      case 'medium': return 'text-warning bg-warning-50 border-l-warning';
      case 'low': return 'text-success bg-success-50 border-l-success';
      default: return 'text-text-muted bg-secondary-50 border-l-secondary-300';
    }
  };

  const handleReminderClick = (reminderId) => {
    console.log('Reminder clicked:', reminderId);
  };

  const handleSnoozeReminder = (reminderId, e) => {
    e.stopPropagation();
    console.log('Snoozing reminder:', reminderId);
  };

  const handleDismissReminder = (reminderId, e) => {
    e.stopPropagation();
    console.log('Dismissing reminder:', reminderId);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Upcoming Reminders</h3>
        <button className="text-sm text-primary hover:text-primary-600 transition-smooth">
          Manage All
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {reminders.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No upcoming reminders</p>
            <p className="text-sm text-text-muted mt-1">You're all caught up!</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              onClick={() => handleReminderClick(reminder.id)}
              className={`p-3 rounded-md border-l-4 cursor-pointer transition-smooth hover:shadow-subtle ${getReminderColor(reminder.urgency)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="mt-0.5">
                    <Icon 
                      name={getReminderIcon(reminder.type)} 
                      size={16} 
                      className="text-current"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {reminder.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {formatReminderTime(reminder.scheduledFor)}
                    </p>
                    {reminder.description && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">
                        {reminder.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => handleSnoozeReminder(reminder.id, e)}
                    className="p-1 rounded-md hover:bg-secondary-100 transition-smooth"
                    title="Snooze for 1 hour"
                  >
                    <Icon name="Clock" size={14} className="text-text-muted" />
                  </button>
                  <button
                    onClick={(e) => handleDismissReminder(reminder.id, e)}
                    className="p-1 rounded-md hover:bg-secondary-100 transition-smooth"
                    title="Dismiss reminder"
                  >
                    <Icon name="X" size={14} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {reminders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{reminders.length} upcoming reminders</span>
            <button className="text-primary hover:text-primary-600 transition-smooth">
              Set New Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingReminders;