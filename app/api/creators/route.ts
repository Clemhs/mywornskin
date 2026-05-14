import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();   // ← Important : await ici

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, banner_url, sales_badge, frame, bio, country, city, size, shoe_size')
      .or('is_creator.eq.true,role.eq.creator')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("API Creators error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (err: any) {
    console.error("API Creators catch:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
