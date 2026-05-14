import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar } from 'lucide-react';

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: orders } = await supabase
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

        {!orders || orders.length === 0 ? (
          <div className="text-center py-32">
            <Package className="w-24 h-24 mx-auto text-zinc-700 mb-6" />
            <h2 className="text-3xl font-light mb-4">Aucune commande pour le moment</h2>
            <p className="text-zinc-400">Vos commandes apparaîtront ici après paiement</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-zinc-500">Commande #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-3xl font-light mt-2">
                      {(order.amount / 100).toFixed(2)} €
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-4 py-2 bg-green-500/10 text-green-400 text-sm rounded-full">
                      Payée
                    </span>
                    <p className="text-sm text-zinc-400 mt-3 flex items-center gap-2 justify-end">
                      <Calendar size={16} />
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {order.items && Array.isArray(order.items) && (
                  <div className="mt-6 text-sm text-zinc-400">
                    {order.items.length} article(s) • {order.stripe_session_id ? 'Payé via Stripe' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
