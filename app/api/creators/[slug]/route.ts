import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const { slug } = await params;   // ← Important : await ici
  const cleanSlug = slug.toLowerCase();

  try {
    // Récupération de la créatrice
    const { data: creator, error: creatorError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', cleanSlug)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Créatrice non trouvée' }, { status: 404 });
    }

    // Produits approuvés
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('creator_id', creator.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Avis approuvés
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('creator_id', creator.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      creator,
      products: products || [],
      reviews: reviews || []
    });

  } catch (error) {
    console.error('Erreur API creator:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
