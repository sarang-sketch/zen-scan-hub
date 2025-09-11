-- Fix chat table naming and add missing features

-- Rename chat_messages to chat_history for consistency
ALTER TABLE public.chat_messages RENAME TO chat_history;

-- Add timestamp column if it doesn't exist
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS timestamp timestamp with time zone DEFAULT now();

-- Create todo_lists table for workout schedules and protein tracking
CREATE TABLE IF NOT EXISTS public.todo_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general', -- 'workout', 'protein', 'general'
  workout_type TEXT, -- 'chest', 'legs', 'back', 'shoulders', 'arms', 'cardio'
  day_of_week INTEGER, -- 0-6 for Sun-Sat
  protein_amount INTEGER, -- grams
  priority INTEGER DEFAULT 1,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on todo_lists
ALTER TABLE public.todo_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for todo_lists
CREATE POLICY "Users can view their own todos" 
ON public.todo_lists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own todos" 
ON public.todo_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON public.todo_lists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON public.todo_lists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create progress_tracking table for interactive graphs
CREATE TABLE IF NOT EXISTS public.progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- 'weight', 'wellness_score', 'workout_days', 'protein_intake', 'sleep_hours'
  value DECIMAL NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on progress_tracking
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for progress_tracking
CREATE POLICY "Users can view their own progress" 
ON public.progress_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.progress_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.progress_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create scan_results table for test analyzer
CREATE TABLE IF NOT EXISTS public.scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scan_type TEXT NOT NULL, -- 'food', 'health', 'blood_test'
  image_url TEXT,
  analysis_data JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL,
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on scan_results
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Create policies for scan_results
CREATE POLICY "Users can view their own scan results" 
ON public.scan_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scan results" 
ON public.scan_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_todo_lists_updated_at
BEFORE UPDATE ON public.todo_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create weekly workout schedule view
CREATE OR REPLACE VIEW public.weekly_workout_schedule AS
SELECT 
  user_id,
  day_of_week,
  workout_type,
  STRING_AGG(task, ', ') as exercises,
  COUNT(*) as exercise_count
FROM public.todo_lists 
WHERE category = 'workout' 
  AND completed = false
GROUP BY user_id, day_of_week, workout_type
ORDER BY day_of_week;