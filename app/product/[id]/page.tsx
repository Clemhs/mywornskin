'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Heart, Share2 } from 'lucide-react';
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

  // Tarification conditionnelle
  const [baseDays, setBaseDays] = useState(1); // 1 ou 2
  const [extraDays, setExtraDays] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          creator:profiles!creator_id (*)
        `)
        .eq('id', params.id)
        .single();

      if (data) {
        setProduct(data);
        if (data.images?.length) setCurrentImage(0);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">Chargement du produit...</div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-rose-400">Produit non trouvé</div>;

  const images = product.images || [];
  const isOwner = user?.id === product.creator_id;

  // Calcul du prix total
  const calculateTotal = () => {
    let total = product.price || 45;

    if (baseDays === 2 && product.price2Days) {
      total = product.price2Days;
    }

    if (extraDays > 0 && product.extraDayPrice) {
      total += extraDays * product.extraDayPrice;
    }

    return Math.round(total);
  };

  const totalPrice = calculateTotal();

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="sticky top-0 bg-black/95 border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Retour
          </button>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-rose-400">
              <Heart size={20} />
            </button>
            <button className="flex items-center gap-2 hover:text-rose-400">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galerie */}
        <div className="space-y-6">
          <div className="aspect-[4/4.5] bg-zinc-900 rounded-3xl overflow-hidden">
            {images.length > 0 ? (
              <img src={images[currentImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">Pas d'image</div>
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

          {product.video_url && <div className="bg-zinc-900 rounded-3xl p-6"><video controls className="w-full rounded-2xl" /></div>}

          {product.voice_url && (
            <button onClick={() => new Audio(product.voice_url).play()} className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 rounded-3xl flex items-center justify-center gap-3">
              <Volume2 /> Écouter le message vocal
            </button>
          )}
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light leading-tight">{product.title}</h1>
            <p className="text-4xl font-light text-rose-400 mt-3">{totalPrice} €</p>
          </div>

          {/* Tarification conditionnelle */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Durée du port</p>
            <div className="flex flex-wrap gap-3">
              {/* 1 jour - toujours présent */}
              <button
                onClick={() => setBaseDays(1)}
                className={`px-7 py-4 rounded-2xl border text-sm font-medium transition-all ${baseDays === 1 ? 'bg-rose-500 text-black border-rose-500' : 'border-zinc-700 hover:border-zinc-500'}`}
              >
                1 jour
              </button>

              {/* 2 jours - seulement si défini */}
              {product.price2Days && (
                <button
                  onClick={() => setBaseDays(2)}
                  className={`px-7 py-4 rounded-2xl border text-sm font-medium transition-all ${baseDays === 2 ? 'bg-rose-500 text-black border-rose-500' : 'border-zinc-700 hover:border-zinc-500'}`}
                >
                  2 jours
                </button>
              )}

              {/* Jours supplémentaires - seulement si défini */}
              {product.extraDayPrice && (
                <div className="flex items-center gap-4 border border-zinc-700 rounded-2xl px-6 py-4">
                  <button onClick={() => setExtraDays(Math.max(0, extraDays - 1))} className="text-xl w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-xl">-</button>
                  <span className="font-medium min-w-[24px] text-center">{extraDays}</span>
                  <button onClick={() => setExtraDays(extraDays + 1)} className="text-xl w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-xl">+</button>
                  <span className="text-sm text-zinc-400">jours supp.</span>
                </div>
              )}
            </div>
          </div>

          {/* Créatrice */}
          <div className="flex items-center gap-4">
            <img src={product.creator?.avatar_url} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-medium">{product.creator?.full_name}</p>
              <p className="text-sm text-zinc-500">@{product.creator?.username}</p>
            </div>
          </div>

          {/* Histoire intime - hauteur naturelle */}
          <div>
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Histoire intime</h3>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {product.story || "Aucune histoire fournie."}
            </div>
          </div>

          {/* Description - hauteur naturelle */}
          <div>
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Description</h3>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {product.description || "Aucune description."}
            </div>
          </div>

          {/* Détails */}
          <div className="grid grid-cols-3 gap-6 text-sm">
            {product.size && <div><span className="text-zinc-500">Taille</span><br />{product.size}</div>}
            {product.shoe_size && <div><span className="text-zinc-500">Pointure</span><br />{product.shoe_size}</div>}
            {product.category && <div><span className="text-zinc-500">Type</span><br />{product.category}</div>}
          </div>

          {/* Bouton Panier */}
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
  );
}
