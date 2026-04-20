import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let browserClient: SupabaseClient | null = null;

export function hasSupabaseBrowserEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasSupabaseAdminEnv() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase browser environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }

  return browserClient;
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function tableExists(
  client: SupabaseClient,
  tableName: string,
) {
  const { error } = await client.from(tableName).select("*", {
    head: true,
    count: "exact",
  });

  return !error || !isMissingTableError(error);
}

export function isMissingTableError(error: { code?: string } | null | undefined) {
  return error?.code === "PGRST205";
}
