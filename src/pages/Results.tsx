import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, TrendingUp, Share2, Calendar, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { score, answers } = location.state || { score: 0, answers: {} };
  
  useEffect(() => {
    if (!location.state) {
      // Redirect if no results data
      navigate("/checkup");
    }
  }, [location.state, navigate]);

  const maxScore = 21; // 7 questions × 3 max points each
  const percentage = Math.round((score / maxScore) * 100);
  const balanceLevel = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Fair" : "Needs Attention";

  const getBalanceColor = () => {
    if (percentage >= 80) return "from-green-500 to-emerald-600";
    if (percentage >= 60) return "from-blue-500 to-cyan-600";
    if (percentage >= 40) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const recommendations = [
    {
      category: "Sleep & Rest",
      suggestions: [
        "Aim for 7-9 hours of quality sleep each night",
        "Create a relaxing bedtime routine",
        "Avoid screens 1 hour before bed"
      ]
    },
    {
      category: "Stress Management",
      suggestions: [
        "Practice 5-10 minutes of daily meditation",
        "Try deep breathing exercises when overwhelmed",
        "Schedule regular breaks during study/work"
      ]
    },
    {
      category: "Social Connection",
      suggestions: [
        "Reach out to a friend or family member daily",
        "Join activities or groups that interest you",
        "Share your feelings with someone you trust"
      ]
    },
    {
      category: "Digital Wellness",
      suggestions: [
        "Set specific times for social media use",
        "Use blue light filters in the evening",
        "Take regular breaks from screens"
      ]
    }
  ];

  const nextSteps = [
    {
      title: "Track Your Progress",
      description: "Use our dashboard to monitor your wellness journey",
      action: () => navigate("/dashboard"),
      icon: TrendingUp
    },
    {
      title: "Try AI Health Scanner",
      description: "Get insights from photos of your food or appearance",
      action: () => navigate("/scanner"),
      icon: Brain
    },
    {
      title: "Schedule Regular Checkups",
      description: "Set reminders for weekly wellness assessments",
      action: () => toast({ title: "Feature Coming Soon!", description: "Scheduled checkups will be available soon." }),
      icon: Calendar
    }
  ];

  if (!location.state) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Header */}
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow animate-glow-pulse">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Your Wellness Results</h1>
              <p className="text-xl text-muted-foreground">Based on your responses, here's your personalized wellness assessment</p>
            </div>
          </div>

          {/* Main Score Card */}
          <Card className="p-8 bg-gradient-card border-border/50 shadow-wellness">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">Your Balance Score</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-primary">{100 - percentage}%</span>
                    <Badge variant={balanceLevel === "Excellent" || balanceLevel === "Good" ? "default" : "secondary"} className="text-lg px-4 py-2">
                      {balanceLevel}
                    </Badge>
                  </div>
                  <Progress value={100 - percentage} className="h-4" />
                  <p className="text-muted-foreground">
                    {balanceLevel === "Excellent" && "Outstanding! You're showing great balance across all areas."}
                    {balanceLevel === "Good" && "Great job! You're maintaining good wellness with room for growth."}
                    {balanceLevel === "Fair" && "You're on the right track. Some areas could use attention."}
                    {balanceLevel === "Needs Attention" && "It's okay - everyone has ups and downs. Let's work on improving together."}
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${getBalanceColor()} flex items-center justify-center shadow-glow animate-float`}>
                  <span className="text-5xl">
                    {balanceLevel === "Excellent" && "🌟"}
                    {balanceLevel === "Good" && "😊"}
                    {balanceLevel === "Fair" && "🌱"}
                    {balanceLevel === "Needs Attention" && "🤗"}
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">Keep growing!</p>
              </div>
            </div>
          </Card>

          {/* Personalized Recommendations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">Personalized Recommendations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="p-6 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">{rec.category}</h3>
                    <div className="space-y-3">
                      {rec.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <Card className="p-8 bg-gradient-card border-border/50">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground text-center">Your Next Steps</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <Button variant="outline" onClick={step.action} className="w-full">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" onClick={() => navigate("/dashboard")} className="gap-2">
              <TrendingUp className="w-4 h-4" />
              View Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/checkup")} className="gap-2">
              <Brain className="w-4 h-4" />
              Take Another Checkup
            </Button>
            <Button variant="ghost" onClick={() => {
              toast({ title: "Sharing Feature", description: "Share results feature coming soon!" });
            }} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
          </div>

          {/* Encouragement */}
          <Card className="p-6 bg-gradient-hero">
            <div className="text-center space-y-4">
              <Heart className="w-12 h-12 mx-auto text-primary-foreground animate-glow-pulse" />
              <h3 className="text-xl font-semibold text-primary-foreground">Remember</h3>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                Your wellness journey is unique to you. Small, consistent steps lead to meaningful changes. 
                Be patient and kind with yourself as you grow and improve. We're here to support you every step of the way.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};