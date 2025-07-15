import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Notifications = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      taskAssigned: true,
      taskDue: true,
      taskCompleted: false,
      teamUpdates: true,
      weeklyDigest: true,
      systemUpdates: false
    },
    browser: {
      taskAssigned: true,
      taskDue: true,
      taskCompleted: false,
      teamUpdates: false,
      systemUpdates: false
    },
    mobile: {
      taskAssigned: true,
      taskDue: true,
      taskCompleted: false,
      teamUpdates: false,
      systemUpdates: false
    }
  });

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: '22:00',
    endTime: '08:00'
  });

  const notificationTypes = [
    {
      key: 'taskAssigned',
      label: 'Task Assigned',
      description: 'When a task is assigned to you',
      icon: 'UserPlus'
    },
    {
      key: 'taskDue',
      label: 'Task Due Soon',
      description: 'Reminders for upcoming due dates',
      icon: 'Clock'
    },
    {
      key: 'taskCompleted',
      label: 'Task Completed',
      description: 'When tasks you assigned are completed',
      icon: 'CheckCircle'
    },
    {
      key: 'teamUpdates',
      label: 'Team Updates',
      description: 'Updates from your team members',
      icon: 'Users'
    },
    {
      key: 'weeklyDigest',
      label: 'Weekly Digest',
      description: 'Summary of your weekly activity',
      icon: 'Mail',
      emailOnly: true
    },
    {
      key: 'systemUpdates',
      label: 'System Updates',
      description: 'Product updates and maintenance notices',
      icon: 'Settings'
    }
  ];

  const handleNotificationToggle = (channel, type) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type]
      }
    }));
  };

  const handleQuietHoursToggle = () => {
    setQuietHours(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setQuietHours(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving notification settings:', { notificationSettings, quietHours });
    // Save to API or localStorage
  };

  const handleTestNotification = (channel) => {
    console.log(`Testing ${channel} notification`);
    // Trigger test notification
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return 'Mail';
      case 'browser': return 'Monitor';
      case 'mobile': return 'Smartphone';
      default: return 'Bell';
    }
  };

  const getChannelLabel = (channel) => {
    switch (channel) {
      case 'email': return 'Email Notifications';
      case 'browser': return 'Browser Notifications';
      case 'mobile': return 'Mobile Push Notifications';
      default: return 'Notifications';
    }
  };

  return (
    <div className="space-y-8">
      {/* Notification Channels */}
      {Object.keys(notificationSettings).map((channel) => (
        <div key={channel} className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Icon name={getChannelIcon(channel)} size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">
                {getChannelLabel(channel)}
              </h3>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName="TestTube"
              iconPosition="left"
              onClick={() => handleTestNotification(channel)}
            >
              Test
            </Button>
          </div>

          <div className="space-y-4">
            {notificationTypes.map((type) => {
              if (type.emailOnly && channel !== 'email') return null;
              
              return (
                <div key={type.key} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <Icon name={type.icon} size={18} className="text-text-muted" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {type.label}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings[channel][type.key]}
                      onChange={() => handleNotificationToggle(channel, type.key)}
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quiet Hours */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Moon" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Quiet Hours</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Enable Quiet Hours</p>
              <p className="text-xs text-text-secondary">
                Pause non-urgent notifications during specified hours
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={quietHours.enabled}
                onChange={handleQuietHoursToggle}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Summary */}
      <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">
              Notification Summary
            </h4>
            <div className="text-xs text-primary-700 space-y-1">
              <p>• Email: {Object.values(notificationSettings.email).filter(Boolean).length} types enabled</p>
              <p>• Browser: {Object.values(notificationSettings.browser).filter(Boolean).length} types enabled</p>
              <p>• Mobile: {Object.values(notificationSettings.mobile).filter(Boolean).length} types enabled</p>
              {quietHours.enabled && (
                <p>• Quiet hours: {quietHours.startTime} - {quietHours.endTime}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          iconName="Save"
          iconPosition="left"
          onClick={handleSaveSettings}
        >
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default Notifications;