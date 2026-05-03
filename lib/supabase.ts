// lib/supabase.ts
// Point d'entrée unique qui redirige correctement

// Export côté client uniquement
export { createClient as createBrowserClient } from './supabase/client';

// Export côté serveur (ne sera jamais chargé côté client)
export { createClient as createServerClient } from './supabase/server';
