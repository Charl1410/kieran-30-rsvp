import { createClient } from "@supabase/supabase-js";

// opening a connection to the supabase database using the url and anon key from the environment variables
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);