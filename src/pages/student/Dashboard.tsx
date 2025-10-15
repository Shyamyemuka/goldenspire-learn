import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Search,
  BookOpen,
  Trophy,
  Flame,
  TrendingUp,
  Clock,
  Star,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const currentCourses = [
    {
      id: 1,
      title: "Advanced Web Development",
      progress: 65,
      instructor: "Prof. Sarah Johnson",
      nextLesson: "React Hooks Deep Dive",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      progress: 42,
      instructor: "Dr. Michael Chen",
      nextLesson: "Statistical Analysis",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    },
  ];

  const recommendedCourses = [
    {
      id: 3,
      title: "Machine Learning Basics",
      rating: 4.8,
      students: 12500,
      duration: "8 weeks",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      rating: 4.9,
      students: 8300,
      duration: "6 weeks",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    },
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
                Certificates
              </Button>
              <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">JD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>

          {/* Streak Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-4">
              <Flame className="h-12 w-12 text-primary animate-pulse" />
              <div>
                <div className="text-3xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Active Courses</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">48h</div>
                <div className="text-sm text-muted-foreground">Learning Time</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Continue Learning */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Continue Learning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {currentCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden bg-card border-border hover:border-primary/40 transition-all group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <Button
                    variant="hero"
                    size="icon"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full"
                  >
                    <PlayCircle className="h-8 w-8" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-gold"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PlayCircle className="h-4 w-4" />
                    <span>Next: {course.nextLesson}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden bg-card border-border hover:border-primary/40 transition-all hover:shadow-[var(--shadow-gold)] group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Explore Course
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
