-- Location: supabase/migrations/20250709122000_taskflow_auth_and_tasks.sql
-- TaskFlow Manager - Authentication and Task Management System

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.task_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- 2. Create user_profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'member'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status public.task_status DEFAULT 'pending'::public.task_status,
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    assignee_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create task_comments table
CREATE TABLE public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create activity_logs table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX idx_task_comments_author_id ON public.task_comments(author_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 9. Create helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_project_owner(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_uuid AND p.owner_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_task(task_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.tasks t
    LEFT JOIN public.projects p ON t.project_id = p.id
    WHERE t.id = task_uuid AND (
        t.assignee_id = auth.uid() OR
        p.owner_id = auth.uid() OR
        public.is_admin()
    )
)
$$;

-- 10. Create automatic profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- 11. Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create RLS policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_view_all_profiles" ON public.user_profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "users_manage_own_projects" ON public.projects FOR ALL
USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY "admins_manage_all_projects" ON public.projects FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "users_access_assigned_tasks" ON public.tasks FOR ALL
USING (public.can_access_task(id)) WITH CHECK (public.can_access_task(id));

CREATE POLICY "users_access_task_comments" ON public.task_comments FOR ALL
USING (
    author_id = auth.uid() OR
    public.can_access_task(task_id)
) WITH CHECK (
    author_id = auth.uid() OR
    public.can_access_task(task_id)
);

CREATE POLICY "users_own_activity_logs" ON public.activity_logs FOR ALL
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_view_all_activity_logs" ON public.activity_logs FOR SELECT
USING (public.is_admin());

-- 13. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 14. Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 15. Mock data for testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    member_uuid UUID := gen_random_uuid();
    project1_uuid UUID := gen_random_uuid();
    project2_uuid UUID := gen_random_uuid();
    task1_uuid UUID := gen_random_uuid();
    task2_uuid UUID := gen_random_uuid();
    task3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@taskflow.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@taskflow.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Manager User", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (member_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'member@taskflow.com', crypt('member123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Member User", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create projects
    INSERT INTO public.projects (id, name, description, owner_id) VALUES
        (project1_uuid, 'TaskFlow Development', 'Core development project for TaskFlow Manager application', admin_uuid),
        (project2_uuid, 'UI/UX Improvements', 'User interface and user experience enhancement project', manager_uuid);

    -- Create tasks
    INSERT INTO public.tasks (id, title, description, status, priority, assignee_id, project_id, due_date, tags) VALUES
        (task1_uuid, 'Implement user authentication system', 'Set up JWT-based authentication with login, registration, and password reset functionality', 'in-progress'::public.task_status, 'high'::public.task_priority, admin_uuid, project1_uuid, '2025-01-15'::timestamptz, '{"backend", "security", "urgent"}'),
        (task2_uuid, 'Design responsive dashboard layout', 'Create a mobile-first responsive design for the main dashboard with proper grid system', 'pending'::public.task_status, 'medium'::public.task_priority, manager_uuid, project2_uuid, '2025-01-18'::timestamptz, '{"frontend", "design", "responsive"}'),
        (task3_uuid, 'Database optimization and indexing', 'Optimize database queries and add proper indexing for better performance', 'completed'::public.task_status, 'high'::public.task_priority, member_uuid, project1_uuid, '2025-01-12'::timestamptz, '{"database", "performance", "optimization"}');

    -- Create task comments
    INSERT INTO public.task_comments (task_id, author_id, content) VALUES
        (task1_uuid, admin_uuid, 'Working on the authentication middleware implementation.'),
        (task1_uuid, manager_uuid, 'Please ensure proper error handling for invalid credentials.'),
        (task2_uuid, manager_uuid, 'Starting with the mobile layout first as discussed.'),
        (task3_uuid, member_uuid, 'Database indexing completed, performance improved by 40%.');

    -- Create activity logs
    INSERT INTO public.activity_logs (user_id, action_type, entity_type, entity_id, details) VALUES
        (admin_uuid, 'task_created', 'task', task1_uuid, '{"task_title": "Implement user authentication system"}'::jsonb),
        (manager_uuid, 'task_created', 'task', task2_uuid, '{"task_title": "Design responsive dashboard layout"}'::jsonb),
        (member_uuid, 'task_completed', 'task', task3_uuid, '{"task_title": "Database optimization and indexing"}'::jsonb),
        (admin_uuid, 'comment_added', 'task_comment', task1_uuid, '{"comment_content": "Working on the authentication middleware implementation."}'::jsonb);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 16. Create cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_ids UUID[];
BEGIN
    -- Get test user IDs
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM auth.users
    WHERE email LIKE '%@taskflow.com';

    -- Delete in dependency order
    DELETE FROM public.activity_logs WHERE user_id = ANY(test_user_ids);
    DELETE FROM public.task_comments WHERE author_id = ANY(test_user_ids);
    DELETE FROM public.tasks WHERE assignee_id = ANY(test_user_ids);
    DELETE FROM public.projects WHERE owner_id = ANY(test_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(test_user_ids);
    DELETE FROM auth.users WHERE id = ANY(test_user_ids);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;