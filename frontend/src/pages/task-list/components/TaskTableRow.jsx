import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskTableRow = ({ 
  task, 
  isSelected, 
  onSelect, 
  onStatusChange, 
  onPriorityChange,
  onEdit,
  onDelete,
  onAssign
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showActions, setShowActions] = useState(false);

  const handleTitleEdit = () => {
    if (isEditing) {
      onEdit(task.id, { title: editTitle });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error-50 border-error-200';
      case 'medium': return 'text-warning bg-warning-50 border-warning-200';
      case 'low': return 'text-success bg-success-50 border-success-200';
      default: return 'text-text-muted bg-secondary-50 border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success-50 border-success-200';
      case 'in-progress': return 'text-primary bg-primary-50 border-primary-200';
      case 'pending': return 'text-warning bg-warning-50 border-warning-200';
      default: return 'text-text-muted bg-secondary-50 border-border';
    }
  };

  const getDueDateColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-error';
    if (diffDays === 0) return 'text-warning';
    if (diffDays <= 3) return 'text-accent';
    return 'text-text-secondary';
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString();
  };

  return (
    <tr 
      className={`border-b border-border hover:bg-secondary-50 transition-smooth ${
        isSelected ? 'bg-primary-50' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Checkbox */}
      <td className="w-12 px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
        />
      </td>

      {/* Task Title */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleTitleEdit}
                className="w-full px-2 py-1 text-sm border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTitleEdit}
                  className="text-left hover:text-primary transition-smooth focus-ring rounded px-1"
                >
                  <h3 className="font-medium text-text-primary">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-text-secondary truncate max-w-md">
                      {task.description}
                    </p>
                  )}
                </button>
                {task.hasAttachments && (
                  <Icon name="Paperclip" size={14} className="text-text-muted" />
                )}
                {task.commentCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageCircle" size={14} className="text-text-muted" />
                    <span className="text-xs text-text-muted">{task.commentCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)} focus:ring-2 focus:ring-primary focus:border-primary`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </td>

      {/* Priority */}
      <td className="px-6 py-4">
        <select
          value={task.priority}
          onChange={(e) => onPriorityChange(task.id, e.target.value)}
          className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)} focus:ring-2 focus:ring-primary focus:border-primary`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </td>

      {/* Assignee */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
            {task.assignee.avatar ? (
              <img 
                src={task.assignee.avatar} 
                alt={task.assignee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-primary">
                {task.assignee.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <span className="text-sm text-text-primary hidden md:block">
            {task.assignee.name}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-6 py-4">
        <div className="text-sm">
          <span className={getDueDateColor(task.dueDate)}>
            {formatDueDate(task.dueDate)}
          </span>
          <div className="text-xs text-text-muted">
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
      </td>

      {/* Tags */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-full"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-full">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 w-20">
        <div className={`flex items-center space-x-1 transition-opacity ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onEdit(task.id)}
            className="text-text-muted hover:text-primary"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Users"
            onClick={() => onAssign(task.id)}
            className="text-text-muted hover:text-primary"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={() => onDelete(task.id)}
            className="text-text-muted hover:text-error"
          />
        </div>
      </td>
    </tr>
  );
};

export default TaskTableRow;