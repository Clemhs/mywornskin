'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Écoute les changements de session
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">MyWornSkin</h1>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-400">
                  Connecté en tant que <strong>{user.email}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl text-sm transition"
                >
                  Déconnexion
                </button>
                <Link 
                  href="/sell"
                  className="bg-white text-black font-semibold px-6 py-2 rounded-xl hover:bg-gray-200 transition"
                >
                  Mettre en vente
                </Link>
              </>
            ) : (
              <Link 
                href="/auth"
                className="bg-white text-black font-semibold px-8 py-3 rounded-2xl hover:bg-gray-200 transition"
              >
                Se connecter / S'inscrire
              </Link>
            )}
          </div>
        </div>

        <div className="text-center mb-20">
          <p className="text-2xl text-gray-400 mb-4">
            Vêtements déjà portés • Vibe intime • Rien que pour toi
          </p>
          <p className="text-gray-500">
            Partage tes pièces les plus intimes avec ceux qui les désirent vraiment.
          </p>
        </div>

        <div className="text-center text-gray-500 text-sm">
          Aucun vêtement disponible pour le moment<br />
          Connecte-toi et mets tes vêtements en vente pour commencer
        </div>
      </div>
    </div>
  );
}
