import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return Response.json(data || null);
  } catch (err: any) {
    console.error("API Profile error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
