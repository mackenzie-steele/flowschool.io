// ─── SUPABASE CLIENT ─────────────────────────────────────────────────────────
//
// Requires the self-hosted, version-pinned Supabase bundle first:
// <script src="lib/vendor/supabase-js-v2.110.7.min.js"></script>
// (pinned + served from our own origin — no CDN outage or unpinned
// upgrade can reach the auth layer; bump deliberately, in the repo)
//
// Usage on any page: import this file after the CDN script, then use `db`
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://zizuopmcpzicbwngjagp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9WOvDeVbncbedXggZ1-XFg_hFrWgihn';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
