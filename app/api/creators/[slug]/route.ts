import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();
  const slug = params.slug.toLowerCase();

  try {
    // Récupération de la créatrice
    const { data: creator, error: creatorError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', slug)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Créatrice non trouvée' }, { status: 404 });
    }

    // Récupération des produits approuvés
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('creator_id', creator.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Récupération des avis approuvés
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('creator_id', creator.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    if (productsError) console.error('Erreur produits:', productsError);
    if (reviewsError) console.error('Erreur reviews:', reviewsError);

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
