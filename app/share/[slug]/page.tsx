import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FC } from "react";
import ShareLinkActions from "@/components/links/ShareLinkActions";
import { IconArrowLeft } from "@intentui/icons";
import PageConfetti from "@/components/Confetti";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Note } from "@/components/ui/note";
import { SITE_URL } from "@/utils/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page: FC<PageProps> = async ({ params }) => {
  const slug = (await params).slug;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select()
    .eq("slug", slug)
    .single<LinkType>();

  if (error) {
    redirect("/not-found");
  }

  const url = `${SITE_URL}/${data.slug}`;

  return (
    <div className="min-h-content-min-height flex w-full flex-col items-center justify-center gap-5">
      <h2 className="text-center text-4xl font-bold">Shortened URL</h2>
      <Card className="w-full max-w-sm">
        <Card.Header>
          <Card.Title>New link created! 🎉</Card.Title>
          <Card.Description>Copy and share your new link</Card.Description>
        </Card.Header>
        <Card.Content>
          <ShareLinkActions url={url} />
        </Card.Content>
        <Card.Footer>
          <Note intent="info">
            If no activity is detected within 30 days, the link will expire
            automatically.
          </Note>
        </Card.Footer>
      </Card>
      <Link
        href="/"
        className="text-primary group flex items-center justify-center gap-1"
      >
        <IconArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
        Create a new link
      </Link>
      <PageConfetti />
    </div>
  );
};

export default Page;
