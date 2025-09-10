import { createContext } from "react";

import { SupabaseClient } from "@supabase/supabase-js";

export const SupabaseContext = createContext<SupabaseClient | null>(null);
