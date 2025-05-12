import HomeInput from "@/components/HomeInput";
import { currentUser } from "@clerk/nextjs/server";
import {
  IconArrowRight,
  IconCalendarClock,
  IconChainLink,
  IconPieChart2,
} from "@intentui/icons";
import Link from "next/link";
import { FC } from "react";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="min-h-content-min-height flex w-full items-center justify-center">
      <div className="flex w-full max-w-[450px] flex-col items-center justify-center gap-28 py-20">
        <section className="flex w-full flex-col items-center justify-center gap-6">
          <div>
            <h1 className="bg-gradient-to-r from-white to-stone-400 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              URL Shortener
            </h1>
            <p className="text-muted-fg text-center sm:text-lg md:text-xl">
              Easily shorten your URLs, no sign up required.
            </p>
          </div>
          <HomeInput user={null} />
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

            <div className="text-primary group flex cursor-pointer items-center justify-center gap-1 text-center">
              <span>Create an account</span>
              <IconArrowRight className="size-5 transition-all group-hover:translate-x-1" />
            </div>
          </section>
        ) : (
          <section className="flex w-full flex-col items-center justify-center gap-3">
            <h2 className="text-center text-2xl font-semibold">
              You have created 0 links
            </h2>
            <Link
              href="/my-links"
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
