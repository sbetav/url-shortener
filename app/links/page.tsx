import UserLinks from "@/components/manage-links/UserLinks";
import { LinkType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { IconChevronLeft } from "@intentui/icons";
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
      <UserLinks links={links || []} />
    </div>
  );
};

export default Page;
