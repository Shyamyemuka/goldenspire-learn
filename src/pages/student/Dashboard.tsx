import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, FileText, Trophy, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const { data: enrollments = [] } = useQuery({
    queryKey: ['student-enrollments', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('student_id', session.user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Learners' LMS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/student/courses"><Button variant="ghost" size="sm">My Courses</Button></Link>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs flex items-center justify-center text-white">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Learning Dashboard 👋</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{enrollments.length}</div>
                <div className="text-sm text-muted-foreground">Enrolled Courses</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          {enrollments.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">Enroll in a course to get started</p>
              <Link to="/student/courses/browse">
                <Button>Browse Courses</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {enrollments.map((enrollment: any) => (
                <Card key={enrollment.id} className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-lg mb-2">{enrollment.courses.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{enrollment.courses.description}</p>
                  <Link to={`/student/courses/${enrollment.courses.id}`}>
                    <Button size="sm" className="w-full">View Course</Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
