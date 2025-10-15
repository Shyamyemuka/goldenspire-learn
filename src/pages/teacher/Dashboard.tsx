import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Plus,
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Clock,
} from "lucide-react";

const TeacherDashboard = () => {
  const courses = [
    {
      id: 1,
      title: "Advanced Web Development",
      students: 245,
      rating: 4.8,
      revenue: 12450,
      status: "Published",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    },
    {
      id: 2,
      title: "React Masterclass 2025",
      students: 189,
      rating: 4.9,
      revenue: 9870,
      status: "Published",
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400",
    },
  ];

  const recentActivity = [
    { id: 1, type: "enrollment", student: "John Doe", course: "Advanced Web Development", time: "2h ago" },
    { id: 2, type: "review", student: "Jane Smith", course: "React Masterclass 2025", time: "5h ago" },
    { id: 3, type: "question", student: "Mike Johnson", course: "Advanced Web Development", time: "1d ago" },
  ];

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
              <Button variant="ghost" size="sm">
                My Courses
              </Button>
              <Button variant="ghost" size="sm">
                Students
              </Button>
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
              <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">JS</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Prof. Johnson! 👋</h1>
            <p className="text-muted-foreground">Here's what's happening with your courses</p>
          </div>
          <Button variant="hero" size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Course
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">434</div>
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
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Active Courses</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">$22K</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button variant="ghost">View All</Button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="p-6 bg-card border-border hover:border-primary/40 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            ${course.revenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Card className="p-6 bg-card border-border">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === "enrollment" && <Users className="h-5 w-5 text-primary" />}
                      {activity.type === "review" && <Star className="h-5 w-5 text-primary" />}
                      {activity.type === "question" && <BookOpen className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {activity.student}
                        {activity.type === "enrollment" && " enrolled in"}
                        {activity.type === "review" && " reviewed"}
                        {activity.type === "question" && " asked a question in"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{activity.course}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
