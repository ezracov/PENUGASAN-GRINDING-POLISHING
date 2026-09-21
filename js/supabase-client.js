// Sertakan library Supabase via CDN di HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://lagjhociwnovvkolaexh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_iHdkQs1eGTwPhYqdrjb8ow_I5XPGAV3";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);