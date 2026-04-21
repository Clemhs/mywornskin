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
    monthlyPrice: '9,99',
  },
  'sophie-moreau': {
    name: 'Sophie Moreau',
    avatar: 'https://i.pravatar.cc/300?img=2',
    banner: 'https://picsum.photos/id/1027/1200/400',
    bio: 'Je partage mes tenues du quotidien, mes collants, mes robes... tout ce qui a été porté avec plaisir.',
    subscribers: '5.9k',
    itemsCount: 19,
    monthlyPrice: '7,99',
  },
  'lisa-vert': {
    name: 'Lisa Vert',
    avatar: 'https://i.pravatar.cc/300?img=3',
    banner: 'https://picsum.photos/id/106/1200/400',
    bio: 'Spécialisée dans les accessoires et vêtements intimes du quotidien. Toujours prête à partager mes pièces favorites.',
    subscribers: '12.1k',
    itemsCount: 34,
    monthlyPrice: '11,99',
  },
};

export default function CreatorProfile() {
  const params = useParams();
  const id = params.id as string;
  const creator = creatorsData[id];

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Créateur non trouvé</h1>
          <Link href="/creators" className="text-rose-400 hover:underline text-lg">
            ← Retour à la liste des créateurs
          </Link>
        </div>
      </div>
    );
  }

  const handleSubscribe = () => {
    const confirmed = window.confirm(
      `Confirmer l'abonnement à ${creator.name} pour ${creator.monthlyPrice} € par mois ?\n\n(Ceci est une simulation)`
    );
    if (confirmed) {
      alert(`✅ Abonnement activé pour ${creator.name} !\n\nVous avez maintenant accès à son contenu exclusif.`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Banner */}
      <div className="h-80 relative">
        <img 
          src={creator.banner} 
          alt={creator.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Avatar */}
          <div className="flex-shrink-0 text-center md:text-left">
            <img 
              src={creator.avatar} 
              alt={creator.name}
              className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover shadow-2xl mx-auto md:mx-0"
            />
            <h1 className="text-5xl font-bold mt-6 mb-1">{creator.name}</h1>
            <p className="text-rose-400">@{id.replace('-', '')}</p>
          </div>

          {/* Info + Abonnement */}
          <div className="flex-1 pt-8">
            <p className="text-zinc-300 leading-relaxed text-lg mb-10 max-w-2xl">
              {creator.bio}
            </p>

            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <div className="text-3xl font-semibold text-white">{creator.subscribers}</div>
                <div className="text-zinc-500">abonnés</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">{creator.itemsCount}</div>
                <div className="text-zinc-500">pièces en vente</div>
              </div>
            </div>

            {/* Bouton Abonnement */}
            <button 
              onClick={handleSubscribe}
              className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 px-14 py-6 rounded-2xl text-xl font-semibold transition-all shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3"
            >
              S'abonner à {creator.name.split(' ')[0]} — {creator.monthlyPrice} € / mois
            </button>
            
            <p className="text-center text-xs text-zinc-500 mt-4">
              Accès exclusif aux photos, vidéos et messages privés
            </p>
          </div>
        </div>

        {/* Galerie */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-10">Ses dernières pièces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-500/50 transition-all hover:-translate-y-1">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/id/${100 + i}/600/600`} 
                    alt="Vêtement"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <div className="font-medium">Pièce #{i+1}</div>
                  <div className="text-rose-400 font-semibold">29,90 €</div>
                  <div className="text-xs text-zinc-500 mt-1">Porté récemment • Très bon état</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
