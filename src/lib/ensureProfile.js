import { supabase } from './supabase';

export async function ensureProfile(user, fullName, sobrietyDate) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!data) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName || user.email.split('@')[0],
      sobriety_date: sobrietyDate || null,
    });
  }
}
