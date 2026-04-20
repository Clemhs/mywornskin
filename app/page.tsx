'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        setHasSubscription(!!data);
      }
      setLoading(false);
    };

    fetchUserAndSubscription();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-20 pb-16 text-center px-6">
        <h1 className="text-6xl font-bold mb-6">MyWornSkin</h1>
        <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
          Vêtements déjà portés. Intimes. Exclusifs.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {user ? (
          <div className="text-center mb-12">
            <p className="text-green-400 text-lg">
              Connecté en tant que {user.email}
            </p>
            
            {hasSubscription ? (
              <div className="mt-8">
                <p className="text-xl mb-4">✅ Tu as un abonnement actif</p>
                <Link 
                  href="/exclusive"
                  className="inline-block bg-white text-black font-bold py-4 px-12 rounded-2xl text-xl hover:bg-gray-200 transition"
                >
                  Accéder au contenu exclusif
                </Link>
              </div>
            ) : (
              <Link 
                href="/subscribe"
                className="inline-block bg-white text-black font-bold py-4 px-12 rounded-2xl text-xl hover:bg-gray-200 transition mt-6"
              >
                S'abonner maintenant
              </Link>
            )}
          </div>
        ) : (
          <Link href="/auth" className="block text-center text-xl underline">
            Se connecter
          </Link>
        )}

        {/* Section Sell */}
        <div className="mt-20 text-center">
          <Link 
            href="/sell"
            className="inline-block border border-white/50 hover:border-white px-10 py-4 rounded-2xl text-lg transition"
          >
            Vendre mes vêtements portés →
          </Link>
        </div>
      </div>
    </div>
  );
}
