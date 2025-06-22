"use server";

import { LinkType } from "@/types";
import { actionClient } from "@/utils/safe-action";
import { customLinkSchema, linkSchema } from "@/utils/schemas";
import { createClient } from "@/utils/supabase/server";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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
    const supabase = await createClient();

    const identifier = await generateUniqueId(); // Ensure uniqueness

    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    const { data, error } = await supabase
      .from("links")
      .insert([{ slug: identifier, url, user_id: userId }])
      .select()
      .single<LinkType>();

    if (error) {
      return {
        error: "Something went wrong",
      };
    }

    return {
      link: data.slug,
    };
  });

export const checkSlugAvailability = actionClient
  .schema(z.object({ slug: z.string() }))
  .action(async ({ parsedInput: { slug } }) => {
    if (!slug) throw new Error("Slug is required");

    const supabase = await createClient();

    const { data } = await supabase
      .from("links")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (data) return false;

    return true;
  });

export const createCustomLink = actionClient.schema(customLinkSchema).action(
  async ({
    parsedInput: {
      slug,
      url,

      expiration,
      userId,
    },
  }) => {
    const supabase = await createClient();

    // Generate random slug if none provided
    if (!slug) {
      slug = await generateUniqueId();
    }
    slug = slugify(slug, { lower: true, strict: true });

    // check if slug is available
    const isAvailable = !slug || (await checkSlugAvailability({ slug }));

    if (!isAvailable) {
      return {
        error: "Slug is already taken",
      };
    }

    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    const { data, error } = await supabase
      .from("links")
      .insert([{ slug, url, user_id: userId, expiration }])
      .select()
      .single<LinkType>();

    if (error) {
      console.log(error);
      return {
        error: "Something went wrong",
      };
    }

    return {
      link: data.slug,
    };
  },
);

export const deleteLink = actionClient
  .schema(z.object({ linkId: z.string(), userId: z.string() }))
  .action(async ({ parsedInput: { linkId, userId } }) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", linkId)
      .eq("user_id", userId);
    if (error) {
      return {
        error: "Something went wrong",
      };
    }
    revalidatePath("/");
    return {
      success: true,
    };
  });
