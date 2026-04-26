'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Mic, BookOpen, Heart, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import Review from '../../../components/Review';   // ← Chemin corrigé

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const product = {
    id,
    title: id === "1" ? "Culotte en dentelle noire" : 
           id === "2" ? "Bas résille déchirés" : "Chemise blanche froissée",
    price: id === "1" ? 45 : id === "2" ? 32 : 68,
    wornDays: id === "1" ? 3 : id === "2" ? 1 : 2,
    creatorName: id === "1" ? "Léa Moreau" : id === "2" ? "Clara Voss" : "Emma Laurent",
    creatorSlug: id === "1" ? "lea-moreau" : id === "2" ? "clara-voss" : "emma-laurent",
    image: `https://picsum.photos/id/${id === "1" ? 1015 : id === "2" ? 201 : 251}/800/1200`,
    fullStory: "C'était une soirée très spéciale... Je l'ai portée toute la nuit en pensant à toi. L'odeur est encore très présente, un mélange de ma peau, de mon parfum préféré et de l'excitation du moment.",
    hasVoice: true,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Avis simulés
  const [reviews, setReviews] = useState([
    {
      id: "r1",
      author: "Sophie D.",
      rating: 5,
      comment: "L'odeur est incroyable, exactement comme décrit. L'histoire m'a vraiment touchée. Recommande à 100% !",
      date: "Il y a 2 jours",
    },
    {
      id: "r2",
      author: "Julie M.",
      rating: 4,
      comment: "Très belle pièce, l'odeur est présente. Le vocal est émouvant.",
      date: "Il y a 1 semaine",
    },
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const review = {
      id: `r${Date.now()}`,
      author: "Vous (Client anonyme)",
      rating: newReview.rating,
      comment: newReview.comment,
      date: "À l'instant",
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Retour aux pièces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img src={product.image} alt={product.title} className="w-full h-auto object-cover" />
          </div>

          {/* Contenu */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-semibold">{product.title}</h1>
              <div className="text-4xl font-bold text-rose-400">{product.price} €</div>
            </div>

            <p className="text-zinc-400 mt-3">
              Portée {product.wornDays} jours • par{' '}
              <Link href={`/creators/${product.creatorSlug}`} className="text-rose-400 hover:underline">
                {product.creatorName}
              </Link>
            </p>

            {/* Badges */}
            <div className="flex gap-3 mt-8">
              <div className="px-6 py-3 bg-rose-500/10 text-rose-400 rounded-3xl text-sm flex items-center gap-2 border border-rose-400/20">
                <BookOpen className="w-4 h-4" />
                Histoire intime
              </div>
              {product.hasVoice && (
                <div className="px-6 py-3 bg-purple-500/10 text-purple-400 rounded-3xl text-sm flex items-center gap-2 border border-purple-400/20">
                  <Mic className="w-4 h-4" />
                  Enregistrement vocal
                </div>
              )}
            </div>

            {/* Histoire */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-400" />
                Son histoire
              </h2>
              <p className="text-zinc-300 leading-relaxed text-lg">
                {product.fullStory}
              </p>
            </div>

            {/* Player vocal */}
            {product.hasVoice && (
              <div className="mt-12 bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-3">
                  <Mic className="w-5 h-5 text-purple-400" />
                  Écouter sa voix
                </h3>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={togglePlay} 
                    className="w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                  </button>
                  <div className="flex-1 h-2 bg-zinc-700 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
                <audio ref={audioRef} src={product.audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>
            )}

            {/* Avis clients */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">Avis clients</h2>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Review
                    key={review.id}
                    id={review.id}
                    author={review.author}
                    rating={review.rating}
                    comment={review.comment}
                    date={review.date}
                  />
                ))}
              </div>

              {/* Formulaire avis */}
              <form onSubmit={submitReview} className="mt-12 bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
                <h3 className="text-lg font-medium mb-6">Laisser un avis</h3>
                
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-3xl transition-colors hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                    </button>
                  ))}
                </div>

                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Partage ton expérience..."
                  className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 resize-none"
                  required
                />

                <button
                  type="submit"
                  className="mt-6 w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-2xl font-semibold transition-colors"
                >
                  Publier mon avis
                </button>
              </form>
            </div>

            {/* Bouton acheter */}
            <button className="mt-16 w-full py-7 bg-white text-black font-semibold text-xl rounded-3xl hover:bg-rose-400 hover:text-white transition-all active:scale-95 shadow-xl">
              Ajouter au panier — {product.price} €
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
