'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface ReviewProps {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Review({ author, rating, comment, date }: ReviewProps) {
  return (
    <div className="border border-zinc-700 rounded-3xl p-6 bg-zinc-900">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{author}</p>
          <div className="flex text-amber-400 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-current' : ''}`}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-zinc-400">{date}</span>
      </div>
      <p className="text-zinc-300 mt-4 leading-relaxed">{comment}</p>
    </div>
  );
}
