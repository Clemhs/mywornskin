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

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert("L'image est trop lourde (max 10 Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Ajoutez au moins une photo !");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      alert("✅ Annonce publiée avec succès !");
      setUploading(false);
      setFormData({ title: '', price: '', size: '', condition: 'Très bon état', description: '' });
      setImages([]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Mettre une pièce en vente</h1>
          <p className="text-zinc-400">Partagez un vêtement que vous avez porté</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800">
          {/* Photos */}
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-4">Photos du vêtement</label>
            <label className="block border-2 border-dashed border-zinc-700 rounded-3xl p-12 text-center hover:border-rose-500 transition cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="text-5xl mb-4">📸</div>
              <p className="text-rose-400 text-xl font-medium">Ajoutez des photos</p>
              <p className="text-zinc-500 mt-1">Minimum 3 photos recommandées</p>
            </label>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="preview" className="rounded-2xl w-full aspect-square object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
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
            <label className="block text-sm font-medium mb-2">Titre de l’annonce</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: String rouge en dentelle portée 2 jours"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Prix, Taille, Condition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div>
              <label className="block text-sm font-medium mb-2">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="24.90"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Taille</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500"
              >
                <option value="">Choisir</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">État</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500"
              >
                <option value="Très bon état">Très bon état</option>
                <option value="Excellent état">Excellent état</option>
                <option value="Bon état">Bon état</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              placeholder="Décrivez le vêtement, combien de fois porté, odeur, sensation..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-5 focus:outline-none focus:border-rose-500 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-rose-600 hover:bg-rose-500 py-6 rounded-2xl text-xl font-semibold transition-all"
          >
            {uploading ? "Publication en cours..." : "Publier l'annonce"}
          </button>
        </form>
      </div>
    </div>
  );
}export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-28 text-center">
        <h1 className="text-6xl md:text-[4.8rem] font-bold tracking-tighter leading-none mb-8">
          Des vêtements<br />
          déjà portés.<br />
          <span className="text-rose-500">Avec une histoire.</span>
        </h1>

        <p className="text-2xl text-zinc-400 max-w-3xl mx-auto mb-12">
          La plateforme intime où les créateurs vendent leurs vêtements portés avec émotion, 
          et où les amateurs peuvent découvrir, acheter et discuter en privé.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <a 
            href="/creators"
            className="bg-rose-600 hover:bg-rose-500 px-14 py-5 rounded-2xl text-xl font-medium transition-all active:scale-95 shadow-lg shadow-rose-500/20"
          >
            Explorer les créateurs
          </a>
          
          <a 
            href="/sell"
            className="border-2 border-zinc-700 hover:border-zinc-400 px-14 py-5 rounded-2xl text-xl font-medium transition-all"
          >
            Commencer à vendre
          </a>
        </div>
      </div>

      {/* Teaser */}
      <div className="py-20 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        Plateforme en cours de reconstruction • Tout est sauvegardé sur GitHub
      </div>
    </div>
  );
}
