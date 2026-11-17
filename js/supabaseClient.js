// Conexão com o Supabase.
// Estes dois valores são PÚBLICOS (podem ficar visíveis no site, é seguro).
const SUPABASE_URL = "https://srgmyopdshwozqbmvzbx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_7vw91ZdNrdIw1B-XSXw3NA_hrryxMVI";

// Cria a conexão usada por todas as páginas.
// (A biblioteca "supabase" é carregada antes, no <script> do HTML.)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
