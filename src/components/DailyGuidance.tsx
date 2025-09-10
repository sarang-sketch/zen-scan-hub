import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sun, 
  Heart, 
  Dumbbell, 
  Apple, 
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';

interface DailyGuidanceData {
  id: string;
  user_id: string;
  date: string;
  morning_routine: any;
  wellness_tips: any;
  workout_suggestion: string;
  nutrition_advice: string;
  mood_check: any;
  completed_tasks: string[];
  created_at: string;
}

interface DailyGuidanceProps {
  userId?: string;
  className?: string;
}

export const DailyGuidance: React.FC<DailyGuidanceProps> = ({ userId, className = '' }) => {
  const [guidanceData, setGuidanceData] = useState<DailyGuidanceData | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadTodaysGuidance();
    }
  }, [userId]);

  const loadTodaysGuidance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_guidance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setGuidanceData(data);
        setCompletedTasks(data.completed_tasks || []);
      } else {
        // Generate new guidance for today
        await generateTodaysGuidance();
      }
    } catch (error) {
      console.error('Error loading daily guidance:', error);
      toast({
        title: "Error",
        description: "Failed to load daily guidance",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTodaysGuidance = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          message: "Generate my daily guidance for today",
          userId: userId,
          messageType: 'guidance_request'
        }
      });

      if (error) throw error;

      // Reload after generation
      setTimeout(() => {
        loadTodaysGuidance();
      }, 2000);

    } catch (error) {
      console.error('Error generating guidance:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!guidanceData) return;

    const newCompletedTasks = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];

    setCompletedTasks(newCompletedTasks);

    try {
      const { error } = await supabase
        .from('daily_guidance')
        .update({ completed_tasks: newCompletedTasks })
        .eq('id', guidanceData.id);

      if (error) throw error;

      toast({
        title: "Progress Updated",
        description: `Task ${completedTasks.includes(taskId) ? 'unchecked' : 'completed'}!`,
      });

    } catch (error) {
      console.error('Error updating task completion:', error);
      // Revert local state on error
      setCompletedTasks(completedTasks);
    }
  };

  const getCompletionPercentage = () => {
    if (!guidanceData) return 0;
    
    const totalTasks = (guidanceData.wellness_tips?.length || 0) + 3; // 3 for routine tasks
    return Math.round((completedTasks.length / totalTasks) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className={`shadow-card bg-gradient-card ${className}`}>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!guidanceData) {
    return (
      <Card className={`shadow-card bg-gradient-card ${className}`}>
        <CardContent className="p-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Guidance Yet</h3>
          <p className="text-muted-foreground mb-4">
            Let's create your personalized daily guidance
          </p>
          <Button onClick={generateTodaysGuidance} className="bg-primary hover:bg-primary/90">
            Generate Daily Guidance
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-card bg-gradient-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Today's Wellness Journey
          </CardTitle>
          <div className="flex items-center gap-2">
            <Progress value={getCompletionPercentage()} className="w-20" />
            <span className="text-sm text-muted-foreground">{getCompletionPercentage()}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="routine" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="routine">Routine</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="routine" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Morning Routine
              </h4>
              
              {guidanceData.morning_routine && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTaskCompletion('meditation')}>
                        {completedTasks.includes('meditation') ? 
                          <CheckCircle2 className="h-5 w-5 text-success" /> :
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        }
                      </button>
                      <div>
                        <p className="font-medium">Meditation</p>
                        <p className="text-sm text-muted-foreground">
                          {guidanceData.morning_routine.meditation_minutes} minutes
                        </p>
                      </div>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTaskCompletion('affirmation')}>
                        {completedTasks.includes('affirmation') ? 
                          <CheckCircle2 className="h-5 w-5 text-success" /> :
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        }
                      </button>
                      <div>
                        <p className="font-medium">Daily Affirmation</p>
                        <p className="text-sm text-muted-foreground">
                          "{guidanceData.morning_routine.affirmation}"
                        </p>
                      </div>
                    </div>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTaskCompletion('breathing')}>
                        {completedTasks.includes('breathing') ? 
                          <CheckCircle2 className="h-5 w-5 text-success" /> :
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        }
                      </button>
                      <div>
                        <p className="font-medium">Breathing Exercise</p>
                        <p className="text-sm text-muted-foreground">
                          {guidanceData.morning_routine.breathing_exercise}
                        </p>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wellness Tips
            </h4>
            
            <div className="space-y-3">
              {guidanceData.wellness_tips?.map((tip, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    <button onClick={() => toggleTaskCompletion(`wellness-${index}`)}>
                      {completedTasks.includes(`wellness-${index}`) ? 
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5" /> :
                        <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      }
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{tip.category}</p>
                        <Badge variant={getPriorityColor(tip.priority)} className="text-xs">
                          {tip.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No wellness tips available for today
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Today's Workout
            </h4>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => toggleTaskCompletion('workout')}>
                  {completedTasks.includes('workout') ? 
                    <CheckCircle2 className="h-5 w-5 text-success" /> :
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  }
                </button>
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">Workout Plan</span>
              </div>
              
              <div className="ml-8">
                <p className="text-sm whitespace-pre-line">
                  {guidanceData.workout_suggestion || "No workout suggestion for today"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Nutrition Guidance
            </h4>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => toggleTaskCompletion('nutrition')}>
                  {completedTasks.includes('nutrition') ? 
                    <CheckCircle2 className="h-5 w-5 text-success" /> :
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  }
                </button>
                <Apple className="h-4 w-4 text-primary" />
                <span className="font-medium">Today's Nutrition Focus</span>
              </div>
              
              <div className="ml-8">
                <p className="text-sm">
                  {guidanceData.nutrition_advice || "No nutrition advice for today"}
                </p>
              </div>
            </div>

            {guidanceData.mood_check && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h5 className="font-medium mb-2 text-primary">Mood Check-in</h5>
                <p className="text-sm mb-3">{guidanceData.mood_check.prompt}</p>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Suggested activities:</p>
                  <div className="flex flex-wrap gap-2">
                    {guidanceData.mood_check.suggested_activities?.map((activity: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DailyGuidance;