'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Award } from 'lucide-react';

export default function CreatorProfilePage() {
  const params = useParams();
  const slug = params.slug as string;

  // Simulation (à remplacer par Supabase)
  const creator = {
    slug,
    username: slug === "sienna-rose" ? "Sienna Rose" : slug === "nova-lune" ? "Nova Lune" : "Lila Noir",
    avatar: "https://picsum.photos/id/1011/280/280",
    banner: "https://picsum.photos/id/1005/1200/400",
    verified: true,
    price: 55,
    bio: "Je partage avec toi les vêtements que j’ai portés, avec leur odeur, leur histoire et leur chaleur. Chaque pièce est unique.",
    frame: "rose",
    badge: "Chasseuse d'Odeurs",
    salesCount: 47,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Bannière publique */}
      <div className="relative h-80">
        <img src={creator.banner} alt={creator.username} className="w-full h-full object-cover" />
        {creator.frame && (
          <div className={`shimmer-frame absolute inset-0 rounded-b-3xl pointer-events-none ${creator.frame}`} />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar public */}
          <div className="relative -mt-12 md:-mt-16">
            <div className="relative">
              <img 
                src={creator.avatar} 
                alt={creator.username} 
                className="w-40 h-40 rounded-3xl ring-8 ring-zinc-950 object-cover" 
              />
              {creator.badge && (
                <div className="absolute -top-2 -right-2 bg-zinc-900 px-4 py-1 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-400" />
                  {creator.badge}
                </div>
              )}
            </div>
          </div>

          {/* Infos */}
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold">{creator.username}</h1>
              {creator.verified && <span className="text-rose-400 text-3xl">✓</span>}
            </div>
            <p className="text-3xl font-semibold text-rose-400 mt-1">{creator.price}€ / mois</p>
            <p className="mt-6 text-zinc-300 max-w-2xl leading-relaxed">{creator.bio}</p>

            <div className="mt-8 flex gap-6 text-sm text-zinc-400">
              <div>{creator.salesCount} ventes</div>
              <div>Créatrice vérifiée</div>
            </div>
          </div>
        </div>

        {/* Boutique exemple */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium mb-6">Sa boutique</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Ajoute tes articles ici plus tard */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .shimmer-frame {
          animation: shimmer 10s linear infinite;
          background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%);
          background-size: 200% 100%;
          box-shadow: 0 0 20px -3px currentColor, inset 0 0 20px -3px currentColor;
        }
        .shimmer-frame.rose { color: #f472b6; }
        .shimmer-frame.silver { color: #e2e8f0; }
        .shimmer-frame.gold { color: #fbbf24; }
      `}</style>
    </div>
  );
}
