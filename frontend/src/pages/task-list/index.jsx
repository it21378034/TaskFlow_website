import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import taskService from '../../utils/taskService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TaskToolbar from './components/TaskToolbar';
import TaskFilters from './components/TaskFilters';
import QuickTaskAdd from './components/QuickTaskAdd';
import TaskTable from './components/TaskTable';

const TaskList = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from Supabase
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);

      const result = await taskService.getTasks(activeFilters);
      
      if (result.success) {
        setTasks(result.data || []);
      } else {
        setError(result.error);
      }
      
      setIsLoading(false);
    };

    if (!authLoading) {
      loadTasks();
    }
  }, [user, authLoading, activeFilters]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        task.assignee?.full_name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (activeFilters.status && activeFilters.status.length > 0) {
      filtered = filtered.filter(task => activeFilters.status.includes(task.status));
    }

    // Apply priority filter
    if (activeFilters.priority && activeFilters.priority.length > 0) {
      filtered = filtered.filter(task => activeFilters.priority.includes(task.priority));
    }

    // Apply date range filter
    if (activeFilters.dateRange?.start && activeFilters.dateRange?.end) {
      const startDate = new Date(activeFilters.dateRange.start);
      const endDate = new Date(activeFilters.dateRange.end);
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    // Apply quick filters
    if (activeFilters.quickFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (activeFilters.quickFilter) {
        case 'overdue':
          filtered = filtered.filter(task => {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            return dueDate < today && task.status !== 'completed';
          });
          break;
        case 'today':
          filtered = filtered.filter(task => {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate.getTime() === today.getTime();
          });
          break;
        case 'unassigned':
          filtered = filtered.filter(task => !task.assignee_id);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'updated_at':
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, activeFilters, sortBy]);

  // Event handlers
  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredAndSortedTasks.map(task => task.id));
    }
  };

  const handleBulkComplete = async () => {
    setIsLoading(true);
    
    const updatePromises = selectedTasks.map(taskId => 
      taskService.updateTask(taskId, { status: 'completed' })
    );
    
    await Promise.all(updatePromises);
    
    // Refresh tasks
    const result = await taskService.getTasks(activeFilters);
    if (result.success) {
      setTasks(result.data || []);
    }
    
    setSelectedTasks([]);
    setIsLoading(false);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      setIsLoading(true);
      
      const deletePromises = selectedTasks.map(taskId => 
        taskService.deleteTask(taskId)
      );
      
      await Promise.all(deletePromises);
      
      // Refresh tasks
      const result = await taskService.getTasks(activeFilters);
      if (result.success) {
        setTasks(result.data || []);
      }
      
      setSelectedTasks([]);
      setIsLoading(false);
    }
  };

  const handleBulkAssign = () => {
    console.log('Bulk assign tasks:', selectedTasks);
    // Implementation for bulk assignment modal
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    const result = await taskService.updateTask(taskId, { status: newStatus });
    if (result.success) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    }
  };

  const handleTaskPriorityChange = async (taskId, newPriority) => {
    const result = await taskService.updateTask(taskId, { priority: newPriority });
    if (result.success) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, priority: newPriority } : task
      ));
    }
  };

  const handleTaskEdit = (taskId, updates) => {
    if (typeof taskId === 'object') {
      // Navigate to task detail page
      navigate('/task-detail', { state: { taskId: taskId.id || taskId } });
    } else if (updates) {
      // Update task inline
      taskService.updateTask(taskId, updates).then(result => {
        if (result.success) {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ));
        }
      });
    } else {
      // Navigate to task detail page
      navigate('/task-detail', { state: { taskId } });
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await taskService.deleteTask(taskId);
      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    }
  };

  const handleTaskAssign = (taskId) => {
    console.log('Assign task:', taskId);
    // Implementation for assignment modal
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const handleQuickAdd = async (taskData) => {
    const result = await taskService.createTask({
      ...taskData,
      assignee_id: user?.id
    });
    
    if (result.success) {
      setTasks(prev => [result.data, ...prev]);
      setShowQuickAdd(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login-screen');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                Task Management
              </h1>
              <p className="text-text-secondary">
                Organize, track, and complete your tasks efficiently with advanced filtering and collaboration tools.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-md p-4 mb-6">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Task Toolbar */}
            <TaskToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onQuickAdd={() => setShowQuickAdd(true)}
              totalTasks={tasks.length}
              filteredTasks={filteredAndSortedTasks.length}
            />

            {/* Task Filters */}
            <TaskFilters
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />

            {/* Quick Task Add */}
            <QuickTaskAdd
              onAdd={handleQuickAdd}
              onCancel={() => setShowQuickAdd(false)}
              isVisible={showQuickAdd}
            />

            {/* Task Table */}
            <div className="mt-6">
              <TaskTable
                tasks={filteredAndSortedTasks}
                selectedTasks={selectedTasks}
                onSelectTask={handleSelectTask}
                onSelectAll={handleSelectAll}
                onBulkComplete={handleBulkComplete}
                onBulkDelete={handleBulkDelete}
                onBulkAssign={handleBulkAssign}
                onTaskStatusChange={handleTaskStatusChange}
                onTaskPriorityChange={handleTaskPriorityChange}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onTaskAssign={handleTaskAssign}
                isLoading={isLoading}
              />
            </div>

            {/* Load More / Pagination */}
            {!isLoading && filteredAndSortedTasks.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-text-secondary mb-4">
                  Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
                </p>
                {filteredAndSortedTasks.length < tasks.length && (
                  <button className="px-6 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary-50 transition-smooth focus-ring">
                    Load More Tasks
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskList;