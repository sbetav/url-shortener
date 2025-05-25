import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";

interface RedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const country = headersList.get("x-vercel-ip-country") || "unknown";
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select()
    .eq("slug", slug)
    .single<LinkType>();

  if (error) {
    notFound();
  }

  // insert country into the click table
  const { error: clickError } = await supabase.from("clicks").insert({
    link_id: data.id,
    country: country,
  });

  if (clickError) {
    console.error("Error inserting click data:", clickError);
  }

  permanentRedirect(data.url);
}
