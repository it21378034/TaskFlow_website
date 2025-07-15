import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskEditor = ({ task, onTaskUpdate }) => {
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [tags, setTags] = useState(task.tags || []);
  const [newTag, setNewTag] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'in-progress', label: 'In Progress', icon: 'Play' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-success' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-error' }
  ];

  const handleSave = () => {
    const updatedTask = {
      ...task,
      description,
      status,
      priority,
      dueDate,
      tags
    };
    onTaskUpdate(updatedTask);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Description Editor */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <div className="border border-border rounded-md">
          <div className="flex items-center justify-between p-2 border-b border-border bg-secondary-50">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" iconName="Bold" className="text-text-muted" />
              <Button variant="ghost" size="sm" iconName="Italic" className="text-text-muted" />
              <Button variant="ghost" size="sm" iconName="Underline" className="text-text-muted" />
              <div className="w-px h-4 bg-border mx-1"></div>
              <Button variant="ghost" size="sm" iconName="List" className="text-text-muted" />
              <Button variant="ghost" size="sm" iconName="Link" className="text-text-muted" />
            </div>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a detailed description..."
            className="w-full p-3 border-0 resize-none focus:ring-0 focus:outline-none min-h-32"
            rows={6}
          />
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Status
          </label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <Icon name={option.icon} size={16} className="text-text-muted" />
                <span className="text-sm text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Priority
          </label>
          <div className="space-y-2">
            {priorityOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={priority === option.value}
                  onChange={(e) => setPriority(e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <Icon name="Flag" size={16} className={option.color} />
                <span className="text-sm text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Due Date
        </label>
        <Input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 text-primary text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-primary hover:text-primary-700"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a tag..."
            className="max-w-xs"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            Add Tag
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          variant="primary"
          onClick={handleSave}
          iconName="Save"
          iconPosition="left"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TaskEditor;