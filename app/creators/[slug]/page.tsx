import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CreatorProfile({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!['lea-moreau', 'clara-voss', 'emma-laurent'].includes(slug)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-12">
      <h1 className="text-5xl font-bold text-white">Profil créatrice</h1>
      <p className="mt-8 text-2xl text-zinc-300">
        Slug : <span className="font-mono text-rose-400">{slug}</span>
      </p>
      <p className="mt-12 text-zinc-400 text-lg">
        Si tu vois ce texte, la page charge correctement.<br />
        Le problème venait du Header.
      </p>
    </main>
  );
}
