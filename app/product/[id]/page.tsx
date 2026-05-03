// app/product/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-4xl font-bold mb-8">Produit #{params.id}</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image principale */}
        <div className="bg-zinc-900 aspect-square rounded-3xl flex items-center justify-center">
          <p className="text-zinc-500">Image du produit (à venir)</p>
        </div>

        {/* Infos produit */}
        <div>
          <h1 className="text-3xl font-semibold">Culotte en dentelle portée X jours</h1>
          <p className="text-rose-400 text-2xl mt-4">45 €</p>
          
          <div className="mt-8">
            <h3 className="font-medium mb-3">Histoire</h3>
            <p className="text-zinc-400 leading-relaxed">
              Description intime de la créatrice...
            </p>
          </div>

          <button className="mt-10 w-full bg-white text-black py-4 rounded-2xl font-medium text-lg hover:bg-zinc-200 transition-colors">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
