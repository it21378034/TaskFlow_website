import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuickTaskAdd = ({ onAdd, onCancel, isVisible }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: 'current-user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskData.title.trim()) {
      onAdd({
        ...taskData,
        id: Date.now(),
        status: 'pending',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        commentCount: 0,
        hasAttachments: false
      });
      setTaskData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignee: 'current-user'
      });
      onCancel();
    }
  };

  const handleCancel = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignee: 'current-user'
    });
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-surface border-b border-border animate-fade-in">
      <form onSubmit={handleSubmit} className="px-6 py-4">
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <Input
              type="text"
              placeholder="Enter task title..."
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full text-base font-medium"
              autoFocus
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <textarea
              placeholder="Add description (optional)..."
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              rows="2"
            />
          </div>

          {/* Quick Options */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Priority */}
            <div className="flex items-center space-x-2">
              <Icon name="Flag" size={16} className="text-text-muted" />
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="px-2 py-1 text-sm border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-text-muted" />
              <Input
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                className="text-sm"
              />
            </div>

            {/* Assignee */}
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} className="text-text-muted" />
              <select
                value={taskData.assignee}
                onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                className="px-2 py-1 text-sm border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="current-user">Assign to me</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-johnson">Mike Johnson</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconName="Paperclip"
                className="text-text-muted hover:text-text-primary"
              >
                Attach
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconName="Tag"
                className="text-text-muted hover:text-text-primary"
              >
                Tags
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-text-muted hover:text-text-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                iconName="Plus"
                disabled={!taskData.title.trim()}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuickTaskAdd;