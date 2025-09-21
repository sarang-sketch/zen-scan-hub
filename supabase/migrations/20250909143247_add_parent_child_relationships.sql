-- Create parent_child_relationships table
CREATE TABLE public.parent_child_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES public.profiles(user_id),
  child_id UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Enable RLS for the new table
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;

-- RLS policy for parents to view their relationships
CREATE POLICY "Parents can view their own relationships"
ON public.parent_child_relationships FOR SELECT
USING (auth.uid() = parent_id);

-- RLS policy for parents to manage their relationships
CREATE POLICY "Parents can manage their own relationships"
ON public.parent_child_relationships FOR ALL
USING (auth.uid() = parent_id);

-- Update RLS policies for wellness_checkups to allow parents to view their children's data
DROP POLICY "Users can view their own wellness checkups" ON public.wellness_checkups;

CREATE POLICY "Users can view their own wellness checkups or their children's"
ON public.wellness_checkups FOR SELECT
USING (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT parent_id FROM public.parent_child_relationships WHERE child_id = user_id
  )
);

-- Update RLS policies for profiles to allow parents to view their children's profiles
DROP POLICY "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile or their children's"
ON public.profiles FOR SELECT
USING (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT parent_id FROM public.parent_child_relationships WHERE child_id = user_id
  )
);
