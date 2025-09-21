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
    const { parent_id } = await req.json();

    if (!parent_id) {
      throw new Error('parent_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: children, error } = await supabase
      .from('parent_child_relationships')
      .select('child_id')
      .eq('parent_id', parent_id);

    if (error) {
      throw error;
    }

    const childrenData = await Promise.all(
      children.map(async (child) => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', child.child_id)
          .single();

        if (profileError) {
          throw profileError;
        }

        const { data: lastCheckup, error: checkupError } = await supabase
          .from('wellness_checkups')
          .select('*')
          .eq('user_id', child.child_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...profile,
          lastCheckup,
        };
      })
    );

    return new Response(JSON.stringify(childrenData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-children-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
