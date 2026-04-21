'use client';

import { useState } from 'react';

export default function Sell() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    size: '',
    description: '',
    condition: 'Très bon état',
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      alert('✅ Annonce publiée avec succès ! (simulation)');
      setUploading(false);
      // Reset form
      setFormData({ title: '', price: '', size: '', description: '', condition: 'Très bon état' });
      setImages([]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Mettre en vente un vêtement</h1>
          <p className="text-zinc-400 text-lg">Partagez une pièce que vous avez portée</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800">
          {/* Photos */}
          <div className="mb-10">
            <label className="block text-sm font-medium mb-3">Photos du vêtement (minimum 3 recommandées)</label>
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center hover:border-rose-500/50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-4xl mb-3">📸</div>
                <p className="text-rose-400 font-medium">Cliquez pour ajouter des photos</p>
                <p className="text-xs text-zinc-500 mt-1">PNG, JPG jusqu'à 10 Mo</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-6">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="preview" className="rounded-xl aspect-square object-cover" />
                ))}
              </div>
            )}
          </div>

          {/* Titre */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Titre de l’annonce</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Culotte noire en dentelle portée 2 jours"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Prix et Taille */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Prix (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="29.90"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Taille</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-500"
              >
                <option value="">Choisir une taille</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <label className="block text-sm font-medium mb-2">Description détaillée</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              placeholder="Combien de fois porté ? Comment il sent ? État général ?"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 focus:outline-none focus:border-rose-500 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-rose-600 hover:bg-rose-500 py-5 rounded-2xl text-lg font-semibold transition disabled:opacity-70"
          >
            {uploading ? 'Publication en cours...' : 'Publier mon annonce'}
          </button>
        </form>
      </div>
    </div>
  );
}
