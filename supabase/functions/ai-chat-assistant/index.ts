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
    const { message, userId, messageType = 'text' } = await req.json();
    console.log('Received message:', { message, userId, messageType });

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile and recent data for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: recentCheckups } = await supabase
      .from('wellness_checkups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentWorkouts } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: dailyGuidance } = await supabase
      .from('daily_guidance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    // Create context for AI
    const userContext = {
      profile: profile || {},
      recentCheckups: recentCheckups || [],
      recentWorkouts: recentWorkouts || [],
      todaysGuidance: dailyGuidance || null
    };

    const systemPrompt = `You are BalanceAI, a compassionate wellness assistant and personal trainer. You help users with:

1. **Wellness Guidance**: Daily wellness tips, stress management, mental health support
2. **Workout Planning**: Create personalized workout plans based on fitness level and goals
3. **Progress Tracking**: Analyze wellness checkups and workout performance
4. **Daily Goals**: Set achievable daily wellness and fitness goals
5. **Motivation**: Provide encouraging, supportive responses

User Context:
- Profile: ${JSON.stringify(userContext.profile)}
- Recent Wellness Scores: ${userContext.recentCheckups.map(c => `Score: ${c.score}, Risk: ${c.risk_level}`).join('; ')}
- Recent Workouts: ${userContext.recentWorkouts.map(w => `${w.duration_minutes}min, Rating: ${w.rating}/5`).join('; ')}
- Today's Guidance: ${userContext.todaysGuidance ? 'Already provided' : 'Not yet provided'}

Guidelines:
- Be warm, encouraging, and professional
- Provide actionable, specific advice
- Consider user's fitness level and wellness history
- Keep responses concise but helpful (max 200 words)
- If asked about workout plans, suggest specific exercises with sets/reps
- For wellness concerns, provide practical coping strategies
- Always encourage progress, no matter how small`;

    // Store user message
    await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        message: message,
        sender: 'user',
        message_type: messageType,
        metadata: { timestamp: new Date().toISOString() }
      });

    // Get AI response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }

    const aiData = await response.json();
    const aiMessage = aiData.choices[0].message.content;

    // Store AI response
    await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        message: aiMessage,
        sender: 'ai',
        message_type: 'text',
        metadata: { 
          timestamp: new Date().toISOString(),
          model: 'gpt-4o-mini',
          tokens_used: aiData.usage?.total_tokens || 0
        }
      });

    // Check if we should generate daily guidance
    if (!dailyGuidance && (message.toLowerCase().includes('daily') || message.toLowerCase().includes('goals'))) {
      try {
        await generateDailyGuidance(supabase, userId, userContext, openAIApiKey);
      } catch (error) {
        console.error('Error generating daily guidance:', error);
      }
    }

    return new Response(JSON.stringify({ 
      message: aiMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateDailyGuidance(supabase: any, userId: string, userContext: any, openAIApiKey: string) {
  const guidancePrompt = `Based on this user's wellness data, create personalized daily guidance:

User Context: ${JSON.stringify(userContext)}

Generate a JSON response with:
{
  "morning_routine": {
    "meditation_minutes": number,
    "affirmation": "string",
    "breathing_exercise": "string"
  },
  "wellness_tips": [
    {"category": "string", "tip": "string", "priority": "high|medium|low"}
  ],
  "workout_suggestion": "detailed workout plan with exercises, sets, reps",
  "nutrition_advice": "specific nutrition guidance",
  "mood_check": {
    "prompt": "How are you feeling today?",
    "suggested_activities": ["activity1", "activity2"]
  }
}

Make it specific to their fitness level and recent wellness scores.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a wellness expert. Respond only with valid JSON.' },
        { role: 'user', content: guidancePrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    try {
      const guidance = JSON.parse(data.choices[0].message.content);
      
      await supabase
        .from('daily_guidance')
        .insert({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          morning_routine: guidance.morning_routine,
          wellness_tips: guidance.wellness_tips,
          workout_suggestion: guidance.workout_suggestion,
          nutrition_advice: guidance.nutrition_advice,
          mood_check: guidance.mood_check
        });
    } catch (parseError) {
      console.error('Error parsing daily guidance JSON:', parseError);
    }
  }
}