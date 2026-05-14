import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Clock } from 'lucide-react';

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Pour le moment : on récupère les commandes (à adapter quand tu auras la table orders)
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/profile" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Retour
          </Link>
          <h1 className="text-4xl font-light">Mes Commandes</h1>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 p-6 rounded-3xl mb-8">
            Impossible de charger vos commandes
          </div>
        )}

        {!orders || orders.length === 0 ? (
          <div className="text-center py-32">
            <Package className="w-24 h-24 mx-auto text-zinc-700 mb-6" />
            <h2 className="text-3xl font-light mb-4">Aucune commande pour le moment</h2>
            <p className="text-zinc-400 mb-10">Vos futures commandes apparaîtront ici</p>
            <Link 
              href="/shop"
              className="inline-block px-10 py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl font-medium"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-zinc-400">Commande #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-2xl font-light mt-1">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-4 py-1.5 bg-green-500/10 text-green-400 text-sm rounded-full">
                      {order.status || 'Payée'}
                    </span>
                    <p className="text-2xl font-medium mt-2">{order.total_amount} €</p>
                  </div>
                </div>

                <div className="text-sm text-zinc-400">
                  {order.items?.length || 0} article(s)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
