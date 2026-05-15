import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      creator:profiles!creator_id (*)
    `)
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (!product) notFound();

  return <ProductClient product={product} />;
}
