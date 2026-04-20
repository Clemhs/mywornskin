'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExclusivePage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setSubscription(data);
        setDebug(JSON.stringify({ userId: user.id, subscription: data, error }, null, 2));
      }
      setLoading(false);
    };

    check();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white p-10">Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-8">Diagnostic Exclusif</h1>
      
      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">
        <p><strong>User ID :</strong> {user?.id || 'Non connecté'}</p>
        <p><strong>Abonnement trouvé :</strong> {subscription ? 'OUI' : 'NON'}</p>
        {subscription && <p><strong>Status :</strong> {subscription.status}</p>}
      </div>

      <pre className="bg-zinc-950 p-6 rounded-2xl text-xs overflow-auto whitespace-pre-wrap">
        {debug}
      </pre>

      {!subscription && (
        <p className="text-red-400 mt-8">Aucun abonnement actif trouvé pour cet utilisateur.</p>
      )}
    </div>
  );
}
