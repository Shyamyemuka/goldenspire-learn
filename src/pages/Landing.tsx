import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Award, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Rich Course Library",
      description: "Access thousands of courses across diverse subjects with expert instructors",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups, discussion forums, and connect with peers worldwide",
    },
    {
      icon: Award,
      title: "Verified Certificates",
      description: "Earn blockchain-verified certificates recognized by top employers",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Insights",
      description: "Get personalized learning paths and performance analytics",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Learners" },
    { value: "1,200+", label: "Expert Courses" },
    { value: "98%", label: "Success Rate" },
    { value: "45+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Learners' LMS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth/role-select">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Empowering Education Through Innovation</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Transform Your
              <span className="bg-gradient-gold bg-clip-text text-transparent"> Future </span>
              with Learning
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners and educators on the most advanced learning management
              platform. Personalized, intelligent, and designed for success.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/auth/role-select">
                <Button variant="hero" size="lg" className="group">
                  Join Learners' LMS
                  <GraduationCap className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="premium" size="lg">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all hover:scale-105"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Learners' LMS</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the future of education with cutting-edge features designed for modern learners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--shadow-gold)] group"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-card to-secondary border-primary/20">
            <GraduationCap className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of passionate learners and expert educators. Your journey to excellence starts here.
            </p>
            <Link to="/auth/role-select">
              <Button variant="hero" size="lg">
                Create Free Account
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold">Learners' LMS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Learners' LMS. Empowering Education Through Innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
