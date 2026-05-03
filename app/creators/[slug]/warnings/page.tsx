'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CreatorWarningsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation (à remplacer par Supabase)
    const mockWarnings = [
      {
        id: 1,
        created_at: "2026-04-01",
        admin_message: "Attention : Certaines photos de produits ne respectent pas les règles de contenu explicite. Merci de les retirer ou de les modifier."
      }
    ];
    setWarnings(mockWarnings);
    setLoading(false);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 pt-32 text-center">
      <Header />
      Chargement...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/creators/${slug}`} className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" /> Avertissements
          </h1>
        </div>

        {warnings.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl p-16 text-center">
            <p className="text-zinc-400 text-lg">Aucun avertissement pour cette créatrice.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {warnings.map((w) => (
              <div key={w.id} className="bg-zinc-900 border border-yellow-500/30 rounded-3xl p-8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 text-yellow-400">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="font-medium">Avertissement officiel</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(w.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-zinc-200 leading-relaxed mt-6 whitespace-pre-wrap">{w.admin_message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
