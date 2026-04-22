'use client';

import { useState } from 'react';

export default function Sell() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    size: '',
    condition: 'Très bon état',
    description: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert("L'image est trop lourde (maximum 10 Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Veuillez ajouter au moins une photo de votre pièce.");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      alert("✅ Ton annonce a été publiée avec succès !");
      setUploading(false);
      // Réinitialisation
      setFormData({ title: '', price: '', size: '', condition: 'Très bon état', description: '' });
      setImages([]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Mettre une pièce en vente</h1>
          <p className="text-zinc-400 text-xl">Partage un vêtement que tu as porté. Avec son histoire et son odeur.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800">
          {/* Upload photos */}
          <div className="mb-12">
            <label className="block text-lg font-semibold mb-4">Photos de ta pièce</label>
            
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-16 text-center cursor-pointer transition">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              <div className="text-7xl mb-4">📸</div>
              <p className="text-rose-400 text-2xl font-medium">Ajoute des photos</p>
              <p className="text-zinc-500 mt-3">Minimum 3 photos recommandées • Max 10 Mo par image</p>
            </label>

            {images.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group rounded-2xl overflow-hidden">
                    <img src={img} alt="preview" className="w-full aspect-square object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Titre */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3">Titre de l’annonce</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Culotte en dentelle noire portée 3 jours"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-2xl px-6 py-4 text-lg"
              required
            />
          </div>

          {/* Prix, Taille, État */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div>
              <label className="block text-sm font-medium mb-3">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="29.90"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-2xl px-6 py-4 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Taille</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-2xl px-6 py-4 text-lg"
              >
                <option value="">Choisir une taille</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">État</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-2xl px-6 py-4 text-lg"
              >
                <option value="Neuf avec étiquette">Neuf avec étiquette</option>
                <option value="Excellent état">Excellent état</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <label className="block text-sm font-medium mb-3">Description détaillée</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              placeholder="Combien de fois l’ai-je portée ? Dans quelles occasions ? Quelle est son odeur ? Comment je me sentais dedans ?"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-rose-500 rounded-3xl px-6 py-5 text-lg resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || images.length === 0}
            className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 py-6 rounded-2xl text-xl font-semibold transition-all"
          >
            {uploading ? "Publication en cours..." : "Publier mon annonce"}
          </button>
        </form>
      </div>
    </div>
  );
}
