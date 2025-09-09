import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Clock, TrendingUp, AlertTriangle, Heart, Settings } from "lucide-react";

export const Parent = () => {
  const childProfiles = [
    {
      name: "Alex",
      age: 16,
      lastCheckup: "2 days ago",
      overallStatus: "Good",
      recentScore: 75,
      alerts: 0,
      statusColor: "from-green-500 to-emerald-600"
    },
    {
      name: "Jamie",
      age: 14,
      lastCheckup: "1 week ago",
      overallStatus: "Needs Attention",
      recentScore: 45,
      alerts: 2,
      statusColor: "from-yellow-500 to-orange-600"
    }
  ];

  const parentControls = [
    {
      title: "Screen Time Limits",
      description: "Set healthy boundaries for app usage",
      icon: Clock,
      status: "Active"
    },
    {
      title: "Privacy Settings",
      description: "Control what information is shared",
      icon: Shield,
      status: "Configured"
    },
    {
      title: "Notification Preferences",
      description: "Choose when to receive wellness updates",
      icon: Settings,
      status: "Customized"
    }
  ];

  const insights = [
    {
      title: "Weekly Summary",
      description: "Overall wellness trends are positive",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Sleep Patterns",
      description: "Both children meeting sleep goals",
      icon: Heart,
      color: "text-blue-500"
    },
    {
      title: "Safety Check",
      description: "No concerning responses detected",
      icon: Shield,
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Parent Dashboard</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor your children's wellness journey with privacy-focused insights and supportive guidance
            </p>
          </div>

          {/* Child Profiles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Children's Wellness Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {childProfiles.map((child, index) => (
                <Card key={index} className="p-6 bg-gradient-card border-border/50 shadow-wellness">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${child.statusColor} flex items-center justify-center shadow-glow`}>
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">Age {child.age}</p>
                        </div>
                      </div>
                      {child.alerts > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {child.alerts} alerts
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Overall Status</p>
                        <Badge variant={child.overallStatus === "Good" ? "default" : "secondary"}>
                          {child.overallStatus}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Wellness Score</p>
                        <p className="text-lg font-semibold text-foreground">{child.recentScore}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Last wellness checkup: {child.lastCheckup}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Summary</Button>
                        <Button variant="ghost" size="sm">Message {child.name}</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Weekly Insights */}
          <Card className="p-8 bg-gradient-card border-border/50">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">This Week's Insights</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                      <Icon className={`w-6 h-6 ${insight.color} flex-shrink-0 mt-1`} />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Parent Controls */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Parent Controls</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {parentControls.map((control, index) => {
                const Icon = control.icon;
                return (
                  <Card key={index} className="p-6 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <Badge variant="default">{control.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{control.title}</h3>
                        <p className="text-sm text-muted-foreground">{control.description}</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        Configure
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Privacy & Safety */}
          <Card className="p-8 bg-gradient-hero">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold text-primary-foreground">Privacy & Safety First</h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-primary-foreground/80 mb-6">
                  BalanceAI Parent Mode is designed with your family's privacy in mind. We provide wellness insights 
                  without compromising your children's trust or detailed personal responses.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <Shield className="w-8 h-8 mx-auto text-primary-foreground" />
                    <p className="text-primary-foreground/90 font-medium">No Personal Details Shared</p>
                    <p className="text-primary-foreground/70">Only wellness scores and general trends</p>
                  </div>
                  <div className="space-y-2">
                    <Heart className="w-8 h-8 mx-auto text-primary-foreground" />
                    <p className="text-primary-foreground/90 font-medium">Built on Trust</p>
                    <p className="text-primary-foreground/70">Encouraging open communication</p>
                  </div>
                  <div className="space-y-2">
                    <Users className="w-8 h-8 mx-auto text-primary-foreground" />
                    <p className="text-primary-foreground/90 font-medium">Age-Appropriate</p>
                    <p className="text-primary-foreground/70">Designed for teens and young adults</p>
                  </div>
                </div>
              </div>
              <Button variant="secondary">
                Learn More About Privacy
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};