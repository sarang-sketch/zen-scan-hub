import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AIAssistant from '@/components/AIAssistant';
import DailyGuidance from '@/components/DailyGuidance';
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  Calendar,
  BarChart3,
  MessageCircle,
  Target,
  Award
} from 'lucide-react';

export const Wellness = () => {
  const [user, setUser] = useState<any>(null);
  const [wellnessStats, setWellnessStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadWellnessStats();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    }
  };

  const loadWellnessStats = async () => {
    try {
      // Get recent wellness checkups
      const { data: checkups, error: checkupsError } = await supabase
        .from('wellness_checkups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (checkupsError) throw checkupsError;

      // Get this week's guidance completion
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const { data: guidance, error: guidanceError } = await supabase
        .from('daily_guidance')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0]);

      if (guidanceError) throw guidanceError;

      // Calculate stats
      const latestScore = checkups?.[0]?.score || 0;
      const averageScore = checkups?.length ? 
        Math.round(checkups.reduce((sum, c) => sum + c.score, 0) / checkups.length) : 0;
      
      const completedGuidance = guidance?.filter(g => 
        g.completed_tasks && g.completed_tasks.length > 0
      ).length || 0;

      setWellnessStats({
        latestScore,
        averageScore,
        totalCheckups: checkups?.length || 0,
        weeklyCompletions: completedGuidance,
        recentCheckups: checkups || []
      });

    } catch (error) {
      console.error('Error loading wellness stats:', error);
      toast({
        title: "Error",
        description: "Failed to load wellness data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-wellness p-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Wellness Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your wellness journey and get personalized guidance
            </p>
          </div>
          <Button
            onClick={() => navigate('/checkup')}
            className="bg-primary hover:bg-primary/90"
          >
            <Heart className="h-4 w-4 mr-2" />
            Take Checkup
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(wellnessStats?.latestScore || 0)}`}>
                {wellnessStats?.latestScore || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {getScoreLabel(wellnessStats?.latestScore || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {wellnessStats?.averageScore || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {wellnessStats?.totalCheckups || 0} checkups
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {wellnessStats?.weeklyCompletions || 0}/7
              </div>
              <p className="text-xs text-muted-foreground">
                Days with guidance completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {wellnessStats?.totalCheckups || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Wellness checkups completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Daily Guidance */}
          <div className="lg:col-span-2">
            <DailyGuidance userId={user?.id} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/checkup')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Take Wellness Checkup
                </Button>
                
                <Button
                  onClick={() => navigate('/scanner')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Health Scanner
                </Button>
                
                <Button
                  onClick={() => navigate('/workouts')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Workout Plans
                </Button>
                
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wellnessStats?.recentCheckups?.length > 0 ? (
                  <div className="space-y-3">
                    {wellnessStats.recentCheckups.slice(0, 3).map((checkup: any, index: number) => (
                      <div key={checkup.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Wellness Checkup
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(checkup.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-sm font-semibold ${getScoreColor(checkup.score)}`}>
                          {checkup.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant */}
        <AIAssistant userId={user?.id} />
      </div>
    </div>
  );
};

export default Wellness;