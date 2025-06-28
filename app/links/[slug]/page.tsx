import ClicksOverTime from "@/components/links/ClicksOverTime";
import CountriesChart from "@/components/links/CountriesChart";
import LinkDetailWrapper from "@/components/links/LinkDetailWrapper";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/components/ui/note";
import { Separator } from "@/components/ui/separator";
import { ClickStats, LinkType } from "@/types";
import { SITE_URL } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import {
  IconCainLink3,
  IconChevronLeft,
  IconCursorClick,
} from "@intentui/icons";
import {
  differenceInHours,
  format,
  formatDistanceToNowStrict,
  isAfter,
} from "date-fns";
import { Link } from "@/components/ui/link";
import { redirect } from "next/navigation";
import { FC } from "react";
import LinkActionButtons from "@/components/links/LinkActionButtons";
import SmallCopyButton from "@/components/links/SmallCopyButton";

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

  // Fetch clicks grouped by country
  const { data: clicksData, error: clicksError } = await supabase
    .from("clicks")
    .select("country, created_at")
    .eq("link_id", data.id)
    .order("created_at", { ascending: false });

  if (clicksError) {
    console.error("Error fetching clicks:", clicksError);
  }

  // Group clicks by country and count them
  const clicksByCountry: ClickStats[] = [];
  if (clicksData) {
    const countryGroups = clicksData.reduce(
      (acc, click) => {
        const country = click.country || "unknown";
        if (!acc[country]) {
          acc[country] = {
            count: 0,
            clicks: [],
          };
        }
        acc[country].count += 1;
        acc[country].clicks.push({
          created_at: click.created_at,
        });
        return acc;
      },
      {} as Record<string, { count: number; clicks: { created_at: string }[] }>,
    );

    clicksByCountry.push(
      ...Object.entries(countryGroups).map(([country, data]) => ({
        country,
        count: data.count,
        clicks: data.clicks,
      })),
    );
  }

  const totalClicks = clicksData?.length || 0;

  const linkUrl = `${SITE_URL}/${data.slug}`;

  const totalClicksInLast24Hours = clicksData?.filter(
    (click) =>
      new Date(click.created_at).getTime() - new Date().getTime() <
      1000 * 60 * 60 * 24,
  ).length;

  const clicksByDay = clicksData?.reduce(
    (acc, click) => {
      const day = format(click.created_at, "PP");
      const existingDay = acc.find((d) => d.date === day);
      if (existingDay) {
        existingDay.count += 1;
      } else {
        acc.push({ date: day, count: 1 });
      }
      return acc;
    },
    [] as { date: string; count: number }[],
  );

  return (
    <section className="bg-bg/20 border-border my-8 w-full space-y-6 rounded-3xl border px-6 py-4 sm:px-10 sm:py-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/links"
            className="text-primary/80 hover:text-primary flex w-fit items-center transition-all"
          >
            <IconChevronLeft className="size-6" />
            <span className="text-sm">Back</span>
          </Link>
          <Separator orientation="vertical" className="h-7" />
          <p className="text-lg font-bold tracking-tight sm:text-2xl">
            {data.slug}
          </p>
          <SmallCopyButton slug={data.slug} label="Copy URL" />
        </div>

        <LinkActionButtons link={data} userId={data.user_id || ""} />
      </div>

      <Separator className="w-full" />
      <Note intent="info">
        If no activity is detected within 30 days, the link will be
        automatically deleted.
      </Note>
      <div className="flex flex-col gap-5">
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <LinkDetailWrapper>
            <div className="flex items-center justify-between">
              <p className="font-medium">Total clicks</p>
              <IconCursorClick className="text-muted-fg size-5" />
            </div>
            <p className="mt-1 text-2xl font-bold">{totalClicks}</p>
            <span className="text-muted-fg text-xs">
              {totalClicksInLast24Hours} in last 24 hours
            </span>
          </LinkDetailWrapper>
          <LinkDetailWrapper>
            <div className="flex items-center justify-between">
              <p className="font-medium">Link information</p>
              <div className="flex items-center gap-2">
                {data.expiration && (
                  <Badge intent="warning">
                    Expires{" "}
                    {isAfter(new Date(data.expiration), new Date())
                      ? differenceInHours(
                          new Date(data.expiration),
                          new Date(),
                        ) < 24
                        ? "today"
                        : formatDistanceToNowStrict(data.expiration, {
                            addSuffix: true,
                          })
                      : "today"}
                  </Badge>
                )}
                <IconCainLink3 className="text-muted-fg size-5" />
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-3 md:flex-row">
              <div className="border-border bg-secondary/60 w-full rounded-md border px-3 pt-0.5 pb-1.5">
                <span className="text-muted-fg text-xs">URL</span>
                <p className="line-clamp-1 max-w-[200px] text-sm">{linkUrl}</p>
              </div>
              <div className="border-border bg-secondary/60 w-full rounded-md border px-3 pt-0.5 pb-1.5 whitespace-nowrap">
                <span className="text-muted-fg text-xs">Expiration date</span>
                <p className="text-sm">
                  {data.expiration ? format(data.expiration, "PP") : "Never"}
                </p>
              </div>
              <div className="border-border bg-secondary/60 w-full rounded-md border px-3 pt-0.5 pb-1.5 whitespace-nowrap">
                <span className="text-muted-fg text-xs">Created at</span>
                <p className="text-sm">{format(data.created_at, "PP")}</p>
              </div>
            </div>
          </LinkDetailWrapper>
        </div>

        <CountriesChart countries={clicksByCountry} />
        {clicksByDay && <ClicksOverTime link={data} clicks={clicksByDay} />}
      </div>
    </section>
  );
};

export default Page;
