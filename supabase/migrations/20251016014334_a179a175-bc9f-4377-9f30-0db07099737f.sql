-- Update RLS policies for hierarchical approval system

-- Drop ALL existing policies on pending_approvals
DROP POLICY IF EXISTS "Admins can view non-admin pending approvals" ON public.pending_approvals;
DROP POLICY IF EXISTS "Master admin can view all pending approvals" ON public.pending_approvals;
DROP POLICY IF EXISTS "Users can view their own pending approval" ON public.pending_approvals;
DROP POLICY IF EXISTS "Anyone can create pending approval" ON public.pending_approvals;

-- Create new hierarchical policies for pending_approvals
-- Teachers and admins can view student pending approvals
CREATE POLICY "Teachers and admins can view student pending approvals"
ON public.pending_approvals
FOR SELECT
USING (
  requested_role = 'student' AND 
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'master_admin'))
);

-- Master admin can view teacher and admin pending approvals
CREATE POLICY "Master admin can view teacher and admin pending approvals"
ON public.pending_approvals
FOR SELECT
USING (
  (requested_role IN ('teacher', 'admin') AND has_role(auth.uid(), 'master_admin'))
  OR
  (requested_role = 'student' AND has_role(auth.uid(), 'master_admin'))
);

-- Users can view their own pending approval
CREATE POLICY "Users can view their own pending approval"
ON public.pending_approvals
FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can create pending approval (for signup)
CREATE POLICY "Anyone can create pending approval"
ON public.pending_approvals
FOR INSERT
WITH CHECK (true);

-- Teachers and admins can delete student pending approvals
CREATE POLICY "Teachers and admins can delete student pending approvals"
ON public.pending_approvals
FOR DELETE
USING (
  requested_role = 'student' AND 
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'master_admin'))
);

-- Only master admin can delete teacher/admin pending approvals
CREATE POLICY "Master admin can delete teacher and admin pending approvals"
ON public.pending_approvals
FOR DELETE
USING (
  requested_role IN ('teacher', 'admin') AND has_role(auth.uid(), 'master_admin')
);

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Admins can view approved profiles" ON public.profiles;

-- Teachers and admins can view student profiles
CREATE POLICY "Teachers and admins can view student profiles"
ON public.profiles
FOR SELECT
USING (
  role = 'student' AND is_approved = true AND 
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'master_admin'))
);

-- Teachers and admins can update student profiles
CREATE POLICY "Teachers and admins can update student profiles"
ON public.profiles
FOR UPDATE
USING (
  role = 'student' AND 
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'master_admin'))
);

-- Only master admin can update teacher/admin profiles
CREATE POLICY "Master admin can update teacher and admin profiles"
ON public.profiles
FOR UPDATE
USING (
  role IN ('teacher', 'admin') AND has_role(auth.uid(), 'master_admin')
);

-- Create approval audit log table
CREATE TABLE IF NOT EXISTS public.approval_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approved_by uuid REFERENCES auth.users(id) NOT NULL,
  approved_user_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.approval_logs ENABLE ROW LEVEL SECURITY;

-- Master admin can view all logs
CREATE POLICY "Master admin can view all approval logs"
ON public.approval_logs
FOR SELECT
USING (has_role(auth.uid(), 'master_admin'));

-- Teachers and admins can view their student approval logs
CREATE POLICY "Teachers and admins can view their student approval logs"
ON public.approval_logs
FOR SELECT
USING (
  approved_by = auth.uid() AND role = 'student' AND
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'))
);

-- Teachers, admins, and master admin can insert logs
CREATE POLICY "Teachers and admins can create approval logs"
ON public.approval_logs
FOR INSERT
WITH CHECK (
  approved_by = auth.uid() AND
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'master_admin'))
);