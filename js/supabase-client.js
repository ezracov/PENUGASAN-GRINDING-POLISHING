// Sertakan library Supabase via CDN di HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);