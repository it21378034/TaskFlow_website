import { supabase } from './supabase';

// Only keep API call functions for tasks here. Remove all mongoose and Express code.

// Example (replace with your actual API calls if using backend):
export async function getTasks() {
  const res = await fetch('http://localhost:5000/tasks');
  return res.json();
}

export async function addTask(task) {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}


const taskService = {
  // Get all tasks with optional filtering
  async getTasks(filters = {}) {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignee:assignee_id(id, full_name, email, avatar_url),
          project:project_id(id, name, description)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.assignee_id) {
        query = query.eq('assignee_id', filters.assignee_id);
      }
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong loading tasks. Please try again.' };
    }
  },

  // Get single task by ID
  async getTask(taskId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assignee_id(id, full_name, email, avatar_url),
          project:project_id(id, name, description),
          comments:task_comments(
            id,
            content,
            created_at,
            author:author_id(id, full_name, email, avatar_url)
          )
        `)
        .eq('id', taskId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong loading task. Please try again.' };
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select(`
          *,
          assignee:assignee_id(id, full_name, email, avatar_url),
          project:project_id(id, name, description)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong creating task. Please try again.' };
    }
  },

  // Update task
  async updateTask(taskId, updates) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select(`
          *,
          assignee:assignee_id(id, full_name, email, avatar_url),
          project:project_id(id, name, description)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong updating task. Please try again.' };
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong deleting task. Please try again.' };
    }
  },

  // Get task statistics
  async getTaskStats() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('status, priority, created_at, due_date');

      if (error) {
        return { success: false, error: error.message };
      }

      const stats = {
        total: data.length,
        completed: data.filter(task => task.status === 'completed').length,
        pending: data.filter(task => task.status === 'pending').length,
        inProgress: data.filter(task => task.status === 'in-progress').length,
        high: data.filter(task => task.priority === 'high').length,
        medium: data.filter(task => task.priority === 'medium').length,
        low: data.filter(task => task.priority === 'low').length,
        overdue: data.filter(task => {
          if (!task.due_date || task.status === 'completed') return false;
          return new Date(task.due_date) < new Date();
        }).length
      };

      return { success: true, data: stats };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong loading statistics. Please try again.' };
    }
  },

  // Add comment to task
  async addTaskComment(taskId, content) {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          content,
          author_id: (await supabase.auth.getUser()).data.user.id
        })
        .select(`
          *,
          author:author_id(id, full_name, email, avatar_url)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong adding comment. Please try again.' };
    }
  },

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id(id, full_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong loading activities. Please try again.' };
    }
  },

  // Log activity
  async logActivity(actionType, entityType, entityId, details = {}) {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user.id,
          action_type: actionType,
          entity_type: entityType,
          entity_id: entityId,
          details
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Something went wrong logging activity. Please try again.' };
    }
  },

  // Get projects
  async getProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:owner_id(id, full_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong loading projects. Please try again.' };
    }
  },

  // Get users for assignment
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, avatar_url, role')
        .order('full_name', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Something went wrong loading users. Please try again.' };
    }
  }
  
};

export default taskService;