'use client';

import Link from 'next/link';
import { Play, Mic, BookOpen } from 'lucide-react';

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
}: StoryCardProps) {
  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-rose-400/30 transition-all duration-300">
      {/* Image */}
      <div className="relative h-64 bg-zinc-800 flex items-center justify-center text-6xl overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-2xl">
          {price} €
        </div>
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
        <h3 className="font-semibold text-xl leading-tight mb-2">{title}</h3>

        {/* Info portée */}
        <p className="text-zinc-400 text-sm mb-4">
          Portée {wornDays} jours
        </p>

        {/* Extrait */}
        <p className="text-zinc-400 text-sm line-clamp-3 mb-6">
          {excerpt}
        </p>

        {/* Créatrice */}
        <div className="flex items-center justify-between">
          <Link 
            href={`/creators/${creatorSlug}`}
            className="text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors"
          >
            par {creatorName}
          </Link>

          <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
            {hasVoice ? (
              <>
                <Play className="w-3 h-3" />
                Écouter
              </>
            ) : (
              <>
                <BookOpen className="w-3 h-3" />
                Lire
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
