'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star, MapPin, Flag } from 'lucide-react';
import StoryCard from '@/components/StoryCard';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;
  const slug = rawSlug.toLowerCase();

  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // Redirection
  useEffect(() => {
    if (rawSlug !== slug) router.replace(`/creators/${slug}`);
    if (rawSlug === 'me') router.replace('/creators/creator_test');
  }, [rawSlug, slug, router]);

  const fetchCreatorData = async () => {
    if (!slug) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/creators/${slug}`, { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error('Créatrice non trouvée');
      }

      const data = await res.json();
      
      setCreator(data.creator);
      setProducts(data.products || []);
      setApprovedReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, [slug]);

  const sendReport = async () => {
    if (!reportReason || !creator) {
      alert("Veuillez choisir une raison");
      return;
    }

    setSendingReport(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_id: creator.id,
          reason: reportReason,
          status: 'pending'
        })
      });

      if (res.ok) {
        alert("✅ Signalement envoyé à l'équipe. Merci !");
        setShowReportModal(false);
        setReportReason('');
      } else {
        alert("Erreur lors de l'envoi du signalement");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    } finally {
      setSendingReport(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement de la créatrice...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Bannière */}
      <div className="h-80 relative">
        <img 
          src={creator.banner_url || "https://picsum.photos/id/1015/1200/400"} 
          alt="Bannière" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative -mt-12 md:-mt-20 flex-shrink-0">
            <div className="relative inline-block">
              <img 
                src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
                alt={creator.username} 
                className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover" 
              />
              {creator.frame && (
                <div className={`absolute inset-0 rounded-3xl border-4 shimmer-frame ${creator.frame}`} />
              )}
              {creator.sales_badge && (
                <img 
                  src={`/badges/${creator.sales_badge}.png`} 
                  alt={`Badge ${creator.sales_badge}`}
                  className="absolute -top-4 -right-4 w-16 h-16 drop-shadow-2xl" 
                />
              )}
            </div>
          </div>

          <div className="pt-6 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold">{creator.full_name}</h1>
                <p className="text-rose-400 text-xl">@{creator.username}</p>
              </div>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition text-sm mt-2"
              >
                <Flag size={18} /> Signaler
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-400">
              {(creator.country || creator.city) && (
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {creator.country} {creator.city && `• ${creator.city}`}
                </span>
              )}
              {creator.size && <span>• Taille {creator.size}</span>}
              {creator.shoe_size && <span>• Pointure {creator.shoe_size}</span>}
            </div>

            <p className="text-zinc-400 mt-5 leading-relaxed">
              {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
            </p>
          </div>
        </div>

        {/* Boutique */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Sa boutique ({products.length} pièces)</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <StoryCard key={p.id} {...p} creator={creator.username} creatorSlug={slug} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">Aucune pièce mise en ligne pour le moment.</p>
          )}
        </div>

        {/* Avis */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Avis clients ({approvedReviews.length})</h2>
          {approvedReviews.length > 0 ? (
            <div className="space-y-6">
              {approvedReviews.map(review => (
                <div key={review.id} className="bg-zinc-900 rounded-2xl p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="italic text-zinc-300">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 italic">Aucun avis approuvé pour le moment.</p>
          )}
        </div>
      </div>

      {/* Modal Signalement */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-2">Signaler ce profil</h3>
            <p className="text-zinc-400 mb-6">Choisissez la raison du signalement :</p>

            <div className="space-y-2 mb-6">
              {[
                "Contenu inapproprié ou explicite",
                "Usurpation d'identité",
                "Spam ou publicité abusive",
                "Harcèlement ou comportement toxique",
                "Autre"
              ].map(reason => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border transition-all ${
                    reportReason === reason 
                      ? 'border-red-500 bg-red-500/10 text-white' 
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {reportReason === "Autre" && (
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Décrivez le problème..."
                className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-6"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3.5 rounded-2xl border border-zinc-700 hover:bg-zinc-800"
              >
                Annuler
              </button>
              <button
                onClick={sendReport}
                disabled={!reportReason || sendingReport}
                className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 font-medium"
              >
                {sendingReport ? "Envoi en cours..." : "Envoyer le signalement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles shimmer */}
      <style jsx global>{`
        @keyframes shimmer-frame {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .shimmer-frame {
          animation: shimmer-frame 8s linear infinite;
          background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.9) 50%, transparent 75%);
          background-size: 200% 100%;
          border: 4px solid;
        }
        .shimmer-frame.rose { border-color: #f472b6; box-shadow: inset 0 0 35px #f472b6; }
        .shimmer-frame.silver { border-color: #e2e8f0; box-shadow: inset 0 0 35px #e2e8f0; }
        .shimmer-frame.gold { border-color: #fbbf24; box-shadow: inset 0 0 35px #fbbf24; }
      `}</style>
    </div>
  );
}
