import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FC } from "react";
import { Card, Note } from "@/components/ui";
import ShareLinkActions from "@/components/ShareLinkActions";
import { IconArrowLeft } from "justd-icons";
import PageConfetti from "@/components/Confetti";
import Link from "next/link";

interface PageProps {
  params: Promise<{ linkId: string }>;
}

const Page: FC<PageProps> = async ({ params }) => {
  const linkId = (await params).linkId;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select()
    .eq("link", linkId)
    .single<LinkType>();

  if (error) {
    redirect("/not-found");
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${data.link}`;

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
