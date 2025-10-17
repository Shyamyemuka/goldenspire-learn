-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', false);

-- Create storage bucket for assignment submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-submissions', 'assignment-submissions', false);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  duration INTEGER, -- duration in hours
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  grade DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(assignment_id, student_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'assignment', 'grade', 'course', 'enrollment'
  related_id UUID, -- ID of related entity (assignment, course, etc)
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Teachers can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = teacher_id AND has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can view their own courses"
  ON public.courses FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view courses they're enrolled in"
  ON public.courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = courses.id
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their own courses"
  ON public.courses FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own courses"
  ON public.courses FOR DELETE
  USING (auth.uid() = teacher_id);

-- RLS Policies for enrollments
CREATE POLICY "Students can enroll in courses"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id AND has_role(auth.uid(), 'student'));

CREATE POLICY "Students can view their enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view enrollments in their courses"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = enrollments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- RLS Policies for assignments
CREATE POLICY "Teachers can create assignments for their courses"
  ON public.assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view assignments for their courses"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view assignments for enrolled courses"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = assignments.course_id
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their course assignments"
  ON public.assignments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete their course assignments"
  ON public.assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- RLS Policies for submissions
CREATE POLICY "Students can submit assignments"
  ON public.submissions FOR INSERT
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.assignments a ON a.course_id = e.course_id
      WHERE a.id = assignment_id
      AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their course assignments"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update submissions (grading)"
  ON public.submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Storage policies for course materials
CREATE POLICY "Teachers can upload course materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers can view their course materials"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can view course materials for enrolled courses"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-materials');

-- Storage policies for assignment submissions
CREATE POLICY "Students can upload assignment submissions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assignment-submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can view their own submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assignment-submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers can view all assignment submissions"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assignment-submissions');

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();