'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { ArrowLeft, User, Heart, ShoppingBag } from 'lucide-react';

export default function ProfilePage() {
  const { user, isCreator, refreshProfile } = useAuth();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProfile = async (attempt = 0) => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/profile', { 
          cache: 'no-store' 
        });

        if (!res.ok) throw new Error('Failed');

        const data = await res.json();
        
        if (isMounted) {
          setUserProfile(data);
          
          // Mise à jour du header SANS créer de boucle infinie
          if (refreshProfile && data) {
            setTimeout(() => {
              refreshProfile();
            }, 500); // Délai pour éviter le clignotement
          }
        }
      } catch (err) {
        console.error(`Tentative ${attempt + 1} échouée`, err);
        if (attempt < 3 && isMounted) {
          setTimeout(() => fetchProfile(attempt + 1), 1000);
          return;
        }
        if (isMounted) setError("Impossible de charger le profil");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user, refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20 flex items-center justify-center">
        <p className="text-zinc-400">Chargement du profil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Vous devez être connecté</p>
          <Link href="/login" className="text-rose-500 underline mt-4 inline-block">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Accueil
          </Link>
          <h1 className="text-4xl font-light">Mon Profil</h1>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 p-6 rounded-3xl mb-8">
            {error}
          </div>
        )}

        <div className="bg-zinc-900 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700">
              <img 
                src={userProfile?.avatar_url || '/default-avatar.png'} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-semibold">{userProfile?.full_name || 'Utilisateur'}</h2>
              <p className="text-rose-400">@{userProfile?.username || user.email}</p>
              <p className="text-zinc-400 mt-2">{isCreator ? 'Créatrice' : 'Client'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link href="/profile/favorites" className="bg-zinc-800 hover:bg-zinc-700 transition p-6 rounded-3xl flex flex-col items-center">
              <Heart className="w-10 h-10 mb-4 text-rose-500" />
              <span className="font-medium">Mes Favoris</span>
            </Link>

            <Link href="/profile/orders" className="bg-zinc-800 hover:bg-zinc-700 transition p-6 rounded-3xl flex flex-col items-center">
              <ShoppingBag className="w-10 h-10 mb-4" />
              <span className="font-medium">Mes Commandes</span>
            </Link>

            {isCreator && (
              <Link href="/sell" className="bg-zinc-800 hover:bg-zinc-700 transition p-6 rounded-3xl flex flex-col items-center">
                <User className="w-10 h-10 mb-4 text-emerald-500" />
                <span className="font-medium">Gérer mes produits</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
