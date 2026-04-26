import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CreatorProfile({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Liste des slugs valides
  if (!['lea-moreau', 'clara-voss', 'emma-laurent', 'nina-rivera'].includes(slug)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-4xl font-bold">Profil créatrice</h1>
      <p className="mt-6 text-xl">
        Slug actuel : <span className="font-mono text-rose-400">{slug}</span>
      </p>
      <p className="mt-8 text-zinc-400">
        Si tu vois ce message, la page charge correctement.<br />
        Le problème venait probablement du Header ou des composants.
      </p>
    </main>
  );
}
