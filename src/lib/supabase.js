import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://hmqumqqccyreorwxwrtr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_G0Ab99C6N0RCTT99H1w33Q_Wr_U5rCN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
