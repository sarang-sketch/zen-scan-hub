import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Camera, TrendingUp, Shield, Sparkles, Heart, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-wellness.jpg";

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Mental Wellness Checkup",
      description: "Science-backed questions to assess your mental health in 2 minutes",
      action: () => navigate("/checkup"),
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: Camera,
      title: "AI Health Scanner",
      description: "Upload photos for instant nutrition analysis and health insights",
      action: () => navigate("/scanner"),
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visualize your wellness journey with beautiful charts and badges",
      action: () => navigate("/dashboard"),
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Parent Mode",
      description: "Safe monitoring tools for younger users with privacy protection",
      action: () => navigate("/parent"),
      gradient: "from-blue-500 to-indigo-600"
    }
  ];

  const stats = [
    { icon: Heart, value: "98%", label: "User Satisfaction" },
    { icon: Brain, value: "2M+", label: "Checkups Completed" },
    { icon: Moon, value: "85%", label: "Better Sleep Reported" },
    { icon: Sparkles, value: "24/7", label: "AI Support Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Check Your{" "}
                  <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                    Mind & Body
                  </span>{" "}
                  Balance in 2 Minutes
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Simple science-backed checkup + AI-powered lifestyle tips. 
                  Your private wellness companion that helps you find balance.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => navigate("/checkup")}
                  className="text-lg px-8 py-6 h-auto"
                >
                  <Brain className="w-5 h-5" />
                  Take Free Checkup Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/scanner")}
                  className="text-lg px-8 py-6 h-auto"
                >
                  <Camera className="w-5 h-5" />
                  Try AI Scanner
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  🔒 100% Private & Secure
                </span>
                <span className="flex items-center gap-2">
                  ⚡ Instant Results
                </span>
                <span className="flex items-center gap-2">
                  🌟 Science-Backed
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-glow opacity-50 rounded-3xl" />
              <img
                src={heroImage}
                alt="Wellness Balance Illustration"
                className="w-full h-auto rounded-3xl shadow-wellness animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Your Complete Wellness Toolkit
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to monitor, understand, and improve your mental and physical wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="p-8 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={feature.action}
                >
                  <div className="space-y-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <Button variant="ghost" className="group-hover:text-primary">
                      Get Started →
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="p-8 lg:p-12 bg-gradient-card border-border/50">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-4">
                <Heart className="w-10 h-10 mx-auto text-primary animate-pulse" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                A Mission from the Heart
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We believe that true wellness begins with a healthy mind. In a world that's constantly demanding our attention, we've created a sanctuary for you to reconnect with yourself. Our mission is to empower and protect the mental well-being of the youth, providing tools that foster balance, resilience, and self-awareness.
              </p>
              <p className="text-md text-foreground italic">
                Created by Sarang Kadam
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground">
              Ready to Find Your Balance?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Join thousands who've improved their wellbeing with BalanceAI. 
              Start your journey to better mental and physical health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate("/checkup")}
                className="text-lg px-8 py-6 h-auto bg-white text-background hover:bg-white/90"
              >
                <Brain className="w-5 h-5" />
                Start Your Checkup
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
                className="text-lg px-8 py-6 h-auto border-white/30 text-primary-foreground hover:bg-white/10"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};