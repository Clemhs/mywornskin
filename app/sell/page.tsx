'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sell() {
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    size: '',
    condition: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => setImages(prev => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => setVideos(prev => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      alert("Ajoute au moins une photo de ton vêtement.");
      return;
    }
    alert("✅ Annonce publiée ! Elle sera visible après modération (maximum 24h).");
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Vends ton vêtement porté</h1>

        <div className="card p-10 space-y-10">
          <div>
            <h3 className="font-semibold mb-4">Photos (minimum 3 recommandées)</h3>
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="text-5xl mb-4">📸</div>
              <p className="text-rose-400">Clique pour ajouter des photos</p>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="preview" className="rounded-2xl aspect-square object-cover" />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Vidéo (fortement recommandée)</h3>
            <label className="block border-2 border-dashed border-zinc-700 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              <div className="text-5xl mb-4">🎥</div>
              <p className="text-rose-400">Ajoute une courte vidéo du vêtement porté</p>
            </label>

            {videos.length > 0 && (
              <div className="mt-6">
                {videos.map((vid, i) => (
                  <video key={i} src={vid} controls className="w-full rounded-3xl" />
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" placeholder="Titre de l'annonce" className="input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input type="number" placeholder="Prix (€)" className="input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            <select className="input" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})}>
              <option value="">Taille</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
            <select className="input" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>
              <option value="">État du vêtement</option>
              <option value="Neuf">Neuf (jamais porté)</option>
              <option value="Excellent">Excellent</option>
              <option value="Très bon">Très bon</option>
              <option value="Bon">Bon</option>
            </select>
          </div>

          <textarea 
            placeholder="Description détaillée (odeur, sensation, moments portés...)" 
            className="input min-h-[160px]"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <button onClick={handleSubmit} className="btn-primary w-full py-7 text-xl font-semibold">
            Publier mon annonce
          </button>
        </div>
      </div>
    </div>
  );
}
