'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CreatorProfile() {
  const params = useParams();
  const slug = params.slug as string;

  const [creator, setCreator] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    
    supabase
      .from('profiles')
      .select('*')
      .eq('username', slug)
      .single()
      .then(({ data }) => {
        setCreator(data);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-8">
          {creator ? `✅ ${creator.full_name} (@${creator.username})` : 'Chargement...'}
        </h1>
        {creator && (
          <pre className="bg-zinc-900 p-8 rounded-3xl text-sm overflow-auto">
            {JSON.stringify(creator, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
