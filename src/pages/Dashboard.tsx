import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Moon, TrendingUp, Award, Calendar, Target, Zap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const iconMap = {
  Moon,
  Brain,
  Heart,
  Zap,
};

interface Metric {
  name: string;
  current: number;
  goal: number;
  unit: string;
  trend: string;
  color: string;
  icon: keyof typeof iconMap;
}

interface Achievement {
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

interface WeeklyData {
  day: string;
  wellness: number;
  mood: number;
  sleep: number;
}

interface DashboardData {
  wellnessScore: number;
  previousScore: number;
  metrics: Metric[];
  achievements: Achievement[];
  weeklyData: WeeklyData[];
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase.functions.invoke('get-dashboard-data', {
          body: { user_id: user.id },
        });

        if (error) throw new Error(error.message);

        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Could not fetch dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const scoreImprovement = dashboardData ? dashboardData.wellnessScore - dashboardData.previousScore : 0;

  const dailyTips = [
    "Take 3 deep breaths when feeling overwhelmed",
    "Step outside for 10 minutes of natural light",
    "Write down 3 things you're grateful for",
    "Do a 5-minute body scan meditation",
    "Call or text someone you care about"
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Wellness Dashboard</h1>
              <p className="text-xl text-muted-foreground">Track your progress and celebrate your journey</p>
            </div>
            <div className="flex gap-2">
              {["week", "month", "year"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Score Card */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : dashboardData && (
            <>
              <Card className="p-8 bg-gradient-card border-border/50 shadow-wellness">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center md:text-left space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold text-foreground">Current Wellness Score</h2>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-primary">{dashboardData.wellnessScore}%</span>
                        <Badge variant="secondary" className="gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {scoreImprovement >= 0 ? '+' : ''}{scoreImprovement}% this week
                        </Badge>
                      </div>
                    </div>
                    <Progress value={dashboardData.wellnessScore} className="h-3" />
                  </div>

                  <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow animate-glow-pulse">
                  <Award className="w-12 h-12 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Keep up the great work!</p>
              </div>

                  <div className="text-center md:text-right space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">This Week's Streak</p>
                      <p className="text-3xl font-bold text-accent">7 days</p>
                    </div>
                    <Button variant="hero" onClick={() => navigate("/checkup")}>
                      <Brain className="w-4 h-4" />
                      Take New Checkup
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardData.metrics.map((metric, index) => {
                  const Icon = iconMap[metric.icon];
                  const progress = (metric.current / metric.goal) * 100;
                  return (
                    <Card key={index} className="p-6 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-glow`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant={metric.trend === "up" ? "default" : "secondary"} className="text-xs">
                            {metric.trend === "up" ? "↗" : "↘"} {metric.trend}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{metric.name}</p>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-foreground">{metric.current}</span>
                            <span className="text-sm text-muted-foreground pb-1">{metric.unit}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>Goal: {metric.goal}{metric.unit}</span>
                            </div>
                            <Progress value={Math.min(progress, 100)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Weekly Progress Chart */}
              <Card className="p-8 bg-gradient-card border-border/50">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">Weekly Progress</h3>
                  <div className="grid grid-cols-7 gap-4">
                    {dashboardData.weeklyData.map((data, index) => (
                      <div key={index} className="text-center space-y-3">
                        <p className="text-sm text-muted-foreground font-medium">{data.day}</p>
                        <div className="space-y-2">
                          <div
                            className="w-full h-20 bg-gradient-hero rounded-lg flex items-end p-2"
                            style={{ background: `linear-gradient(to top, hsl(var(--primary)) ${data.wellness}%, hsl(var(--muted)) ${data.wellness}%)` }}
                          >
                            <span className="text-xs text-white font-bold w-full text-center">{data.wellness}%</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">😊</span>
                              <span>{data.mood}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">😴</span>
                              <span>{data.sleep}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Achievements */}
                <Card className="p-8 bg-gradient-card border-border/50">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {dashboardData.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            achievement.unlocked
                              ? "border-accent bg-accent/10 shadow-glow"
                              : "border-border bg-muted/30 opacity-60"
                          }`}
                        >
                          <div className="text-center space-y-2">
                            <div className="text-3xl">{achievement.emoji}</div>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm text-foreground">{achievement.name}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                            {achievement.unlocked && (
                              <Badge variant="default" className="text-xs">
                                Unlocked!
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Daily Tips */}
                <Card className="p-8 bg-gradient-card border-border/50">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Daily Wellness Tips
                    </h3>
                    <div className="space-y-3">
                      {dailyTips.slice(0, 3).map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-accent-foreground text-xs font-bold">{index + 1}</span>
                          </div>
                          <p className="text-sm text-foreground">{tip}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4" />
                      View All Daily Tips
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Quick Actions */}
          <Card className="p-8 bg-gradient-hero">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold text-primary-foreground">Continue Your Wellness Journey</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" onClick={() => navigate("/scanner")}>
                  Take AI Health Scan
                </Button>
                <Button variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10">
                  View Parent Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};