'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Simulation pour l'instant (on branchera Supabase plus tard)
    setTimeout(() => {
      setSuccessMessage("✅ Compte client créé avec succès ! Redirection vers la connexion...");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <Header />

      <div className="max-w-md mx-auto px-6 pb-20">
        <Link href="/register" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8">
          ← Retour au choix de compte
        </Link>

        <h1 className="text-4xl font-bold text-center mb-10">Créer un compte Client</h1>

        {/* Toast vert */}
        {successMessage && (
          <div className="mb-8 p-4 bg-green-600 text-white rounded-2xl text-center font-medium">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-600/20 border border-red-600 text-red-400 rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nom complet</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="Marie Dupont"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="marie_worn"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="marie@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-700 rounded-2xl font-semibold text-lg transition-all"
          >
            {loading ? "Création du compte..." : "Créer mon compte client"}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-zinc-400">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-rose-400 hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
