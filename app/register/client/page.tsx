'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ClientRegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const success = await register(formData.email, formData.password, formData.username);

    if (success) {
      setSuccessMessage("✅ Compte créé avec succès ! Vérifie ta boîte mail pour confirmer ton adresse.");
      
      // Redirection après 2.5s
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } else {
      setError("Une erreur est survenue lors de la création du compte. L'email est peut-être déjà utilisé.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-md mx-auto px-6 pb-20">
        <Link 
          href="/register" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          ← Retour au choix de compte
        </Link>

        <h1 className="text-4xl font-bold text-center mb-10">Créer un compte Client</h1>

        {successMessage && (
          <div className="mb-8 p-4 bg-green-600/10 border border-green-500 text-green-400 rounded-2xl text-center">
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
              minLength={6}
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
