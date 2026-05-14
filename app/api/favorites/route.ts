import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json([]);
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        product:products!product_id (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("API Favorites error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (err: any) {
    console.error("API Favorites catch:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
