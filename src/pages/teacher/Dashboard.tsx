import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  BookOpen,
  Plus,
  Bell,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: courses = [] } = useQuery({
    queryKey: ['teacher-courses', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments(count)
        `)
        .eq('teacher_id', session.user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_approvals')
        .select('*')
        .eq('requested_role', 'student')
        .order('created_at', { ascending: false });
      
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
      {/* Navigation */}
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
              <Link to="/teacher/courses">
                <Button variant="ghost" size="sm">
                  My Courses
                </Button>
              </Link>
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
              <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">T</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Teacher! 👋</h1>
            <p className="text-muted-foreground">Manage your courses and engage with students</p>
          </div>
          <Link to="/teacher/courses/create">
            <Button size="lg" className="bg-gradient-gold hover:shadow-[var(--shadow-gold)]">
              <Plus className="mr-2 h-5 w-5" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{courses.reduce((sum, c: any) => sum + (c.enrollments?.[0]?.count || 0), 0)}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-sm text-muted-foreground">Active Courses</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Approvals Widget */}
        {pendingApprovals.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4">Pending Student Approvals</h3>
            <div className="space-y-3">
              {pendingApprovals.slice(0, 3).map((approval: any) => (
                <div key={approval.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{approval.full_name}</p>
                    <p className="text-sm text-muted-foreground">{approval.email}</p>
                  </div>
                  <Link to="/teacher/approvals">
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
              ))}
            </div>
            {pendingApprovals.length > 3 && (
              <Link to="/teacher/approvals">
                <Button variant="ghost" className="w-full mt-4">
                  View All ({pendingApprovals.length})
                </Button>
              </Link>
            )}
          </Card>
        )}

        {/* My Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Link to="/teacher/courses">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          {courses.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">Create your first course to get started</p>
              <Link to="/teacher/courses/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course: any) => (
                <Card
                  key={course.id}
                  className="overflow-hidden bg-card border-border hover:border-primary/40 transition-all hover:shadow-[var(--shadow-gold)] group"
                >
                  <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{course.enrollments?.[0]?.count || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}h</span>
                      </div>
                    </div>
                    <Link to={`/teacher/courses/${course.id}`}>
                      <Button variant="default" size="sm" className="w-full">
                        Manage Course
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Notifications</h2>
            <Card className="p-6 bg-card border-border">
              <div className="space-y-4">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
