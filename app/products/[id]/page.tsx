import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!['1', '2', '3'].includes(id)) {
    notFound();
  }

  const product = {
    id,
    title: id === "1" ? "Culotte en dentelle noire" : 
           id === "2" ? "Bas résille déchirés" : "Chemise blanche froissée",
    price: id === "1" ? 45 : id === "2" ? 32 : 68,
    image: `https://picsum.photos/id/${id === "1" ? 1015 : id === "2" ? 201 : 251}/800/1200`,
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" />
          Retour à l’accueil
        </Link>

        <div className="bg-zinc-900 rounded-3xl p-8">
          <img src={product.image} alt={product.title} className="w-full rounded-2xl" />
          <h1 className="text-4xl font-bold mt-8">{product.title}</h1>
          <p className="text-3xl text-rose-400 mt-4">{product.price} €</p>
          <p className="text-zinc-400 mt-12">
            Page produit {id} chargée correctement.<br />
            (Test minimal pour diagnostiquer l’infinite loading)
          </p>
        </div>
      </div>
    </main>
  );
}
