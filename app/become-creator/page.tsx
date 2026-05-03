'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BecomeCreatorPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation pour l'instant (on branchera Supabase plus tard)
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile/edit'); // Redirection vers édition de profil
      }, 1500);
    }, 800);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Compte créé avec succès ! 🎉</h1>
          <p className="text-zinc-400 mb-8">Redirection vers ton profil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-md mx-auto px-6 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12">
          <ArrowLeft className="w-5 h-5" />
          Retour à l’accueil
        </Link>

        <h1 className="text-4xl font-bold text-center mb-10">Devenir Créatrice</h1>
        <p className="text-center text-zinc-400 mb-10">Crée ton compte pour commencer à partager tes pièces.</p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Pseudo / Nom d’artiste</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="lea_intime"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="ton@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-700 rounded-2xl font-semibold text-lg transition-all"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-zinc-400">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-rose-400 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
