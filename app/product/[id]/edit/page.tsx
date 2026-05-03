// app/product/[id]/edit/page.tsx
export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Modifier le produit #{params.id}</h1>
      <div className="bg-zinc-900 rounded-3xl p-10">
        <p className="text-zinc-400">Formulaire d'édition pour la créatrice...</p>
      </div>
    </div>
  );
}
