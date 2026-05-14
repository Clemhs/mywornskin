import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        creator:profiles!creator_id (username, full_name, city, country)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error("API Products error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (err: any) {
    console.error("API Products catch:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
