import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { notFound, permanentRedirect } from "next/navigation";
import { FC } from "react";

interface RedirectPageProps {
  params: Promise<{ linkId: string }>;
}

const RedirectPage: FC<RedirectPageProps> = async ({ params }) => {
  const linkId = (await params).linkId;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select()
    .eq("link", linkId)
    .single<LinkType>();

  if (error) {
    notFound();
  } else {
    permanentRedirect(data.url);
  }
};

export default RedirectPage;
