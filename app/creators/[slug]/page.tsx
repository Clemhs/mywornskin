'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user } = useAuth();
  const supabase = createClient();

  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gestion du "me" + redirection propre
  useEffect(() => {
    if (slug === 'me') {
      if (!user) {
        router.push('/login');
        return;
      }
      // Redirection vers le username du créateur
      router.replace(`/creators/${user.user_metadata?.username || 'creator_test'}`);
    }
  }, [slug, user, router]);

  const fetchCreatorData = async () => {
    if (!slug || slug === 'me') return;

    try {
      // Recherche par username dans profiles
      let { data: creatorData } = await supabase
        .from('profiles')
        .select('*, creators(*)')
        .eq('username', slug)
        .single();

      if (!creatorData) {
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

      // Avis approuvés
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('creator_id', creatorData.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);

      setApprovedReviews(reviewsData || []);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && slug !== 'me') fetchCreatorData();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement du profil...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-red-400">{error || 'Créatrice non trouvée'}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
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
            <div className="relative">
              <img 
                src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
                alt={creator.username} 
                className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover" 
              />
            </div>
          </div>

          <div className="pt-6 flex-1">
            <h1 className="text-4xl font-bold">{creator.full_name || creator.username}</h1>
            <p className="text-rose-400">@{creator.username}</p>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
            </p>
          </div>
        </div>

        {/* Le reste de ton code (boutique, avis, etc.) reste identique */}
        {/* ... (je garde ton code existant pour le reste) */}
      </div>
    </div>
  );
}
