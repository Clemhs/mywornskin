'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const creatorsData: any = {
  'emma-laurent': {
    name: 'Emma Laurent',
    avatar: 'https://i.pravatar.cc/300?img=1',
    banner: 'https://picsum.photos/id/1015/1200/400',
    bio: 'Passionnée de lingerie fine et de vêtements portés avec émotion. Chaque pièce raconte une histoire intime.',
    subscribers: '8.4k',
    itemsCount: 27,
  },
  'sophie-moreau': {
    name: 'Sophie Moreau',
    avatar: 'https://i.pravatar.cc/300?img=2',
    banner: 'https://picsum.photos/id/1027/1200/400',
    bio: 'Je partage mes tenues du quotidien, mes collants, mes robes... tout ce qui a été porté avec plaisir.',
    subscribers: '5.9k',
    itemsCount: 19,
  },
  'lisa-vert': {
    name: 'Lisa Vert',
    avatar: 'https://i.pravatar.cc/300?img=3',
    banner: 'https://picsum.photos/id/106/1200/400',
    bio: 'Spécialisée dans les accessoires et vêtements intimes du quotidien. Toujours prête à partager mes pièces favorites.',
    subscribers: '12.1k',
    itemsCount: 34,
  },
};

export default function CreatorProfile() {
  const params = useParams();
  const id = params.id as string;
  const creator = creatorsData[id];

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Créateur non trouvé</h1>
          <Link href="/creators" className="text-rose-400 hover:underline">
            Retour à la liste des créateurs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Banner */}
      <div className="h-80 relative">
        <img 
          src={creator.banner} 
          alt={creator.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img 
              src={creator.avatar} 
              alt={creator.name}
              className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-6">
            <h1 className="text-5xl font-bold mb-2">{creator.name}</h1>
            <p className="text-rose-400 text-lg mb-6">@{id.replace('-', '')}</p>
            
            <p className="text-zinc-300 leading-relaxed max-w-2xl mb-8">
              {creator.bio}
            </p>

            <div className="flex gap-8 text-sm mb-10">
              <div>
                <span className="font-semibold text-2xl text-white">{creator.subscribers}</span>
                <div className="text-zinc-500">abonnés</div>
              </div>
              <div>
                <span className="font-semibold text-2xl text-white">{creator.itemsCount}</span>
                <div className="text-zinc-500">pièces en vente</div>
              </div>
            </div>

            <button className="bg-rose-600 hover:bg-rose-500 px-10 py-4 rounded-2xl text-lg font-medium transition-all w-full md:w-auto">
              S'abonner à {creator.name.split(' ')[0]} — 9,99 €/mois
            </button>
          </div>
        </div>

        {/* Galerie des pièces */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold mb-8">Ses dernières pièces</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-500/30 transition">
                <img 
                  src={`https://picsum.photos/id/${100 + i}/600/600`} 
                  alt="Vêtement porté"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 bg-black/70">
                  <div className="font-medium">Pièce #{i+1}</div>
                  <div className="text-rose-400 text-sm">29,90 €</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
