import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Heart, Zap, Shield, Users, ChevronRight, Star, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Wellness",
      description: "Advanced AI analyzes your health patterns and provides personalized insights.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Heart,
      title: "Holistic Health Tracking",
      description: "Monitor mood, sleep, stress, and activity levels in one comprehensive dashboard.",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Smart Daily Guidance",
      description: "Receive personalized daily tips and routines based on your wellness data.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Privacy-First Approach",
      description: "Your health data is encrypted and stored securely with complete privacy control.",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Teacher",
      content: "BalanceAI helped me identify stress patterns I never noticed. My wellness score improved 40% in just 3 weeks!",
      rating: 5
    },
    {
      name: "David L.",
      role: "Software Engineer",
      content: "The AI assistant feels like having a personal wellness coach. The daily guidance is spot-on.",
      rating: 5
    },
    {
      name: "Maria R.",
      role: "Healthcare Worker",
      content: "As someone in healthcare, I appreciate the evidence-based approach. It's genuinely helpful.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Wellness Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Your Journey to
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Perfect Balance</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover personalized wellness insights with AI-powered health tracking, smart guidance, and comprehensive analytics designed for your unique journey.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-lg px-8"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/help")}
                className="text-lg px-8"
              >
                Learn More
              </Button>
            </div>

            <div className="pt-8">
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-foreground">Powerful Features for Complete Wellness</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to track, understand, and improve your wellbeing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-8 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300">
                    <div className="space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-glow`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-foreground">Trusted by Thousands</h2>
              <p className="text-xl text-muted-foreground">
                See what our users say about their wellness transformation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 bg-gradient-card border-border/50">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                    <div className="pt-4 border-t border-border">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-hero text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-primary-foreground">
                  Ready to Transform Your Wellness?
                </h2>
                <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                  Join thousands of users who have discovered the power of AI-driven wellness insights. Start your journey today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="text-lg px-8"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-foreground/60" />
                  <span className="text-primary-foreground/80">Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-foreground/60" />
                  <span className="text-primary-foreground/80">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-foreground/60" />
                  <span className="text-primary-foreground/80">Privacy-first</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
