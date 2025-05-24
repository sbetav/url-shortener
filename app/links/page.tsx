import { Badge } from "@/components/ui/badge";
import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { IconCainLink3, IconChevronLeft } from "@intentui/icons";
import Link from "next/link";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: links } = await supabase
    .from("links")
    .select<"*", LinkType>("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-content-min-height flex flex-col items-center gap-8 py-10 md:px-10">
      <div className="w-full">
        <Link
          href="/"
          className="text-primary/80 hover:text-primary flex w-fit items-center transition-all"
        >
          <IconChevronLeft className="size-6" />
          <span className="text-sm">Back</span>
        </Link>
      </div>
      <h1 className="bg-gradient-to-r from-white to-stone-400 bg-clip-text text-center text-5xl font-semibold tracking-tight text-transparent">
        Your links
      </h1>

      {!links?.length ? (
        <p className="text-muted-fg text-center">
          You haven&apos;t created any links yet.
        </p>
      ) : (
        <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {links?.map((link) => (
            <Link
              key={link.id}
              href={`/links/${link.slug}`}
              className="border-border group w-full rounded-xl border bg-neutral-950 px-5 py-3 transition-all hover:bg-neutral-900"
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-lg font-semibold tracking-tight">
                  {link.slug}
                </p>
                <IconCainLink3 className="text-muted-fg group-hover:text-primary size-6 transition-all" />
              </div>
              <p className="text-muted-fg mt-2 line-clamp-1 text-sm">
                {link.url}
              </p>
              <div className="mt-3 space-y-2 space-x-2">
                <Badge>100 clicks</Badge>
                <Badge intent="warning">Expires in 3 days</Badge>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export default Page;
