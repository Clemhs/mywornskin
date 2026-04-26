'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export const dynamic = 'force-dynamic';

export default function CreatorProfile() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="text-rose-400 mb-8 inline-block">
          ← Retour à l’accueil
        </Link>
        
        <h1 className="text-5xl font-bold">Profil de {slug}</h1>
        <p className="text-zinc-400 mt-6">
          Cette page est en cours de développement.<br />
          Slug actuel : <span className="text-white font-mono">{slug}</span>
        </p>
      </div>
    </main>
  );
}
