"use server";

import { protectedRoutes } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function singOut(path: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  error && console.log(error);
  if (protectedRoutes.includes(path)) {
    redirect("/");
  }
}
