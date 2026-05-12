'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Volume2, Heart, Share2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDays, setSelectedDays] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          creator:profiles!creator_id (*)
        `)
        .eq('id', params.id)
        .single();

      if (error) console.error("Erreur chargement produit:", error);
      if (data) {
        setProduct(data);
        if (data.images?.length) setCurrentImage(0);

        if (user) {
          const { data: fav } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', data.id)
            .single();
          setIsFavorited(!!fav);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id, user]);

  const calculateTotal = () => {
    if (!product) return 0;
    let total = product.price || 45;

    if (selectedDays === 2 && product.price2Days) {
      total = product.price2Days;
    }
    if (selectedDays > 2 && product.extraDayPrice) {
      total += (selectedDays - 2) * product.extraDayPrice;
    }
    return Math.round(total);
  };

  const totalPrice = calculateTotal();

  const toggleFavorite = async () => {
    if (!user || !product) return;
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id);
      setIsFavorited(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, product_id: product.id });
      setIsFavorited(true);
    }
  };

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1800);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">Chargement du produit...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-rose-400">Produit non trouvé</div>;
  }

  const images = product.images || [];
  const isOwner = user?.id === product.creator_id;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Bandeau fixe (Retour + Favoris + Partager) */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-6">
            <button onClick={toggleFavorite} className="hover:text-rose-400 transition">
              <Heart size={22} className={isFavorited ? "fill-rose-500 text-rose-500" : ""} />
            </button>
            <button onClick={shareProduct} className="hover:text-rose-400 transition relative">
              <Share2 size={22} />
              {showCopied && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-zinc-800 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  ✅ Lien copié
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal avec espace pour le bandeau fixe */}
      <div className="pt-20">   {/* ← Important */}
        <div className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie */}
          <div className="space-y-6">
            <div className="aspect-[4/4.5] bg-zinc-900 rounded-3xl overflow-hidden">
              {images.length > 0 ? (
                <img src={images[currentImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">Pas d'image disponible</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-4">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === i ? 'border-rose-500' : 'border-transparent'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {product.video_url && <video controls className="w-full rounded-3xl bg-black" />}
            {product.voice_url && (
              <button onClick={() => new Audio(product.voice_url).play()} className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 rounded-3xl flex items-center justify-center gap-3">
                <Volume2 /> Écouter le message vocal
              </button>
            )}
          </div>

          {/* Texte */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-light leading-tight break-words">{product.title}</h1>
              <p className="text-4xl font-light text-rose-400 mt-3">{totalPrice} €</p>
            </div>

            {/* Durée du port */}
            <div>
              <p className="text-sm text-zinc-400 mb-3">Durée du port</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setSelectedDays(1)} className={`px-8 py-4 rounded-2xl border ${selectedDays === 1 ? 'bg-rose-500 text-black' : 'border-zinc-700 hover:border-zinc-500'}`}>1 jour</button>
                {product.price2Days && (
                  <button onClick={() => setSelectedDays(2)} className={`px-8 py-4 rounded-2xl border ${selectedDays === 2 ? 'bg-rose-500 text-black' : 'border-zinc-700 hover:border-zinc-500'}`}>2 jours</button>
                )}
                {product.extraDayPrice && (
                  <div className="flex items-center gap-4 border border-zinc-700 rounded-2xl px-6 py-4">
                    <button onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))} className="text-2xl w-9 h-9 hover:bg-zinc-800 rounded-xl">-</button>
                    <span className="font-medium text-lg min-w-[40px] text-center">{selectedDays} jour{selectedDays > 1 ? 's' : ''}</span>
                    <button onClick={() => setSelectedDays(selectedDays + 1)} className="text-2xl w-9 h-9 hover:bg-zinc-800 rounded-xl">+</button>
                  </div>
                )}
              </div>
            </div>

            {/* Créatrice */}
            <Link href={`/creators/${product.creator?.username}`} className="flex items-center gap-4 hover:opacity-80">
              <img src={product.creator?.avatar_url} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-medium">{product.creator?.full_name}</p>
                <p className="text-rose-400">@{product.creator?.username}</p>
              </div>
            </Link>

            {/* Histoire intime */}
            <div>
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Histoire intime</h3>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                {product.story || "Aucune histoire fournie."}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Description</h3>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                {product.description || "Aucune description."}
              </div>
            </div>

            {/* Détails */}
            <div className="grid grid-cols-3 gap-6 text-sm">
              {product.size && <div><span className="text-zinc-500">Taille</span><br/>{product.size}</div>}
              {product.shoe_size && <div><span className="text-zinc-500">Pointure</span><br/>{product.shoe_size}</div>}
              {product.category && <div><span className="text-zinc-500">Type</span><br/>{product.category}</div>}
            </div>

            {!isOwner ? (
              <button className="w-full py-6 bg-white text-black font-semibold rounded-3xl text-lg hover:bg-rose-500 hover:text-white transition-all">
                Ajouter au panier — {totalPrice} €
              </button>
            ) : (
              <p className="text-center py-6 text-zinc-500">Vous ne pouvez pas acheter votre propre article</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
