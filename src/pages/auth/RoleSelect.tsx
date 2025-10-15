import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

const RoleSelect = () => {
  const roles = [
    {
      type: "student",
      title: "Join as Student",
      description: "Access courses, learn at your own pace, and earn certificates",
      icon: GraduationCap,
      features: [
        "Unlimited course access",
        "AI-powered learning paths",
        "Blockchain certificates",
        "Community forums",
      ],
      path: "/auth/signup/student",
    },
    {
      type: "teacher",
      title: "Join as Teacher",
      description: "Create courses, inspire learners, and build your teaching legacy",
      icon: BookOpen,
      features: [
        "Course creation tools",
        "Advanced analytics",
        "Student management",
        "Revenue opportunities",
      ],
      path: "/auth/signup/teacher",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Learners' LMS
            </span>
          </Link>
          <h1 className="text-4xl font-bold">Choose Your Path</h1>
          <p className="text-muted-foreground text-lg">
            Select how you'd like to join our learning community
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.type}
                className="p-8 bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--shadow-gold)] group"
              >
                <div className="space-y-6">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">{role.title}</h2>
                    <p className="text-muted-foreground">{role.description}</p>
                  </div>

                  <ul className="space-y-3">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={role.path} className="block">
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                    >
                      Continue as {role.type === "student" ? "Student" : "Teacher"}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Admin Note */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 text-center">
          <Users className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Master Admin access available at{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              ys304123@gmail.com
            </Link>
          </p>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
