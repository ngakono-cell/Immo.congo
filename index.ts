// Edge Function — Enregistrement token push + envoi notifications — IMMO CONGO
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (req.method === 'POST' && action === 'register') {
      // Enregistrer le token push d'un utilisateur
      const { userId, token, platform } = await req.json();
      if (!userId || !token) {
        return new Response(JSON.stringify({ error: 'userId et token requis' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      await supabase.from('push_tokens').upsert({
        user_id: userId,
        token,
        platform: platform || 'unknown',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,token' });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && action === 'send') {
      // Envoyer une notification à un ou plusieurs utilisateurs
      const { userIds, title, body, data } = await req.json();
      if (!userIds?.length || !title) {
        return new Response(JSON.stringify({ error: 'userIds et title requis' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: tokens } = await supabase
        .from('push_tokens')
        .select('token, platform')
        .in('user_id', userIds);

      // Simulation d'envoi (à connecter à FCM/APNs en production)
      console.log(`Envoi notifications à ${tokens?.length || 0} appareils:`, { title, body });

      return new Response(JSON.stringify({ success: true, sent: tokens?.length || 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('push-notifications error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
