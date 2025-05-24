import HomeInput from "@/components/HomeInput";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import {
  IconArrowRight,
  IconCalendarClock,
  IconChainLink,
  IconOpenLink,
  IconPieChart2,
} from "@intentui/icons";
import Link from "next/link";
import { FC } from "react";
import { LinkType } from "@/types";
import { link } from "fs";
import { cn } from "@/utils/classes";

export default async function Home() {
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
    <div className="min-h-content-min-height flex w-full items-center justify-center">
      <div className="flex w-full max-w-[450px] flex-col items-center justify-center gap-24 py-20">
        <section className="flex w-full flex-col items-center justify-center gap-6">
          <div>
            <h1 className="bg-gradient-to-r from-white to-stone-400 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              URL Shortener
            </h1>
            <p className="text-muted-fg text-center sm:text-lg md:text-xl">
              Easily shorten your URLs, no sign up required.
            </p>
          </div>
          <HomeInput user={user} />
        </section>

        {!user ? (
          <section className="flex w-full flex-col items-center justify-center gap-6">
            <div>
              <h2 className="text-center text-lg font-semibold">
                Looking for more?
              </h2>
              <p className="text-muted-fg text-center">
                Access to extra features by creating an account.
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <InsightCard title="Analytics" icon={IconPieChart2} />
              <InsightCard title="Custom links" icon={IconChainLink} />
              <InsightCard title="Expiration dates" icon={IconCalendarClock} />
            </div>

            <LoginModal
              trigger={
                <Button intent="plain" className="text-primary group">
                  Create an account
                  <IconArrowRight className="transition-all group-hover:translate-x-1" />
                </Button>
              }
            />
          </section>
        ) : (
          <section className="flex w-full flex-col items-center justify-center gap-4">
            <div>
              <h2 className="text-center text-2xl font-semibold">
                You have created {links?.length} link
                {links?.length === 1 ? "" : "s"}
              </h2>
              <p className="text-muted-fg text-center">
                {links?.length
                  ? "Here are some of your recently shortened links"
                  : "Shorten your first link to get started"}
              </p>
            </div>
            {link.length && (
              <div
                className={cn(
                  "mt-1 flex w-full flex-col items-center justify-center gap-3 sm:flex-row",
                )}
              >
                {links?.slice(0, 3).map((l) => (
                  <Link
                    key={l.id}
                    title={l.url}
                    href={`/${l.slug}`}
                    target="_blank"
                    className="border-border group flex w-full items-center justify-between rounded-xl border bg-neutral-950 px-4 py-2 transition-all hover:bg-neutral-900 sm:max-w-[220px]"
                  >
                    <p>{l.slug}</p>

                    <IconOpenLink className="text-muted-fg group-hover:text-primary size-5 transition-all" />
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/links"
              className="text-primary group flex cursor-pointer items-center justify-center gap-1 text-center"
            >
              <span>Go to my links</span>
              <IconArrowRight className="size-5 transition-all group-hover:translate-x-1" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  icon: React.FC<any>;
}

const InsightCard: FC<InsightCardProps> = ({ title, icon }) => {
  const IconComponent = icon;
  const iconProps: any = {
    className: "size-6",
  };
  return (
    <article className="bg-bg/50 border-border hover:bg-secondary/50 flex w-full flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all select-none">
      <IconComponent {...iconProps} />
      <p className="text-center text-sm font-medium text-nowrap">{title}</p>
    </article>
  );
};
