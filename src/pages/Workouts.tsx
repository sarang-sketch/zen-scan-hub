import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WorkoutPlanManager from '@/components/WorkoutPlanManager';
import AIAssistant from '@/components/AIAssistant';
import { 
  Dumbbell, 
  Trophy, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

export const Workouts = () => {
  const [user, setUser] = useState<any>(null);
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadWorkoutStats();
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

  const loadWorkoutStats = async () => {
    try {
      // Get workout sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Get workout plans count
      const { data: plans, error: plansError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('user_id', user.id);

      if (plansError) throw plansError;

      // Calculate stats
      const completedSessions = sessions?.filter(s => s.completed_at) || [];
      const thisWeekSessions = completedSessions.filter(s => {
        const sessionDate = new Date(s.completed_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      });

      const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      const totalCalories = completedSessions.reduce((sum, s) => sum + (s.calories_burned || 0), 0);
      const averageRating = completedSessions.length > 0 ?
        (completedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / completedSessions.length).toFixed(1) : "0";

      setWorkoutStats({
        totalPlans: plans?.length || 0,
        completedWorkouts: completedSessions.length,
        thisWeekWorkouts: thisWeekSessions.length,
        totalMinutes,
        totalCalories,
        averageRating: parseFloat(averageRating),
        recentSessions: completedSessions.slice(0, 5)
      });

    } catch (error) {
      console.error('Error loading workout stats:', error);
      toast({
        title: "Error",
        description: "Failed to load workout data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
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
            <div className="h-96 bg-muted rounded-lg"></div>
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
              Workout Center
            </h1>
            <p className="text-muted-foreground">
              Plan, track, and achieve your fitness goals
            </p>
          </div>
          <Button
            onClick={() => navigate('/wellness')}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Activity className="h-4 w-4 mr-2" />
            Wellness Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workout Plans</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {workoutStats?.totalPlans || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Created workout plans
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {workoutStats?.completedWorkouts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total workout sessions
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
                {workoutStats?.thisWeekWorkouts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Workouts completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatDuration(workoutStats?.totalMinutes || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Exercise time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Workout Plans</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <WorkoutPlanManager userId={user?.id} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Performance Overview */}
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {workoutStats?.averageRating || 0}/5
                      </span>
                      <span className="text-yellow-500">
                        {getRatingStars(workoutStats?.averageRating || 0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Calories</span>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-lg font-semibold">
                        {workoutStats?.totalCalories?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Session</span>
                    <span className="text-lg font-semibold">
                      {workoutStats?.completedWorkouts > 0 ? 
                        formatDuration(Math.round((workoutStats?.totalMinutes || 0) / workoutStats.completedWorkouts)) :
                        '0m'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {workoutStats?.thisWeekWorkouts || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Workouts this week
                    </p>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div
                        key={index}
                        className="aspect-square flex items-center justify-center rounded-md text-xs font-medium bg-muted/50"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={() => navigate('/wellness')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workoutStats?.recentSessions?.length > 0 ? (
                  <div className="space-y-4">
                    {workoutStats.recentSessions.map((session: any) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">Workout Session</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.completed_at).toLocaleDateString()} •{' '}
                            {formatDuration(session.duration_minutes || 0)}
                          </p>
                          {session.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {session.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-500">
                              {getRatingStars(session.rating || 0)}
                            </span>
                          </div>
                          {session.calories_burned > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {session.calories_burned} cal
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Workouts Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first workout to see your history here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Assistant */}
        <AIAssistant userId={user?.id} />
      </div>
    </div>
  );
};

export default Workouts;