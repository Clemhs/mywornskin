import { createClient } from '@/lib/supabase/server';
import StoryCard from '@/components/StoryCard';
import ShopFilters from './ShopFilters'; // On va créer ce composant client juste après

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      creator:profiles!creator_id (username, full_name, country, city)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Pièces portées avec passion • {products?.length || 0} pièces
        </p>

        {/* Filtres interactifs (Client Component) */}
        <ShopFilters initialProducts={products || []} />
      </div>
    </main>
  );
}
