'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Sell() {
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    size: '',
    condition: 'Très bon état',
    description: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setImages(prev => [...prev, ev.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setVideo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-semibold mb-8">Mettre une pièce en vente</h1>

        {/* Upload zone */}
        <div className="card p-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-3xl overflow-hidden group">
                <Image src={img} alt="" fill className="object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-rose-600 text-white w-8 h-8 rounded-2xl flex items-center justify-center text-xl transition"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* Add image button */}
            <label className="aspect-square border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              <span className="text-5xl mb-2 text-rose-400">+</span>
              <span className="text-zinc-400 text-sm">Ajouter photos</span>
            </label>
          </div>

          {/* Video upload */}
          <div className="mt-8">
            <label className="block text-sm text-zinc-400 mb-3">Vidéo (optionnelle)</label>
            <label className="flex items-center justify-center h-40 border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl cursor-pointer transition">
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              <div className="text-center">
                <span className="text-4xl mb-2 block">🎥</span>
                <span className="text-rose-400">Ajouter une vidéo</span>
              </div>
            </label>
            {video && (
              <div className="mt-4 rounded-3xl overflow-hidden border border-zinc-700">
                <video src={video} controls className="w-full aspect-video" />
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Titre de l’annonce</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input w-full"
              placeholder="Ex: Culotte en dentelle noire portée 3 jours"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Prix (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input w-full"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Taille</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="input w-full"
                placeholder="S / M"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">État</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="input w-full"
            >
              <option>Très bon état</option>
              <option>Bon état</option>
              <option>Porté plusieurs fois</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Description intime</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="input w-full resize-y"
              placeholder="Je l’ai portée pendant 4 jours… elle porte encore mon odeur et la chaleur de ma peau."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 mt-12">
          <Link href="/" className="btn-secondary px-14 py-7 text-xl font-medium flex-1 text-center">
            Annuler
          </Link>
          <button className="btn-primary px-14 py-7 text-xl font-medium flex-1">
            Publier mon annonce
          </button>
        </div>
      </div>
    </div>
  );
}
