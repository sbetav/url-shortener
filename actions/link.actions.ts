"use server";

import { LinkType } from "@/types";
import { actionClient } from "@/utils/safe-action";
import { linkSchema } from "@/utils/schemas";
import { createClient } from "@/utils/supabase/server";

import { nanoid } from "nanoid";

async function generateUniqueId(): Promise<string> {
  const supabase = await createClient();

  let shortLink: string;
  let exists: boolean;

  do {
    shortLink = nanoid(6);

    // Check if the ID already exists
    const { data } = await supabase
      .from("links")
      .select("link")
      .eq("link", shortLink)
      .single();

    exists = !!data; // If data exists, we got a duplicate
  } while (exists); // Retry if duplicate found

  return shortLink;
}

export const createLink = actionClient
  .schema(linkSchema)
  .action(async ({ parsedInput: { url, userId } }) => {
    if (!url) throw new Error("URL is required");

    const supabase = await createClient();

    const identifier = await generateUniqueId(); // Ensure uniqueness

    const { data, error } = await supabase
      .from("links")
      .insert([{ alias: identifier, url, user_id: userId }])
      .select()
      .single<LinkType>();

    if (error) throw new Error(error.message);

    return data;
  });
