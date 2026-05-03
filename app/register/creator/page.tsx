'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function BecomeCreatorPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const successRegister = await register(
      formData.email, 
      formData.password, 
      formData.username
    );

    if (successRegister) {
      setSuccess(true);
      
      // Redirection vers l'édition de profil après inscription
      setTimeout(() => {
        router.push('/profile/edit');
      }, 1800);
    } else {
      setError("Impossible de créer le compte. L'email est peut-être déjà utilisé.");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Compte créé avec succès ! 🎉</h1>
          <p className="text-zinc-400 mb-8">Redirection vers ton profil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-md mx-auto px-6 pb-20">
        <Link 
          href="/register" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au choix de compte
        </Link>

        <h1 className="text-4xl font-bold text-center mb-6">Devenir Créatrice</h1>
        <p className="text-center text-zinc-400 mb-10">
          Crée ton compte pour commencer à partager tes pièces.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Pseudo / Nom d’artiste</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="lea_intime"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="ton@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Mot de passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-center bg-red-950/50 py-3 rounded-2xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-700 rounded-2xl font-semibold text-lg transition-all"
          >
            {loading ? "Création du compte..." : "Créer mon compte créatrice"}
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
