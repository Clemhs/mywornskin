import { createClient } from '@/lib/supabase/server';
import CreatorsClient from './CreatorsClient';

export default async function CreatorsPage() {
  const supabase = await createClient();

  const { data: creators } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, banner_url, sales_badge, frame, bio, country, city, size, shoe_size')
    .or('is_creator.eq.true,role.eq.creator')
    .order('created_at', { ascending: false });

  return <CreatorsClient initialCreators={creators || []} />;
}
