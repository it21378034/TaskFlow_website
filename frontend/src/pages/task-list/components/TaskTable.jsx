import React from 'react';
import TaskTableHeader from './TaskTableHeader';
import TaskTableRow from './TaskTableRow';

const TaskTable = ({ 
  tasks, 
  selectedTasks, 
  onSelectTask, 
  onSelectAll,
  onBulkComplete,
  onBulkDelete,
  onBulkAssign,
  onTaskStatusChange,
  onTaskPriorityChange,
  onTaskEdit,
  onTaskDelete,
  onTaskAssign,
  isLoading 
}) => {
  const isAllSelected = tasks.length > 0 && selectedTasks.length === tasks.length;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-md border border-border">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-secondary-200 rounded"></div>
              <div className="w-32 h-4 bg-secondary-200 rounded"></div>
            </div>
          </div>
          
          {/* Rows Skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-border">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-secondary-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-secondary-200 rounded"></div>
                  <div className="w-1/2 h-3 bg-secondary-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-secondary-200 rounded-full"></div>
                <div className="w-16 h-6 bg-secondary-200 rounded-full"></div>
                <div className="w-8 h-8 bg-secondary-200 rounded-full"></div>
                <div className="w-24 h-4 bg-secondary-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-surface rounded-md border border-border">
        <div className="px-6 py-12 text-center">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-text-muted"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No tasks found</h3>
          <p className="text-text-secondary mb-4">
            Get started by creating your first task or adjust your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-md border border-border overflow-hidden">
      <TaskTableHeader
        selectedTasks={selectedTasks}
        onSelectAll={onSelectAll}
        onBulkComplete={onBulkComplete}
        onBulkDelete={onBulkDelete}
        onBulkAssign={onBulkAssign}
        totalTasks={tasks.length}
        isAllSelected={isAllSelected}
      />
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Tags
              </th>
              <th className="w-20 px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {tasks.map((task) => (
              <TaskTableRow
                key={task.id}
                task={task}
                isSelected={selectedTasks.includes(task.id)}
                onSelect={onSelectTask}
                onStatusChange={onTaskStatusChange}
                onPriorityChange={onTaskPriorityChange}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onAssign={onTaskAssign}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;