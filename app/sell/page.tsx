'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SellPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('bon');
  const [category, setCategory] = useState('lingerie');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || images.length === 0) return;

    setUploading(true);

    // Upload des images
    const imageUrls: string[] = [];
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('items')
        .upload(fileName, file);

      if (error) {
        console.error(error);
        alert("Erreur lors de l'upload d'une image");
        setUploading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from('items')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl.publicUrl);
    }

    // Enregistrer l'item dans la base
    const { error } = await supabase
      .from('items')
      .insert({
        title,
        description,
        price: parseFloat(price),
        size,
        condition,
        category,
        images: imageUrls,
        is_available: true,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      alert("Erreur lors de l'ajout du vêtement");
    } else {
      alert("Vêtement mis en vente avec succès !");
      // Réinitialiser le formulaire
      setTitle('');
      setDescription('');
      setPrice('');
      setSize('');
      setImages([]);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-10">Mettre un vêtement en vente</h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 p-8 rounded-3xl">
          <div>
            <label className="block text-sm mb-2">Titre du vêtement</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
              placeholder="Ex: Culotte en dentelle noire portée 2 jours"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Description / Histoire</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 h-32"
              placeholder="Portée pendant une soirée... odeur naturelle... etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Prix (€)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Taille</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                placeholder="S, M, L..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">État</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
              >
                <option value="neuf">Neuf</option>
                <option value="très bon">Très bon</option>
                <option value="bon">Bon</option>
                <option value="usagé">Usagé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
              >
                <option value="lingerie">Lingerie</option>
                <option value="casual">Casual</option>
                <option value="vintage">Vintage</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Photos du vêtement (portées)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
            />
            <p className="text-xs text-gray-500 mt-1">Tu peux mettre plusieurs photos</p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-gray-200 transition disabled:opacity-50"
          >
            {uploading ? "Upload en cours..." : "Mettre en vente mon vêtement"}
          </button>
        </form>
      </div>
    </div>
  );
}
