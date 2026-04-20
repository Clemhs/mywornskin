'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setItems(data || []);
    }

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">MyWornSkin</h1>
          <p className="text-2xl text-gray-400">
            Vêtements déjà portés • Vibe intime • Rien que pour toi
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-8">Vêtements disponibles</h2>
          
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              Aucun vêtement disponible pour le moment...<br />
              Les créateurs vont bientôt mettre en ligne leurs pièces portées.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                  {item.images && item.images.length > 0 && (
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{item.price} €</span>
                      <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">
                        {item.condition}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center text-gray-500 text-sm">
          Plateforme en cours de développement • Messagerie privée et upload bientôt disponibles
        </div>
      </div>
    </div>
  );
}
