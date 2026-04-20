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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Créer des previews
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || images.length === 0 || !user) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setUploading(true);

    const imageUrls: string[] = [];

    try {
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

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

      if (error) throw error;

      alert("✅ Vêtement mis en vente avec succès !");
      router.push('/');

    } catch (error: any) {
      alert("Erreur : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="text-center py-20 text-white">Redirection en cours...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-10">Mettre un vêtement en vente</h1>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-3xl space-y-8">
          <div>
            <label className="block text-sm mb-2">Titre / Nom du vêtement *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Description (histoire, odeur, contexte...)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 h-32" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Prix (€) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm mb-2">Taille</label>
              <input type="text" value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" placeholder="S, M, L, Unique..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">État</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                <option value="neuf">Neuf</option>
                <option value="très bon">Très bon état</option>
                <option value="bon">Bon état</option>
                <option value="usagé">Usagé / Porté intensément</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Catégorie</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                <option value="lingerie">Lingerie / Intime</option>
                <option value="casual">Casual / Quotidien</option>
                <option value="vintage">Vintage</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-3">Photos du vêtement porté (plusieurs possibles) *</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3" />
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt="preview" className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={uploading || !title || !price || images.length === 0}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg hover:bg-gray-200 disabled:opacity-50 transition"
          >
            {uploading ? "Publication en cours..." : "Publier mon vêtement"}
          </button>
        </form>
      </div>
    </div>
  );
}
