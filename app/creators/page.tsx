'use client';

import Link from 'next/link';

const creators = [
  {
    id: 1,
    username: "LilaNoir",
    avatar: "https://picsum.photos/id/64/300/300",
    banner: "https://picsum.photos/id/1015/800/400",
    bio: "Je vends ce que j’ai porté avec plaisir. Odeurs, histoires et un peu de moi.",
    items: 87,
    followers: "12.4k",
    verified: true,
  },
  {
    id: 2,
    username: "VelvetMuse",
    avatar: "https://picsum.photos/id/65/300/300",
    banner: "https://picsum.photos/id/102/800/400",
    bio: "Des pièces portées longtemps. Chaque vêtement raconte une nuit.",
    items: 64,
    followers: "8.9k",
    verified: true,
  },
  {
    id: 3,
    username: "SatinSecret",
    avatar: "https://picsum.photos/id/66/300/300",
    banner: "https://picsum.photos/id/1033/800/400",
    bio: "Ce que je portais quand personne ne regardait… maintenant à toi.",
    items: 31,
    followers: "15.2k",
    verified: false,
  },
];

export default function Creators() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="hero-text text-6xl tracking-tighter mb-4">Nos créateurs</h1>
          <p className="text-xl text-zinc-400">Tous les profils sont vérifiés manuellement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Link 
              key={creator.id} 
              href={`/creators/${creator.id}`}
              className="card group flex flex-col"
            >
              <div className="relative h-52">
                <img src={creator.banner} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    <img src={creator.avatar} alt="" className="w-24 h-24 rounded-2xl border-4 border-zinc-900 object-cover" />
                    {creator.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">✓ Vérifié</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 pt-16 pb-8 px-8 flex flex-col">
                <h3 className="text-2xl font-semibold">@{creator.username}</h3>
                <p className="text-rose-400 text-sm mt-1">{creator.followers} followers • {creator.items} pièces</p>
                
                <p className="text-zinc-400 text-[15px] leading-relaxed flex-1 mt-4">
                  {creator.bio}
                </p>

                <div className="mt-8 flex gap-4">
                  <button className="btn-secondary flex-1 py-3.5">Voir le profil</button>
                  <button className="btn-primary flex-1 py-3.5">S'abonner • 9,90 €/mois</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
