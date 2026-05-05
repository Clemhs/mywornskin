const loadData = async () => {
  if (activeTab === 'photos') {
    console.log("🔍 Recherche de photos en attente...");

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        username, 
        full_name,
        avatar_pending_url,
        banner_pending_url,
        avatar_status,
        banner_status
      `)
      .or('avatar_status.eq.pending,banner_status.eq.pending')
      .order('updated_at', { ascending: false });

    if (error) console.error("Erreur query photos:", error);
    if (data) console.log("Photos trouvées :", data);

    setPendingPhotos(data || []);
  }

  // ... le reste de la fonction reste identique
};
