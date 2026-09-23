// Deletes the signed-in caller's own account: their profile row (streak
// data) and their actual Supabase auth identity, so they can't sign back
// in. Required by Apple (guideline 5.1.1(v)) since the app lets people
// create an account with just an email.
//
// Runs with the service role key, which is never sent to the app - it
// only exists here, as an Edge Function secret. The app calls this
// function with the signed-in user's own token; we use that token only
// to confirm who they are, never to act on someone else's account.
//
// Deploy with: npx supabase functions deploy delete-account
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify who's calling, using their own token - can only ever resolve to
  // the caller's own account, never someone else's.
  const callerClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: userData, error: userError } = await callerClient.auth.getUser();
  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Not signed in' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const userId = userData.user.id;

  // Now do the actual deletion with admin rights.
  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error: profileError } = await adminClient.from('profiles').delete().eq('id', userId);
  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
  if (authDeleteError) {
    return new Response(JSON.stringify({ error: authDeleteError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
