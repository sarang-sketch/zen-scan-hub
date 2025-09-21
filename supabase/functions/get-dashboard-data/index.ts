import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error('user_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch wellness score
    const { data: wellnessCheckups, error: wellnessError } = await supabase
      .from('wellness_checkups')
      .select('score, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(2);

    if (wellnessError) throw wellnessError;

    const wellnessScore = wellnessCheckups[0]?.score || 0;
    const previousScore = wellnessCheckups[1]?.score || wellnessScore;

    // Mocked metrics and achievements for now
    const metrics = [
        { name: "Sleep Quality", current: 7.5, goal: 8.0, unit: "hours", trend: "up", color: "from-blue-500 to-cyan-600", icon: "Moon" },
        { name: "Stress Level", current: 3.2, goal: 2.5, unit: "/10", trend: "down", color: "from-purple-500 to-violet-600", icon: "Brain" },
        { name: "Mood Balance", current: 8.1, goal: 8.5, unit: "/10", trend: "up", color: "from-green-500 to-emerald-600", icon: "Heart" },
        { name: "Activity Level", current: 6.8, goal: 7.5, unit: "/10", trend: "up", color: "from-orange-500 to-red-600", icon: "Zap" }
    ];
    const achievements = [
        { name: "Mind Aware", description: "Completed first wellness checkup", emoji: "🧘", unlocked: true },
        { name: "Week Warrior", description: "7 days of consistent tracking", emoji: "💪", unlocked: true },
        { name: "Balance Master", description: "Maintained 70%+ balance for 2 weeks", emoji: "⚖️", unlocked: true },
        { name: "Sleep Champion", description: "Achieved sleep goals 5 nights running", emoji: "😴", unlocked: false },
        { name: "Wellness Guru", description: "30 days of wellness tracking", emoji: "🌟", unlocked: false },
        { name: "AI Explorer", description: "Used all AI scanner features", emoji: "🔍", unlocked: false }
    ];
    const weeklyData = [
        { day: "Mon", wellness: 65, mood: 7, sleep: 7 },
        { day: "Tue", wellness: 70, mood: 8, sleep: 6.5 },
        { day: "Wed", wellness: 68, mood: 7.5, sleep: 8 },
        { day: "Thu", wellness: 75, mood: 8.5, sleep: 7.5 },
        { day: "Fri", wellness: 78, mood: 8, sleep: 7 },
        { day: "Sat", wellness: 82, mood: 9, sleep: 8.5 },
        { day: "Sun", wellness: 80, mood: 8.5, sleep: 8 }
    ];

    const dashboardData = {
      wellnessScore,
      previousScore,
      metrics,
      achievements,
      weeklyData,
    };

    return new Response(JSON.stringify(dashboardData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-dashboard-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
