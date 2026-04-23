'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const creators = [
  {
    id: '1',
    username: '@LilaNoir',
    name: 'Lila Noir',
    avatar: 'https://picsum.photos/id/64/300/300',
    banner: 'https://picsum.photos/id/1015/800/400',
    bio: 'Vêtements portés avec passion • Odeurs intimes garanties',
    price: 9.90,
    verified: true,
    volume: 127,
    active: true,
  },
  {
    id: '2',
    username: '@VelvetMuse',
    name: 'Velvet Muse',
    avatar: 'https://picsum.photos/id/65/300/300',
    banner: 'https://picsum.photos/id/201/800/400',
    bio: 'Lingerie fine et moments intenses',
    price: 12.90,
    verified: true,
    volume: 84,
    active: true,
  },
  {
    id: '3',
    username: '@SiennaRose',
    name: 'Sienna Rose',
    avatar: 'https://picsum.photos/id/66/300/300',
    banner: 'https://picsum.photos/id/133/800/400',
    bio: 'Chaussures et bas portés toute la journée',
    price: 8.90,
    verified: false,
    volume: 43,
    active: true,
  },
  {
    id: '4',
    username: '@LunaVelvet',
    name: 'Luna Velvet',
    avatar: 'https://picsum.photos/id/67/300/300',
    banner: 'https://picsum.photos/id/180/800/400',
    bio: 'Tout ce que j’ai porté cette semaine',
    price: 11.90,
    verified: true,
    volume: 219,
    active: false,
  },
];

export default function Creators() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'new'>('all');

  const filteredCreators = creators.filter(creator => {
    if (filter === 'verified') return creator.verified;
    if (filter === 'new') return creator.volume < 50;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Découvre les créatrices</h1>
          <p className="text-zinc-400 text-lg">Toutes les femmes qui partagent leur intimité</p>
        </div>

        {/* Filtres */}
        <div className="flex justify-center gap-3 mb-12">
          <button onClick={() => setFilter('all')} className={`px-8 py-3 rounded-3xl transition ${filter === 'all' ? 'bg-rose-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
            Toutes
          </button>
          <button onClick={() => setFilter('verified')} className={`px-8 py-3 rounded-3xl transition ${filter === 'verified' ? 'bg-rose-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
            Vérifiées
          </button>
          <button onClick={() => setFilter('new')} className={`px-8 py-3 rounded-3xl transition ${filter === 'new' ? 'bg-rose-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
            Nouvelles
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator) => (
            <div key={creator.id} className="card group overflow-hidden">
              <div className="relative h-56">
                <Image src={creator.banner} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  {creator.verified && (
                    <div className="bg-emerald-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      ✓ Vérifiée
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image src={creator.avatar} alt="" width={64} height={64} className="rounded-full ring-2 ring-zinc-800" />
                  <div>
                    <h3 className="font-semibold text-xl">{creator.name}</h3>
                    <p className="text-rose-400">{creator.username}</p>
                  </div>
                </div>

                <p className="text-zinc-400 line-clamp-2 mb-6">{creator.bio}</p>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-2xl font-bold">{creator.volume}</span>
                    <span className="text-xs text-zinc-500 ml-1">ventes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-zinc-400">Abonnement</span>
                    <div className="text-xl font-semibold text-rose-400">{creator.price} €/mois</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link 
                    href={`/creators/${creator.id}`}
                    className="flex-1 btn-secondary py-4 text-center"
                  >
                    Voir le profil
                  </Link>
                  <button className="flex-1 btn-primary py-4">
                    S'abonner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
