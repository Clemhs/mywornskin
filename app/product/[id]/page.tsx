'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Volume2, Heart, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StoryCard from '@/components/StoryCard'; // si tu veux des suggestions en bas

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          creator:profiles!creator_id (
            username, full_name, avatar_url, city, country
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProduct(data);
        // Première image par défaut
        if (data.images?.length > 0) setCurrentImage(0);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">Chargement du produit...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-rose-400">Produit non trouvé</div>;
  }

  const images = product.images || [];
  const hasVideo = !!product.video_url;
  const hasVoice = !!product.voice_url;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header simple */}
      <div className="sticky top-0 bg-black/90 border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="ml-auto flex items-center gap-6 text-sm">
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
        {/* === GALERIE === */}
        <div className="space-y-6">
          <div className="aspect-[4/4.5] bg-zinc-900 rounded-3xl overflow-hidden relative">
            {images.length > 0 ? (
              <img
                src={images[currentImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                Image du produit
              </div>
            )}
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-rose-500' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Vidéo */}
          {hasVideo && (
            <div className="bg-zinc-900 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Play className="text-rose-400" />
                <span className="font-medium">Vidéo du porté</span>
              </div>
              <video
                controls
                className="w-full rounded-2xl"
                onPlay={() => setIsPlayingVideo(true)}
                onPause={() => setIsPlayingVideo(false)}
              >
                <source src={product.video_url} type="video/mp4" />
              </video>
            </div>
          )}
        </div>

        {/* === INFOS === */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light mb-2">{product.title}</h1>
            <p className="text-rose-400 text-3xl font-light">
              {product.price} €
            </p>
          </div>

          <div className="flex gap-6 text-sm text-zinc-400">
            <div>Porté {product.worn_days || '?'} jour{product.worn_days > 1 ? 's' : ''}</div>
            <div>{images.length} photos</div>
            {hasVoice && <div>♪ Vocal disponible</div>}
          </div>

          {/* Créatrice */}
          <div className="flex items-center gap-4">
            <img
              src={product.creator?.avatar_url || '/default-avatar.png'}
              alt={product.creator?.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{product.creator?.full_name}</p>
              <p className="text-sm text-zinc-500">@{product.creator?.username}</p>
            </div>
          </div>

          {/* Histoire intime */}
          <div>
            <h3 className="uppercase tracking-widest text-xs text-zinc-500 mb-3">Histoire intime</h3>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {product.story || "Aucune histoire fournie pour le moment."}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="uppercase tracking-widest text-xs text-zinc-500 mb-3">Description</h3>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Détails */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            {product.size && (
              <div><span className="text-zinc-500">Taille :</span> {product.size}</div>
            )}
            {product.shoe_size && (
              <div><span className="text-zinc-500">Pointure :</span> {product.shoe_size}</div>
            )}
            {product.category && (
              <div><span className="text-zinc-500">Type :</span> {product.category}</div>
            )}
          </div>

          {/* Bouton Ajouter au panier */}
          <button
            onClick={() => {
              // Logique panier existante (localStorage ou context)
              alert("Produit ajouté au panier !");
            }}
            className="w-full py-5 bg-white text-black font-semibold rounded-3xl hover:bg-rose-500 hover:text-white transition-all text-lg"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
