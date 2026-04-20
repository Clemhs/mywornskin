'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExclusivePage() {
  const [user, setUser] = useState<any>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth';
        return;
      }

      setUser(user);

      // Vérifier si l'utilisateur a un abonnement actif
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      setHasActiveSubscription(!!subscription);
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"></div>
          <p>Vérification de ton accès exclusif...</p>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Accès refusé</h1>
          <p className="text-gray-400 mb-10">
            Cette zone est réservée aux abonnés actifs.
          </p>
          <Link 
            href="/subscribe"
            className="inline-block bg-white text-black font-bold py-4 px-10 rounded-2xl text-lg hover:bg-gray-200"
          >
            S'abonner maintenant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-4 text-center">Contenu Exclusif</h1>
        <p className="text-center text-gray-400 mb-12">
          Bienvenue dans la zone réservée aux abonnés 💋
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tu pourras ajouter ici tes photos exclusives, vidéos, etc. */}
          <div className="bg-zinc-900 rounded-3xl p-8 text-center">
            <div className="h-64 bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-6xl">📸</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Photos exclusives</h3>
            <p className="text-gray-400">Contenu jamais vu ailleurs</p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 text-center">
            <div className="h-64 bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-6xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Messagerie prioritaire</h3>
            <p className="text-gray-400">Accès direct et prioritaire aux créateurs</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-400 hover:text-white underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
