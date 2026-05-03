'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);

    if (success) {
      router.push('/'); // Redirection après connexion
      router.refresh(); // Force refresh du serveur pour mettre à jour les données
    } else {
      setError("Email ou mot de passe incorrect.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-md mx-auto px-6 pb-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l’accueil
        </Link>

        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
          Connexion
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400 transition-all"
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
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm bg-red-950/50 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-700 rounded-2xl font-semibold text-lg transition-all duration-200"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-zinc-400">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-rose-400 hover:underline font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
