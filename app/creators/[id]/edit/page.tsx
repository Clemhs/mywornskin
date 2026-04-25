'use client';
// V16 - Version propre restaurée (sans bouton langue dans la page)
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CreatorEdit() {
  const params = useParams();
  const id = params.id as string;

  const [avatar, setAvatar] = useState("https://picsum.photos/id/1011/280/280");
  const [banner, setBanner] = useState("https://picsum.photos/id/1005/1200/400");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");
  const [avatarStatus, setAvatarStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [bannerStatus, setBannerStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [selectedBadge, setSelectedBadge] = useState<number | null>(10);
  const [selectedFrame, setSelectedFrame] = useState<string | null>("rose");
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCreator = async () => {
      if (!id) return;
      const { data } = await supabase.from('creators').select('*').eq('id', id).single();
      if (data) {
        setAvatar(data.avatar_url || avatar);
        setBanner(data.banner_url || banner);
        setPendingAvatar(data.pending_avatar_url || "");
        setPendingBanner(data.pending_banner_url || "");
        setRejectionMessage(data.rejection_message || null);
        if (data.pending_avatar_url) setAvatarStatus('pending');
        if (data.pending_banner_url) setBannerStatus('pending');
        if (data.badge !== null) setSelectedBadge(data.badge);
        if (data.frame) setSelectedFrame(data.frame);
      }
    };
    loadCreator();
  }, [id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarStatus('pending');
    const fileName = `pending-avatar-${id}-${Date.now()}`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    if (error) { console.error(error); setAvatarStatus('rejected'); return; }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    await supabase.from('creators').update({ pending_avatar_url: urlData.publicUrl, rejection_message: null }).eq('id', id);
    setPendingAvatar(urlData.publicUrl);
    setRejectionMessage(null);
    setToastMessage('✅ Photo de profil mise en attente');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerStatus('pending');
    const fileName = `pending-banner-${id}-${Date.now()}`;
    const { error } = await supabase.storage.from('banners').upload(fileName, file, { upsert: true });
    if (error) { console.error(error); setBannerStatus('rejected'); return; }
    const { data: urlData } = supabase.storage.from('banners').getPublicUrl(fileName);
    await supabase.from('creators').update({ pending_banner_url: urlData.publicUrl, rejection_message: null }).eq('id', id);
    setPendingBanner(urlData.publicUrl);
    setRejectionMessage(null);
    setToastMessage('✅ Image de couverture mise en attente');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('creators').update({ badge: selectedBadge, frame: selectedFrame }).eq('id', id);
    if (error) {
      console.error(error);
      setToastMessage('❌ Erreur lors de la sauvegarde');
    } else {
      setToastMessage('✅ Modifications enregistrées avec succès');
    }
    setTimeout(() => setToastMessage(null), 4000);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex items-center gap-2">← Retour au profil</Link>
          <h1 className="text-3xl font-semibold">Personnaliser mon profil</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-500 px-8 py-3 rounded-3xl text-white font-medium disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        {rejectionMessage && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-3xl mb-8">
            ⚠️ {rejectionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Aperçu en direct */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
              <img src={pendingBanner || banner} alt="Bannière" className="w-full h-full object-cover" />
              {selectedFrame && <div className={`shimmer-frame absolute inset-0 rounded-3xl pointer-events-none ${selectedFrame}`} />}
              <div className="absolute bottom-8 left-8 flex items-end gap-6">
                <div className="relative">
                  <img src={pendingAvatar || avatar} alt="Avatar" className="w-28 h-28 rounded-2xl border-4 border-zinc-950 object-cover" />
                  {selectedBadge && <img src={`/badges/${selectedBadge}.png`} alt="badge" className="absolute -top-2 -right-2 w-9 h-9 drop-shadow-2xl" />}
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="lg:col-span-7 space-y-12">
            {/* Uploads */}
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Image de couverture (1200×400 • Max 8 Mo)</p>
                  <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500">
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                    <span className="text-pink-400">Changer la couverture</span>
                  </label>
                  {bannerStatus === 'pending' && <p className="text-amber-400 text-sm mt-2">En attente de validation</p>}
                </div>
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Photo de profil (512×512 • Max 5 Mo)</p>
                  <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <span className="text-pink-400">Changer la photo</span>
                  </label>
                  {avatarStatus === 'pending' && <p className="text-amber-400 text-sm mt-2">En attente de validation</p>}
                </div>
              </div>
            </div>

            {/* Badges PNG */}
            <div>
              <h2 className="text-xl mb-4">Badges</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {[10,50,100,500].map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBadge(b)}
                    className={`flex-shrink-0 relative w-20 aspect-square rounded-2xl overflow-hidden border ${selectedBadge === b ? 'border-pink-500 ring-2 ring-pink-500' : 'border-zinc-700'}`}
                  >
                    <img src={`/badges/${b}.png`} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cadres avec aperçu */}
            <div>
              <h2 className="text-xl mb-4">Cadres</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {['rose','silver','gold'].map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFrame(f)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl whitespace-nowrap border ${selectedFrame === f ? 'border-pink-500 bg-pink-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
                  >
                    {f === 'rose' ? '1 an' : f === 'silver' ? '2 ans' : '5 ans'}
                  </button>
                ))}
              </div>
            </div>

            {/* Boutique */}
            <div className="pt-8 border-t border-zinc-800">
              <h2 className="text-xl mb-6">Boutique cosmétiques</h2>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {[
                  { name: "Badge 250", price: 15 },
                  { name: "Badge 1000", price: 39 },
                  { name: "Cadre Platine", price: 49 },
                  { name: "Cadre Émeraude", price: 29 },
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-900 rounded-3xl p-4 w-40 flex-shrink-0 text-center">
                    <div className="h-28 bg-zinc-800 rounded-2xl mb-3 flex items-center justify-center text-4xl">🏆</div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-pink-400 text-lg">{item.price}€</p>
                    <button className="mt-4 w-full bg-pink-600 hover:bg-pink-500 py-2 rounded-2xl text-sm font-medium">
                      Acheter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-8 py-4 rounded-3xl shadow-2xl z-50">
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 300% 0; } }
        .shimmer-frame { animation: shimmer 10s linear infinite; background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%); background-size: 200% 100%; box-shadow: 0 0 20px -3px currentColor, inset 0 0 20px -3px currentColor; }
        .shimmer-frame.rose { color: #f472b6; }
        .shimmer-frame.silver { color: #e2e8f0; }
        .shimmer-frame.gold { color: #fbbf24; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

const allBadges = [
  { id: 10, unlocked: true, price: 0 },
  { id: 50, unlocked: false, price: 9 },
  { id: 100, unlocked: true, price: 0 },
  { id: 500, unlocked: false, price: 29 },
];

const allFrames = [
  { id: "rose", name: "1 an", color: "rose", unlocked: true, price: 0 },
  { id: "silver", name: "2 ans", color: "silver", unlocked: true, price: 0 },
  { id: "gold", name: "5 ans", color: "gold", unlocked: false, price: 19 },
];
