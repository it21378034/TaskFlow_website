import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import taskService from '../../utils/taskService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import QuickTaskForm from './components/QuickTaskForm';
import ActivityFeed from './components/ActivityFeed';
import PriorityTaskList from './components/PriorityTaskList';
import CalendarWidget from './components/CalendarWidget';
import UpcomingReminders from './components/UpcomingReminders';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Load tasks
        const tasksResult = await taskService.getTasks();
        if (tasksResult.success) {
          setTasks(tasksResult.data || []);
        } else {
          setError(tasksResult.error);
        }

        // Load statistics
        const statsResult = await taskService.getTaskStats();
        if (statsResult.success) {
          setStats(statsResult.data || {});
        }

        // Load activities
        const activitiesResult = await taskService.getRecentActivities(5);
        if (activitiesResult.success) {
          setActivities(activitiesResult.data || []);
        }

        // Mock reminders data (can be replaced with real data)
        const mockReminders = [
          {
            id: 1,
            type: "due_date",
            title: "Project proposal deadline",
            description: "Complete project proposal is due tomorrow",
            urgency: "high",
            scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: "meeting",
            title: "Team standup meeting",
            description: "Daily standup with the development team",
            urgency: "medium",
            scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            type: "follow_up",
            title: "Follow up on client feedback",
            description: "Check if client has reviewed the latest documentation",
            urgency: "low",
            scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setReminders(mockReminders);

      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  // Calculate metrics from stats
  const totalTasks = stats.total || 0;
  const completedToday = stats.completed || 0;
  const overdueTasks = stats.overdue || 0;
  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  const handleTaskCreate = async (newTask) => {
    const result = await taskService.createTask({
      ...newTask,
      assignee_id: user?.id
    });
    
    if (result.success) {
      setTasks(prev => [result.data, ...prev]);
      
      // Log activity
      await taskService.logActivity('task_created', 'task', result.data.id, {
        task_title: newTask.title
      });
      
      // Refresh activities
      const activitiesResult = await taskService.getRecentActivities(5);
      if (activitiesResult.success) {
        setActivities(activitiesResult.data || []);
      }
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    const result = await taskService.updateTask(taskId, updates);
    if (result.success) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));

      // Log activity for status changes
      if (updates.status) {
        const task = tasks.find(t => t.id === taskId);
        await taskService.logActivity(
          updates.status === 'completed' ? 'task_completed' : 'task_updated',
          'task',
          taskId,
          { task_title: task?.title }
        );
        
        // Refresh activities
        const activitiesResult = await taskService.getRecentActivities(5);
        if (activitiesResult.success) {
          setActivities(activitiesResult.data || []);
        }
      }
    }
  };

  const handleTaskClick = (taskId) => {
    if (taskId === 'new') {
      navigate('/task-detail');
    } else {
      navigate(`/task-detail?id=${taskId}`);
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
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
            <p className="text-text-secondary">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! Here's an overview of your tasks and activities.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-md p-4 mb-6">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Tasks"
              value={totalTasks}
              icon="CheckSquare"
              trend="neutral"
              trendValue={totalTasks.toString()}
              color="primary"
            />
            <MetricsCard
              title="Completed Today"
              value={completedToday}
              icon="CheckCircle"
              trend="up"
              trendValue={completedToday.toString()}
              color="success"
            />
            <MetricsCard
              title="Overdue"
              value={overdueTasks}
              icon="AlertTriangle"
              trend="down"
              trendValue={overdueTasks.toString()}
              color="error"
            />
            <MetricsCard
              title="Due This Week"
              value={upcomingTasks}
              icon="Calendar"
              trend="neutral"
              trendValue={upcomingTasks.toString()}
              color="warning"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Quick Actions & Activity */}
            <div className="lg:col-span-4 space-y-6">
              <QuickTaskForm onTaskCreate={handleTaskCreate} />
              <ActivityFeed activities={activities} />
            </div>

            {/* Center Column - Priority Tasks */}
            <div className="lg:col-span-5">
              <PriorityTaskList
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column - Calendar & Reminders */}
            <div className="lg:col-span-3 space-y-6">
              <CalendarWidget tasks={tasks} />
              <UpcomingReminders reminders={reminders} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;