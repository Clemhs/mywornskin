'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CreatorProfile() {
  const params = useParams();
  const slug = params.slug as string;

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('profiles')
      .select('*')
      .eq('username', slug)
      .single()
      .then(({ data }) => {
        setCreator(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="pt-32 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <h1 className="text-4xl text-center">
        {creator ? `✅ ${creator.full_name} (@${creator.username})` : "❌ Créatrice non trouvée"}
      </h1>
    </div>
  );
}
