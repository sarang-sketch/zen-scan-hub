import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dumbbell, 
  Plus, 
  Clock, 
  Target, 
  Play, 
  Pause, 
  RotateCcw,
  Trophy,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  exercises: any;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

interface WorkoutSession {
  id: string;
  workout_plan_id: string;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number;
  rating: number;
  notes: string;
  calories_burned: number;
}

interface WorkoutPlanManagerProps {
  userId?: string;
  className?: string;
}

export const WorkoutPlanManager: React.FC<WorkoutPlanManagerProps> = ({ userId, className = '' }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadWorkoutPlans();
      loadActiveSession();
    }
  }, [userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSession && !isPaused && !activeSession.completed_at) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession, isPaused]);

  const loadWorkoutPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkoutPlans(data || []);
    } catch (error) {
      console.error('Error loading workout plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActiveSession = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setActiveSession(data);
        const startTime = new Date(data.started_at).getTime();
        const currentTime = new Date().getTime();
        setSessionTimer(Math.floor((currentTime - startTime) / 1000));
      }
    } catch (error) {
      console.error('Error loading active session:', error);
    }
  };

  const createWorkoutPlan = async (planData: Partial<WorkoutPlan>) => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          title: planData.title || '',
          description: planData.description || '',
          difficulty: planData.difficulty || 'medium',
          duration_minutes: planData.duration_minutes || 30,
          user_id: userId,
          exercises: planData.exercises || [],
          tags: planData.tags || []
        })
        .select()
        .single();

      if (error) throw error;

      setWorkoutPlans(prev => [data, ...prev]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Workout plan created successfully!"
      });

    } catch (error) {
      console.error('Error creating workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to create workout plan",
        variant: "destructive"
      });
    }
  };

  const startWorkoutSession = async (plan: WorkoutPlan) => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          user_id: userId,
          workout_plan_id: plan.id,
          started_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      setSessionTimer(0);
      setIsPaused(false);
      
      toast({
        title: "Workout Started",
        description: `Started "${plan.title}" workout session`
      });

    } catch (error) {
      console.error('Error starting workout session:', error);
      toast({
        title: "Error",
        description: "Failed to start workout session",
        variant: "destructive"
      });
    }
  };

  const pauseResumeSession = () => {
    setIsPaused(!isPaused);
  };

  const completeWorkoutSession = async (rating: number, notes: string = '', caloriesBurned: number = 0) => {
    if (!activeSession) return;

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          completed_at: new Date().toISOString(),
          duration_minutes: Math.floor(sessionTimer / 60),
          rating: rating,
          notes: notes,
          calories_burned: caloriesBurned
        })
        .eq('id', activeSession.id);

      if (error) throw error;

      setActiveSession(null);
      setSessionTimer(0);
      setIsPaused(false);
      
      toast({
        title: "Workout Complete",
        description: `Great job! You worked out for ${Math.floor(sessionTimer / 60)} minutes.`
      });

    } catch (error) {
      console.error('Error completing workout session:', error);
      toast({
        title: "Error",
        description: "Failed to complete workout session",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-24 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Session Card */}
      {activeSession && (
        <Card className="shadow-wellness bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Active Workout Session
              </div>
              <div className="flex items-center gap-2 text-2xl font-mono">
                <Clock className="h-5 w-5" />
                {formatTime(sessionTimer)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Workout in Progress</p>
                <p className="text-sm text-muted-foreground">
                  Keep going! You're doing great.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={pauseResumeSession}
                  variant="secondary"
                  size="sm"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => completeWorkoutSession(5)}
                  className="bg-success hover:bg-success/90"
                  size="sm"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Plans Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          Workout Plans
        </h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Workout Plan</DialogTitle>
            </DialogHeader>
            <CreateWorkoutPlanForm onSubmit={createWorkoutPlan} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Workout Plans Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workoutPlans.length === 0 ? (
          <Card className="col-span-full shadow-card bg-gradient-card">
            <CardContent className="p-8 text-center">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Workout Plans</h3>
              <p className="text-muted-foreground mb-4">
                Create your first workout plan to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          workoutPlans.map((plan) => (
            <Card key={plan.id} className="shadow-card bg-gradient-card hover:shadow-glow transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {plan.duration_minutes} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {plan.exercises?.length || 0} exercises
                    </div>
                  </div>

                  {plan.tags && plan.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {plan.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => startWorkoutSession(plan)}
                      disabled={!!activeSession}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Create Workout Plan Form Component
const CreateWorkoutPlanForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    duration_minutes: 30,
    tags: '',
    exercises: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exercises = formData.exercises.split('\n').filter(ex => ex.trim()).map(ex => ({
      name: ex.trim(),
      sets: 3,
      reps: 10
    }));

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    onSubmit({
      ...formData,
      exercises,
      tags,
      duration_minutes: Number(formData.duration_minutes)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Full Body Workout"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="A comprehensive full-body workout"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Difficulty</label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Duration (min)</label>
          <Input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
            min="10"
            max="180"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Tags (comma separated)</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="strength, cardio, full-body"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Exercises (one per line)</label>
        <Textarea
          value={formData.exercises}
          onChange={(e) => setFormData(prev => ({ ...prev, exercises: e.target.value }))}
          placeholder="Push-ups&#10;Squats&#10;Planks"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Workout Plan
      </Button>
    </form>
  );
};

export default WorkoutPlanManager;