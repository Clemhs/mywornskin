  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchCreators = async (attempt = 0) => {
      if (!isMounted) return;

      setLoading(true);
      console.log(`🔄 Chargement créatrices (tentative ${attempt + 1})...`);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, banner_url, sales_badge, frame, bio, country, city, size, shoe_size')
        .or('is_creator.eq.true,role.eq.creator')
        .order('created_at', { ascending: false });

      if (isMounted) {
        if (error && attempt < 3) {
          console.warn(`Tentative ${attempt + 1} échouée, retry dans 1s...`);
          timeoutId = setTimeout(() => fetchCreators(attempt + 1), 1000);
        } else if (error) {
          console.error("Erreur définitive :", error);
          setCreators([]);
        } else {
          console.log(`✅ ${data?.length || 0} créatrices chargées`);
          setCreators(data || []);
        }
        setLoading(false);
      }
    };

    fetchCreators();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [supabase]);
