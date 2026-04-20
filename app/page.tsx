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
      {/* Hero */}
      <div className="pt-20 pb-16 text-center px-6">
        <h1 className="text-6xl font-bold mb-6">MyWornSkin</h1>
        <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
          Vêtements déjà portés. Intimes. Exclusifs.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
        {user && (
          <div className="text-center">
            <p className="text-green-400">Connecté • {user.email}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {hasSubscription ? (
                <Link 
                  href="/exclusive"
                  className="bg-white text-black font-bold py-4 px-10 rounded-2xl text-lg hover:bg-gray-200 transition"
                >
                  Accéder au contenu exclusif 💋
                </Link>
              ) : (
                <Link 
                  href="/subscribe"
                  className="bg-white text-black font-bold py-4 px-10 rounded-2xl text-lg hover:bg-gray-200 transition"
                >
                  S'abonner maintenant
                </Link>
              )}

              <Link 
                href="/messages"
                className="border border-white/60 hover:border-white font-bold py-4 px-10 rounded-2xl text-lg transition"
              >
                Messagerie privée
              </Link>
            </div>
          </div>
        )}

        {!user && (
          <div className="text-center">
            <Link href="/auth" className="text-xl underline">
              Se connecter pour accéder à tout
            </Link>
          </div>
        )}

        {/* Sell Section */}
        <div className="text-center pt-12 border-t border-white/10">
          <Link 
            href="/sell"
            className="inline-block border border-white/50 hover:border-white px-12 py-5 rounded-2xl text-lg transition"
          >
            Vendre mes vêtements portés →
          </Link>
        </div>
      </div>
    </div>
  );
}
