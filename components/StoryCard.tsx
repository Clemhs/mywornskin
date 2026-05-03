// components/StoryCard.tsx
import Link from 'next/link';
import { Heart, Mic } from 'lucide-react';

interface StoryCardProps {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  wornDays: number;
  hasStory?: boolean;
  hasVoice?: boolean;
}

export default function StoryCard({ id, title, creator, price, image, wornDays, hasStory, hasVoice }: StoryCardProps) {
  return (
    <Link href={`/product/${id}`} className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-400 transition-all">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/70 text-xs px-2.5 py-1 rounded-full">
          {wornDays}j
        </div>
      </div>

      <div className="p-5">
        <p className="text-rose-400 text-sm">{creator}</p>
        <h3 className="font-medium mt-1 line-clamp-2 group-hover:text-rose-400 transition-colors">{title}</h3>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-semibold">{price}€</p>
          <div className="flex gap-2">
            {hasStory && <div className="text-xs bg-zinc-800 px-2 py-1 rounded">📖</div>}
            {hasVoice && <div className="text-xs bg-zinc-800 px-2 py-1 rounded"><Mic className="w-3 h-3" /></div>}
          </div>
        </div>
      </div>
    </Link>
  );
}
