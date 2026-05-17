import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Clock } from 'lucide-react';

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
          <div className="space-y-10">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm text-zinc-500">Commande #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-3xl font-light mt-1">
                      {(order.amount / 100).toFixed(2)} €
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-5 py-2 bg-green-500/10 text-green-400 text-sm rounded-2xl">
                      Payée
                    </span>
                    <p className="text-sm text-zinc-400 mt-3 flex items-center gap-2">
                      <Clock size={16} />
                      {new Date(order.created_at).toLocaleString('fr-FR', { 
                        timeZone: 'Europe/Paris',
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {(order.items || []).map((item: any, index: number) => {
                    const productId = order.product_id || item.product_id;
                    const productLink = productId ? `/product/${productId}` : '#';

                    return (
                      <Link 
                        key={index} 
                        href={productLink}
                        className="flex gap-6 bg-zinc-950 rounded-2xl p-6 hover:bg-zinc-900 transition-colors group"
                      >
                        {/* Photo */}
                        <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden border border-zinc-700">
                          <img 
                            src={item.images?.[0] || '/default-avatar.png'} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium group-hover:text-rose-400 transition-colors">
                            {item.title || "Produit"}
                          </h3>
                          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                            {item.description || "Pas de description disponible"}
                          </p>
                          <p className="text-sm text-rose-400 mt-3">
                            Voir les détails du produit →
                          </p>
                        </div>

                        {/* Prix */}
                        <div className="text-right text-sm whitespace-nowrap">
                          <p className="font-medium">€{(item.price || 0).toFixed(2)}</p>
                          <p className="text-zinc-500 mt-1">Qté : {item.quantity || 1}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {order.stripe_session_id && (
                  <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-500">
                    Payé via Stripe • {order.stripe_session_id}
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
