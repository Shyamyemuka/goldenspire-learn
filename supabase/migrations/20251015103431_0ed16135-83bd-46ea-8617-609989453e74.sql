-- Create role enum
CREATE TYPE public.app_role AS ENUM ('master_admin', 'admin', 'teacher', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  is_approved BOOLEAN DEFAULT false,
  expertise TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create demo student accounts table for teachers
CREATE TABLE public.teacher_demo_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  demo_student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (teacher_id)
);

ALTER TABLE public.teacher_demo_accounts ENABLE ROW LEVEL SECURITY;

-- Create pending approvals table
CREATE TABLE public.pending_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_role app_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.pending_approvals ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, is_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'),
    false
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Master admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can view approved profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND is_approved = true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Master admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'master_admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Master admin can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'master_admin'));

-- RLS Policies for teacher_demo_accounts
CREATE POLICY "Teachers can view their demo account"
  ON public.teacher_demo_accounts FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create demo account"
  ON public.teacher_demo_accounts FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- RLS Policies for pending_approvals
CREATE POLICY "Master admin can view all pending approvals"
  ON public.pending_approvals FOR SELECT
  USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can view non-admin pending approvals"
  ON public.pending_approvals FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND requested_role != 'admin');

CREATE POLICY "Users can view their own pending approval"
  ON public.pending_approvals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create pending approval"
  ON public.pending_approvals FOR INSERT
  WITH CHECK (true);