  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER - TITRE FORCÉMENT CENTRÉ */}
        <div className="relative flex items-center justify-center mb-12">
          <Link href="/creators/me" className="absolute left-0 text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>

          <h1 className="text-4xl font-bold text-center mx-auto">Édition de profil</h1>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="absolute right-0 bg-pink-600 hover:bg-pink-500 px-10 py-4 rounded-3xl font-semibold flex items-center gap-3 disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer tout"}
          </button>
        </div>

        {/* TOAST - UNE SEULE CROIX À DROITE */}
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-7 py-3 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[460px] ${toastClass}`}>
            <span>{toast.message}</span>
            
            {toast.link && (
              <Link href={toast.link} className="underline hover:text-white text-sm whitespace-nowrap">
                Voir les guidelines →
              </Link>
            )}

            <button 
              onClick={closeToast}
              className="ml-auto p-1 hover:bg-white/20 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Le reste de ta page (aperçu avec les deux textes "En attente") */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-xl mb-4">Aperçu en direct</h2>
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
                <img src={bannerUrl || bannerPendingUrl || "https://picsum.photos/id/1015/1200/400"} alt="Bannière" className="w-full h-full object-cover" />
                
                {/* Texte sur la bannière */}
                {(bannerStatus === 'pending') && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-black text-sm px-4 py-1 rounded-full flex items-center gap-2 font-medium">
                    <Clock size={16} /> En attente de validation
                  </div>
                )}

                <div className="absolute bottom-8 left-8">
                  <div className="relative">
                    <img 
                      src={avatarUrl || avatarPendingUrl || "https://picsum.photos/id/64/300/300"} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-2xl border-4 border-zinc-950 object-cover" 
                    />
                    {frame && <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />}
                    {salesBadge && <img src={`/badges/${salesBadge}.png`} className="absolute -top-3 -right-3 w-14 h-14" />}

                    {/* Texte sur la photo de profil */}
                    {(avatarStatus === 'pending') && (
                      <div className="absolute -top-3 -right-3 bg-amber-500 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                        <Clock size={14} /> En attente
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaires à valider ... (le reste inchangé) */}
          </div>

          {/* Le reste de la page (changer les images, badges, cadres, boutique) reste identique */}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer-frame { 0% { background-position: -200% 0; } 100% { background-position: 300% 0; } }
        .shimmer-frame { animation: shimmer-frame 8s linear infinite; background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%); background-size: 200% 100%; }
        .shimmer-frame.rose { border-color: #f472b6; box-shadow: inset 0 0 40px #f472b6; }
        .shimmer-frame.silver { border-color: #e2e8f0; box-shadow: inset 0 0 40px #e2e8f0; }
        .shimmer-frame.gold { border-color: #fbbf24; box-shadow: inset 0 0 45px #fbbf24; }
      `}</style>
    </div>
  );
}
