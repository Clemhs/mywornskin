'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const creators = [
  {
    id: '1',
    username: '@LilaNoir',
    name: 'Lila Noir',
    avatar: 'https://picsum.photos/id/64/300/300',
    banner: 'https://picsum.photos/id/1015/800/400',
    bio: 'Vêtements portés avec passion • Odeurs intimes garanties • 127 ventes',
    price: 9.90,
    verified: true,
    volume: 127,
    longevity: '1 an',
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
    longevity: '8 mois',
  },
];

export default function CreatorProfile() {
  const params = useParams();
  const creator = creators.find(c => c.id === params.id);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!creator) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Créateur non trouvé</div>;
  }

  const handleSubscribe = () => {
    setIsSubscribed(true);
    alert(`✅ Abonnement activé à ${creator.username} pour ${creator.price} €/mois !`);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Banner */}
      <div className="h-80 relative">
        <Image src={creator.banner} alt="banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar + Badges */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="relative mx-auto md:mx-0 w-48 h-48">
              <Image 
                src={creator.avatar} 
                alt={creator.name} 
                width={192} 
                height={192} 
                className="rounded-full border-4 border-zinc-900 object-cover" 
              />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  ✓ Vérifiée
                </div>
              )}
            </div>

            {creator.volume && (
              <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900 border border-rose-500/30 rounded-2xl px-5 py-2">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-lg">{creator.volume}</span>
                <span className="text-sm text-zinc-400">ventes</span>
              </div>
            )}

            {creator.longevity && (
              <div className="mt-3 text-sm text-amber-400 font-medium">
                🏆 {creator.longevity} sur la plateforme
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 pt-6">
            <h1 className="text-4xl font-bold">{creator.name}</h1>
            <p className="text-rose-400 text-xl">{creator.username}</p>
            <p className="mt-6 text-zinc-300 leading-relaxed">{creator.bio}</p>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={handleSubscribe}
                className="btn-primary flex-1 py-6 text-lg font-semibold"
              >
                {isSubscribed ? "✓ Abonné" : `S'abonner • ${creator.price} €/mois`}
              </button>

              <Link href="/messages" className="flex-1 border border-zinc-700 hover:border-rose-500 py-6 text-center rounded-3xl font-medium transition">
                Envoyer un message
              </Link>
            </div>
          </div>
        </div>

        {/* Galerie exemple */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">Derniers articles portés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <img 
                key={i}
                src={`https://picsum.photos/id/${60 + i}/400/400`} 
                alt="item" 
                className="rounded-3xl aspect-square object-cover hover:scale-105 transition" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
