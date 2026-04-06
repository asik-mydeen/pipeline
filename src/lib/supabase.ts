import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://supabase-api.asikmydeen.com";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjM5NTgxLCJleHAiOjE5ODM4MTI5OTZ9.T7ywhkToD1cJ9uDVpNKAI0MOesshC6bdnFrocaAgLT8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
