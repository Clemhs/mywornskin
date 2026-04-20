'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SellPage() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('bon');
  const [category, setCategory] = useState('lingerie');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || images.length === 0 || !user) return;

    setUploading(true);

    const imageUrls: string[] = [];

    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('items')
        .upload(fileName, file);

      if (uploadError) {
        alert("Erreur upload image");
        setUploading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from('items')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl.publicUrl);
    }

    const { error } = await supabase.from('items').insert({
      title,
      description,
      price: parseFloat(price),
      size,
      condition,
      category,
      images: imageUrls,
      user_id: user.id,
      is_available: true
    });

    if (error) {
      alert("Erreur lors de l'ajout");
    } else {
      alert("Vêtement mis en vente avec succès !");
      router.push('/');
    }

    setUploading(false);
  };

  if (!user) return <div className="text-center py-20">Redirection...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-10">Mettre un vêtement en vente</h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 p-8 rounded-3xl">
          {/* Les champs du formulaire restent les mêmes que précédemment */}
          <div>
            <label className="block text-sm mb-2">Titre du vêtement</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 h-32" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Prix (€)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm mb-2">Taille</label>
              <input type="text" value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Photos (vêtement porté)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" />
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-gray-200">
            {uploading ? "Envoi en cours..." : "Publier mon vêtement"}
          </button>
        </form>
      </div>
    </div>
  );
}
