// app/product/[id]/page.tsx
'use client';

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image principale */}
        <div className="bg-zinc-900 aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden">
          <div className="text-zinc-500 text-2xl">Image du produit #{params.id}</div>
        </div>

        {/* Infos produit */}
        <div>
          <h1 className="text-4xl font-semibold">Produit détaillé #{params.id}</h1>
          <p className="text-rose-400 text-3xl mt-4">45 €</p>
          
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Histoire intime</h3>
              <p className="text-zinc-400 leading-relaxed">
                Description détaillée et sensuelle de la créatrice...
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <div>Porté <span className="font-semibold">3 jours</span></div>
              <div>📸 8 photos</div>
              <div>🎤 Vocal disponible</div>
            </div>
          </div>

          <button className="mt-12 w-full bg-white text-black py-5 rounded-3xl font-medium text-xl hover:bg-rose-400 hover:text-white transition-all">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
