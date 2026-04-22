'use client';

import Link from 'next/link';

const creators = [
  {
    id: 1,
    username: "LilaNoir",
    avatar: "https://picsum.photos/id/64/300/300",
    banner: "https://picsum.photos/id/1015/800/400",
    bio: "Je vends ce que j’ai porté avec plaisir. Odeurs, histoires et un peu de moi.",
    items: 24,
    followers: "12.4k",
  },
  {
    id: 2,
    username: "VelvetMuse",
    avatar: "https://picsum.photos/id/65/300/300",
    banner: "https://picsum.photos/id/102/800/400",
    bio: "Des pièces portées longtemps. Chaque vêtement raconte une nuit.",
    items: 19,
    followers: "8.9k",
  },
  {
    id: 3,
    username: "SatinSecret",
    avatar: "https://picsum.photos/id/66/300/300",
    banner: "https://picsum.photos/id/1033/800/400",
    bio: "Ce que je portais quand personne ne regardait… maintenant à toi.",
    items: 31,
    followers: "15.2k",
  },
  {
    id: 4,
    username: "RoseObsession",
    avatar: "https://picsum.photos/id/67/300/300",
    banner: "https://picsum.photos/id/106/800/400",
    bio: "Sensualité en seconde main. Viens sentir mon univers.",
    items: 17,
    followers: "6.7k",
  },
];

export default function Creators() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tighter mb-4">
            Nos créateurs
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Des femmes et hommes qui partagent un peu d’eux à travers leurs vêtements portés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Link 
              key={creator.id} 
              href={`/creators/${creator.id}`}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-500/50 transition-all duration-300"
            >
              <div className="relative h-48">
                <img 
                  src={creator.banner} 
                  alt={creator.username} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <img 
                  src={creator.avatar} 
                  alt={creator.username} 
                  className="absolute -bottom-12 left-6 w-24 h-24 rounded-2xl border-4 border-zinc-900 object-cover" 
                />
              </div>

              <div className="pt-16 pb-8 px-8">
                <h3 className="text-2xl font-semibold mb-1">@{creator.username}</h3>
                <p className="text-rose-400 text-sm mb-4">{creator.followers} followers • {creator.items} pièces</p>
                
                <p className="text-zinc-400 text-[15px] leading-relaxed line-clamp-3 mb-8">
                  {creator.bio}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 group-hover:text-rose-400 transition">
                    Voir le profil →
                  </span>
                  <button className="text-sm bg-rose-600 hover:bg-rose-500 px-6 py-2.5 rounded-full transition">
                    S'abonner • 9,90 €/mois
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 text-zinc-500 text-sm">
          Et bien d’autres créateurs arrivent bientôt…
        </div>
      </div>
    </div>
  );
}
