import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { notFound, permanentRedirect } from "next/navigation";
import { FC } from "react";

interface RedirectPageProps {
  params: Promise<{ slug: string }>;
}

const RedirectPage: FC<RedirectPageProps> = async ({ params }) => {
  const slug = (await params).slug;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select()
    .eq("slug", slug)
    .single<LinkType>();

  if (error) {
    notFound();
  } else {
    permanentRedirect(data.url);
  }
};

export default RedirectPage;
