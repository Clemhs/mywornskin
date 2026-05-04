'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, AlertTriangle, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const supabase = createClient();
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [debug, setDebug] = useState("");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  const loadRefusedReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')                    // On enlève la jointure pour l'instant
      .eq('status', 'rejected')
      .order('created_at', { ascending: false });

    console.log("Reviews refusés :", { data, error });

    if (error) {
      setDebug("Erreur: " + error.message);
    } else {
      setRefusedReviews(data || []);
      setDebug(`Trouvé ${data?.length || 0} commentaires refusés`);
    }
  };

  useEffect(() => {
    loadRefusedReviews();
  }, []);

  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadRefusedReviews();
  };

  const sendAdminMessage = async () => {
    if (!selectedReview || !adminReply.trim()) return;

    await supabase.from('admin_messages').insert({
      review_id: selectedReview.id,
      creator_id: selectedReview.creator_id,
      admin_message: adminReply,
    });

    setAdminReply("");
    setSelectedReview(null);
    loadRefusedReviews();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        <div className="bg-zinc-900 p-6 rounded-3xl mb-8">
          <p className="text-pink-400 font-medium mb-2">Debug :</p>
          <p>{debug}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <AlertTriangle className="text-orange-400" /> Commentaires refusés
        </h2>

        {refusedReviews.length === 0 ? (
          <p className="text-zinc-500 text-lg">Aucun commentaire refusé pour le moment.</p>
        ) : (
          <div className="space-y-6">
            {refusedReviews.map(review => (
              <div key={review.id} className="bg-zinc-900 rounded-3xl p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-lg">{review.reviewer_name}</p>
                    <p className="text-sm text-zinc-500">Refusé par la créatrice</p>
                  </div>
                  <button 
                    onClick={() => forcePublishReview(review.id)}
                    className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl text-sm font-medium"
                  >
                    Forcer la publication
                  </button>
                </div>

                <p className="italic text-lg mt-6">"{review.comment}"</p>

                <button 
                  onClick={() => setSelectedReview(review)}
                  className="mt-6 text-pink-400 hover:text-pink-300 flex items-center gap-2"
                >
                  <MessageCircle size={20} /> Répondre à la créatrice
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedReview && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-lg">
              <h3 className="text-xl mb-6">Message pour {selectedReview.reviewer_name}</h3>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                className="w-full h-40 bg-zinc-800 rounded-2xl p-4 mb-6"
                placeholder="Explique pourquoi tu as refusé ce commentaire..."
              />
              <div className="flex gap-4">
                <button onClick={() => setSelectedReview(null)} className="flex-1 py-4 border border-zinc-700 rounded-2xl">Annuler</button>
                <button onClick={sendAdminMessage} className="flex-1 bg-pink-600 hover:bg-pink-500 py-4 rounded-2xl flex items-center justify-center gap-2">
                  <Send size={18} /> Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
