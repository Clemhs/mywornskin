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
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const fetchItems = async () => {
      const { data } = await supabase
        .from('items')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });
      setItems(data || []);
    };
    fetchItems();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">MyWornSkin</h1>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-400">Bonjour, {user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl text-sm transition"
                >
                  Déconnexion
                </button>
                <Link 
                  href="/sell"
                  className="bg-white text-black font-semibold px-6 py-3 rounded-2xl hover:bg-gray-200 transition"
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

        <div className="text-center mb-16">
          <p className="text-2xl text-gray-400">Vêtements déjà portés • Vibe intime • Rien que pour toi</p>
        </div>

        <h2 className="text-3xl font-semibold mb-8">Vêtements en vente</h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Aucun vêtement disponible pour le moment.<br />
            Sois le premier à en mettre un en vente !
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                {item.images && item.images.length > 0 && (
                  <img 
                    src={item.images[0]} 
                    alt={item.title} 
                    className="w-full h-64 object-cover" 
                  />
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">{item.price} €</span>
                    <span className="text-xs bg-zinc-800 px-4 py-1.5 rounded-full">{item.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
