'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';
// import Review from '@/components/Review'; // Commenté car le composant n'existe pas encore

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user } = useAuth();

  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const supabase = createClient();   // ← Correction ici

  // Gestion du slug "me"
  useEffect(() => {
    if (slug === 'me') {
      if (!user) {
        router.push('/login');
        return;
      }

      const username = user.user_metadata?.username || user.email?.split('@')[0];
      if (username) {
        router.replace(`/creators/${username}`);
      }
    }
  }, [slug, user, router]);

  // Récupération des données
  const fetchCreatorData = async () => {
    if (!slug || slug === 'me') return;

    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', slug)
        .single();

      if (creatorError || !creatorData) {
        setError('Créatrice non trouvée');
        setLoading(false);
        return;
      }

      setCreator(creatorData);

      // Produits
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('created_at', { ascending: false });

      setProducts(productsData || []);

      // Avis
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('created_at', { ascending: false });

      setReviews(reviewsData || []);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && slug !== 'me') {
      fetchCreatorData();
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement du profil...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-xl text-red-400">{error || 'Créatrice non trouvée'}</div>;

  const isMyProfile = user && creator.username === (user.user_metadata?.username || '');

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <Header />

      {/* Bannière */}
      <div className="h-80 relative">
        <img 
          src={creator.banner_url || "https://picsum.photos/id/1015/1200/400"} 
          alt="Bannière" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative -mt-12 md:-mt-20 flex-shrink-0">
            <img 
              src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
              alt={creator.username} 
              className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover" 
            />
          </div>

          <div className="pt-6 flex-1">
            <h1 className="text-4xl font-bold">{creator.username}</h1>
            <p className="text-zinc-400 mt-2">{creator.bio || "Passionnée de lingerie fine..."}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {(creator.badges || ["Voie Sensuelle", "Chasseuse d'Odeurs"]).map((badge: string, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-2xl text-sm font-medium">
                  <Award className="w-4 h-4 text-rose-400" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boutique */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Sa boutique ({products.length} pièces)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <StoryCard key={p.id} {...p} creator={creator.username} creatorSlug={slug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
