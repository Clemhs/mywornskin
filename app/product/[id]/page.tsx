'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Volume2, Heart, Share2 } from 'lucide-react';
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

  // Détermine si l'utilisateur connecté est la créatrice de ce produit
  const isOwner = user?.id === product?.creator_id;

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
  const price = product.price || 45;

  const getTotalPrice = () => {
    if (selectedDays === 1) return price;
    if (selectedDays === 2) return product.price2Days || Math.round(price * 1.65);
    return (product.price2Days || Math.round(price * 1.65)) + (selectedDays - 2) * (product.extraDayPrice || 25);
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Retour
          </button>

          <div className="flex items-center gap-6 text-sm">
            <button className="flex items-center gap-2 hover:text-rose-400">
              <Heart size={20} /> Favoris
            </button>
            <button className="flex items-center gap-2 hover:text-rose-400">
              <Share2 size={20} /> Partager
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

          {/* Miniatures */}
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

          {product.video_url && (
            <div className="bg-zinc-900 rounded-3xl p-6">
              <video controls className="w-full rounded-2xl" />
            </div>
          )}

          {product.voice_url && (
            <button
              onClick={() => new Audio(product.voice_url).play()}
              className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 rounded-3xl flex items-center justify-center gap-3"
            >
              <Volume2 /> Écouter le message vocal
            </button>
          )}
        </div>

        {/* Contenu texte */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light">{product.title}</h1>
            <p className="text-4xl font-light text-rose-400 mt-2">{totalPrice} €</p>
          </div>

          {/* Sélection jours */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Nombre de jours portés</p>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDays(d)}
                  className={`py-4 rounded-2xl text-sm font-medium transition-all border ${
                    selectedDays === d
                      ? 'bg-rose-500 text-black border-rose-500'
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {d} jour{d > 1 ? 's' : ''}
                </button>
              ))}
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

          {/* Histoire intime */}
          <div>
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Histoire intime</h3>
            <div className="max-h-[320px] overflow-y-auto pr-4 text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {product.story || "Aucune histoire fournie."}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Description</h3>
            <div className="max-h-[260px] overflow-y-auto pr-4 text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {product.description || "Aucune description."}
            </div>
          </div>

          {/* Détails */}
          <div className="grid grid-cols-3 gap-y-6 text-sm">
            {product.size && <div><span className="text-zinc-500">Taille</span><br />{product.size}</div>}
            {product.shoe_size && <div><span className="text-zinc-500">Pointure</span><br />{product.shoe_size}</div>}
            {product.category && <div><span className="text-zinc-500">Type</span><br />{product.category}</div>}
          </div>

          {/* Bouton Panier */}
          {!isOwner ? (
            <button
              onClick={() => alert(`Ajouté au panier : ${product.title} (${selectedDays} jours) - ${totalPrice}€`)}
              className="w-full py-6 bg-white text-black font-semibold rounded-3xl text-lg hover:bg-rose-500 hover:text-white transition-all"
            >
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
