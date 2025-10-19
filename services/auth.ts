import { createClient } from "@/lib/supabase/client";

export async function login(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({
    scope: "local",
  });
  if (error) {
    throw error;
  }
}
