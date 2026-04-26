'use client';

import Link from 'next/link';
import { Play, Mic, BookOpen, Pause } from 'lucide-react';
import { useState, useRef } from 'react';

interface StoryCardProps {
  id: string;
  title: string;
  price: number;
  wornDays: number;
  image: string;
  hasStory: boolean;
  hasVoice: boolean;
  excerpt: string;
  creatorName: string;
  creatorSlug: string;
  audioUrl?: string; // optionnel pour l'instant
}

export default function StoryCard({
  id,
  title,
  price,
  wornDays,
  image,
  hasStory,
  hasVoice,
  excerpt,
  creatorName,
  creatorSlug,
  audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // audio de test (à remplacer plus tard)
}: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Link href={`/products/${id}`} className="block group">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-rose-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10">
        
        {/* Image */}
        <div className="relative h-64 bg-zinc-800 flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Prix */}
          <div className="absolute top-4 right-4 bg-black/80 text-white text-sm font-semibold px-4 py-1.5 rounded-2xl backdrop-blur-md">
            {price} €
          </div>

          {/* Player audio overlay (si vocal) */}
          {hasVoice && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 text-white text-sm">
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-8 h-8 hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-xs">Écouter l’histoire</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {hasStory && (
              <div className="flex items-center gap-1 text-xs px-4 py-1 bg-rose-500/10 text-rose-400 rounded-3xl border border-rose-400/30">
                <BookOpen className="w-3 h-3" />
                Histoire
              </div>
            )}
            {hasVoice && (
              <div className="flex items-center gap-1 text-xs px-4 py-1 bg-purple-500/10 text-purple-400 rounded-3xl border border-purple-400/30">
                <Mic className="w-3 h-3" />
                Vocal
              </div>
            )}
          </div>

          {/* Titre */}
          <h3 className="font-semibold text-xl leading-tight mb-2 group-hover:text-rose-300 transition-colors">
            {title}
          </h3>

          {/* Info portée */}
          <p className="text-zinc-400 text-sm mb-4">
            Portée {wornDays} jours
          </p>

          {/* Extrait */}
          <p className="text-zinc-400 text-sm line-clamp-3 mb-6">
            {excerpt}
          </p>

          {/* Créatrice */}
          <div className="flex justify-between items-center">
            <Link 
              href={`/creators/${creatorSlug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors"
            >
              par {creatorName}
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
