import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskTabs = ({ task, onTaskUpdate }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'This task is looking good. I think we should focus on the user experience aspects.',
      timestamp: new Date(Date.now() - 3600000),
      avatar: null
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      content: 'Agreed! I\'ve added some initial wireframes to the attachments section.',
      timestamp: new Date(Date.now() - 1800000),
      avatar: null
    }
  ]);

  const [attachments] = useState([
    {
      id: 1,
      name: 'project-wireframes.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: new Date(Date.now() - 7200000)
    },
    {
      id: 2,
      name: 'design-mockup.png',
      size: '1.8 MB',
      type: 'image',
      uploadedBy: 'John Doe',
      uploadedAt: new Date(Date.now() - 3600000)
    }
  ]);

  const [activities] = useState([
    {
      id: 1,
      type: 'status_change',
      description: 'Status changed from Pending to In Progress',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      type: 'comment',
      description: 'Added a comment',
      user: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      type: 'attachment',
      description: 'Uploaded project-wireframes.pdf',
      user: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 7200000)
    }
  ]);

  const [subtasks, setSubtasks] = useState([
    {
      id: 1,
      title: 'Research user requirements',
      completed: true,
      assignee: 'John Doe'
    },
    {
      id: 2,
      title: 'Create initial wireframes',
      completed: true,
      assignee: 'Sarah Wilson'
    },
    {
      id: 3,
      title: 'Design user interface',
      completed: false,
      assignee: 'John Doe'
    }
  ]);

  const [newSubtask, setNewSubtask] = useState('');

  const tabs = [
    { id: 'comments', label: 'Comments', icon: 'MessageCircle', count: comments.length },
    { id: 'attachments', label: 'Attachments', icon: 'Paperclip', count: attachments.length },
    { id: 'activity', label: 'Activity', icon: 'Activity', count: activities.length },
    { id: 'subtasks', label: 'Subtasks', icon: 'CheckSquare', count: subtasks.length }
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        content: newComment.trim(),
        timestamp: new Date(),
        avatar: null
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: subtasks.length + 1,
        title: newSubtask.trim(),
        completed: false,
        assignee: 'You'
      };
      setSubtasks([...subtasks, subtask]);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (subtaskId) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    ));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'image': return 'Image';
      case 'document': return 'File';
      default: return 'File';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'status_change': return 'RefreshCw';
      case 'comment': return 'MessageCircle';
      case 'attachment': return 'Paperclip';
      default: return 'Activity';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary-50' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-secondary-50'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-primary text-white' :'bg-secondary-200 text-text-secondary'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-text-primary">
                        {comment.author}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="border-t border-border pt-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">Y</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Icon name="Upload" size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="secondary" size="sm">
                Choose Files
              </Button>
            </div>

            {/* Attachments List */}
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center space-x-3 p-3 border border-border rounded-md hover:bg-secondary-50">
                  <Icon name={getFileIcon(attachment.type)} size={20} className="text-text-muted" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{attachment.name}</p>
                    <p className="text-xs text-text-muted">
                      {attachment.size} • Uploaded by {attachment.uploadedBy} • {formatTimeAgo(attachment.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Download" />
                    <Button variant="ghost" size="sm" iconName="Trash2" className="text-error" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={getActivityIcon(activity.type)} size={14} className="text-text-muted" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      <span className="font-medium">{activity.user}</span> {activity.description}
                    </p>
                    <p className="text-xs text-text-muted">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subtasks' && (
          <div className="space-y-4">
            {/* Add Subtask */}
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
                iconName="Plus"
              >
                Add
              </Button>
            </div>

            {/* Subtasks List */}
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-3 p-3 border border-border rounded-md">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask.id)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      subtask.completed 
                        ? 'text-text-muted line-through' :'text-text-primary'
                    }`}>
                      {subtask.title}
                    </p>
                    <p className="text-xs text-text-muted">
                      Assigned to {subtask.assignee}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" iconName="Trash2" className="text-error" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTabs;