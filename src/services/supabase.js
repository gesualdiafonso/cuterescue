import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vifurugyrmprstcmceol.supabase.co";
const SUPABASE_KEY = "sb_publishable_dsEf9S0D6Yc2o5gNFBPKUg_anG4MIWz";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// llamo al cliente de supabase