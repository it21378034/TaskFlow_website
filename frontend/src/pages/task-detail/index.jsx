import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TaskHeader from './components/TaskHeader';
import TaskEditor from './components/TaskEditor';
import TaskTabs from './components/TaskTabs';
import TaskSidebar from './components/TaskSidebar';

const TaskDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock task data
  const mockTask = {
    id: 1,
    title: "Implement user authentication system",
    description: `Design and implement a comprehensive user authentication system for the TaskFlow Manager application.\n\nThis task involves creating secure login/logout functionality, user registration, password reset capabilities, and session management. The system should support both email/password authentication and social login options.\n\nKey requirements:\n- Secure password hashing and storage\n- JWT token-based authentication\n- Email verification for new accounts\n- Password reset via email\n- Session timeout handling\n- Rate limiting for login attempts`,
    status: "in-progress",
    priority: "high",
    dueDate: "2024-02-15T18:00:00",
    createdAt: "2024-01-20T10:00:00",
    assignee: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com"
    },
    tags: ["authentication", "security", "backend"],
    project: "TaskFlow Manager",
    estimatedHours: 8,
    loggedHours: 5.5
  };

  useEffect(() => {
    // Simulate loading task data
    const loadTask = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTask(mockTask);
      setIsLoading(false);
    };

    loadTask();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTask(updatedTask);
    console.log('Task updated:', updatedTask);
    // Here you would typically make an API call to update the task
  };

  const handleBack = () => {
    navigate('/task-list');
  };

  const handleDuplicate = () => {
    console.log('Duplicating task:', task.id);
    // Implement task duplication logic
  };

  const handleArchive = () => {
    console.log('Archiving task:', task.id);
    // Implement task archiving logic
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      console.log('Deleting task:', task.id);
      // Implement task deletion logic
      navigate('/task-list');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:pl-64 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading task details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:pl-64 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-text-primary text-lg mb-2">Task not found</p>
              <p className="text-text-secondary mb-4">The task you're looking for doesn't exist or has been deleted.</p>
              <button
                onClick={handleBack}
                className="text-primary hover:text-primary-700 font-medium"
              >
                Back to Tasks
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        {/* Task Header */}
        <TaskHeader 
          task={task}
          onTaskUpdate={handleTaskUpdate}
          onBack={handleBack}
        />

        {/* Main Content */}
        <div className="p-6">
          <Breadcrumb />
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-8 space-y-6">
              {/* Task Editor */}
              <div className="bg-surface rounded-lg border border-border p-6">
                <TaskEditor 
                  task={task}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>

              {/* Task Tabs */}
              <TaskTabs 
                task={task}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-4">
              <TaskSidebar 
                task={task}
                onTaskUpdate={handleTaskUpdate}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;