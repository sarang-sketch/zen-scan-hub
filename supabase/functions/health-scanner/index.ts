import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const foodSystemPrompt = `You are an expert nutrition analyst. Analyze the provided image of food and return a detailed nutritional breakdown.

Respond with a JSON object in the following format:
{
  "type": "food",
  "analysis": {
    "calories": <estimated_calories_number>,
    "nutrients": [
      { "name": "Carbohydrates", "amount": "<amount_in_grams>g", "color": "from-yellow-500 to-orange-500" },
      { "name": "Protein", "amount": "<amount_in_grams>g", "color": "from-green-500 to-emerald-500" },
      { "name": "Fat", "amount": "<amount_in_grams>g", "color": "from-blue-500 to-cyan-500" },
      { "name": "Fiber", "amount": "<amount_in_grams>g", "color": "from-purple-500 to-violet-500" }
    ],
    "recommendations": [
      "<recommendation_1_string>",
      "<recommendation_2_string>",
      "<recommendation_3_string>"
    ]
  }
}

Be as accurate as possible based on the visual information.`;

const selfieSystemPrompt = `You are a holistic wellness analyst. Analyze the provided selfie to identify visible health indicators. Focus on sleep, hydration, and stress. Be encouraging and supportive.

Respond with a JSON object in the following format:
{
  "type": "selfie",
  "analysis": {
    "healthMetrics": [
      { "name": "Sleep Quality", "status": "<status_string>", "advice": "<advice_string>", "color": "from-yellow-500 to-orange-500" },
      { "name": "Hydration", "status": "<status_string>", "advice": "<advice_string>", "color": "from-green-500 to-emerald-500" },
      { "name": "Stress Levels", "status": "<status_string>", "advice": "<advice_string>", "color": "from-blue-500 to-cyan-500" }
    ],
    "recommendations": [
      "<recommendation_1_string>",
      "<recommendation_2_string>",
      "<recommendation_3_string>"
    ]
  }
}

Provide constructive and kind feedback. Do not make medical diagnoses.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, scanType } = await req.json();

    if (!image || !scanType) {
      throw new Error('Image data and scanType are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = scanType === 'food' ? foodSystemPrompt : selfieSystemPrompt;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }

    const aiData = await response.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in health-scanner:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
