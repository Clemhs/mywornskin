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
  const [orderPlaced, setOrderPlaced] = useState(false);

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
      alert("Veuillez ajouter au moins une photo.");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      setUploading(false);
      setOrderPlaced(true);
      alert("✅ Annonce publiée avec succès !");
    }, 1400);
  };

  const downloadLabel = () => {
    alert("📄 Étiquette neutre générée ! (Simulation)\n\nAdresse de l'acheteur :\nJean Dupont\n123 Rue des Lilas\n75000 Paris\n\nMention : Contenu personnel");
    // Plus tard on générera un vrai PDF
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="hero-text text-5xl tracking-tighter mb-4">Mettre une pièce en vente</h1>
          <p className="text-xl text-zinc-400">Partage un vêtement que tu as porté. Avec son histoire et son odeur.</p>
        </div>

        {!orderPlaced ? (
          <form onSubmit={handleSubmit} className="card p-10">
            {/* ... (le reste du formulaire reste identique à la version précédente) */}
            {/* Upload photos, titre, prix, taille, état, description ... */}

            <button
              type="submit"
              disabled={uploading || images.length === 0}
              className="btn-primary w-full py-6 text-lg"
            >
              {uploading ? "Publication en cours..." : "Publier mon annonce"}
            </button>
          </form>
        ) : (
          <div className="card p-12 text-center">
            <h2 className="text-3xl font-semibold mb-6">Annonce publiée !</h2>
            <p className="text-zinc-400 mb-10">Votre pièce est maintenant visible sur le site.</p>

            <button
              onClick={downloadLabel}
              className="btn-primary w-full py-6 text-lg mb-4"
            >
              📄 Télécharger l'étiquette neutre d'envoi
            </button>

            <p className="text-sm text-zinc-500">
              Imprimez cette étiquette et collez-la sur votre colis.<br />
              N'oubliez pas d'utiliser un emballage discret.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
