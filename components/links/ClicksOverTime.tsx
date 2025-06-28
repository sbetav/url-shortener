"use client";

import { FC, useMemo, useState } from "react";
import { Chart, type ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { LinkType } from "@/types";
import { format, startOfDay, differenceInDays } from "date-fns";
import LinkDetailWrapper from "./LinkDetailWrapper";
import { DateRangePicker } from "../ui/date-range-picker";
import {
  today,
  getLocalTimeZone,
  type DateValue,
  parseDate,
} from "@internationalized/date";
import { IconCalendarClock } from "@intentui/icons";

interface RangeValue<T> {
  start: T;
  end: T;
}

interface ClicksOverTimeProps {
  link: LinkType;
  clicks: {
    date: string;
    count: number;
  }[];
}

const ClicksOverTime: FC<ClicksOverTimeProps> = ({ link, clicks }) => {
  const [date, setDate] = useState<RangeValue<DateValue> | null>({
    start: today(getLocalTimeZone()).subtract({ days: 6 }),
    end: today(getLocalTimeZone()),
  });

  const minDate = parseDate(link.created_at.split("T")[0]);

  const isInvalid = useMemo(() => {
    if (!date || !date.start || !date.end) return false;
    const start = date.start.toDate(getLocalTimeZone());
    const end = date.end.toDate(getLocalTimeZone());
    return differenceInDays(end, start) > 13;
  }, [date]);

  const isDataAvailable = clicks.length > 0;

  const { data, dateRange } = useMemo(() => {
    if (!isDataAvailable || !date || !date.start || !date.end || isInvalid)
      return {
        data: [],
        dateRange: {
          start: date?.start
            ? date.start.toDate(getLocalTimeZone())
            : new Date(),
          end: date?.end ? date.end.toDate(getLocalTimeZone()) : new Date(),
        },
      };

    const startDate = startOfDay(date.start.toDate(getLocalTimeZone()));
    const endDate = startOfDay(date.end.toDate(getLocalTimeZone()));

    const filteredClicks = clicks.filter((click) => {
      const clickDate = startOfDay(new Date(click.date));
      return clickDate >= startDate && clickDate <= endDate;
    });

    // Create a map of clicks by date
    const clicksByDate = filteredClicks.reduce(
      (acc, click) => {
        const date = startOfDay(new Date(click.date));
        acc[date.toISOString()] = click.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const filledData = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      filledData.push({
        date: currentDate.toISOString(),
        count: clicksByDate[currentDate.toISOString()] || 0,
      });
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return {
      data: filledData.map((item) => ({
        period: format(new Date(item.date), "MMM d"),
        clicks: item.count,
      })),
      dateRange: { start: startDate, end: endDate },
    };
  }, [clicks, date, isDataAvailable, isInvalid]);

  const chartConfig = {
    clicks: {
      label: "Clicks",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <LinkDetailWrapper>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold tracking-tight">
            Clicks over time
          </p>
          <p className="text-muted-fg text-sm">
            {isInvalid
              ? "Please select a date range of 14 days or less"
              : `Daily clicks (${format(dateRange.start, "PP")} - ${format(dateRange.end, "PP")})`}
          </p>
        </div>
        {isDataAvailable ? (
          <div>
            <DateRangePicker
              aria-label="Date range"
              value={date as any}
              onChange={setDate as any}
              isInvalid={isInvalid}
              granularity="day"
              errorMessage="The selected date range cannot exceed 14 days."
            />
          </div>
        ) : (
          <IconCalendarClock className="text-muted-fg absolute top-4 right-5 size-6" />
        )}
      </div>
      {isDataAvailable ? (
        <div className="mt-5">
          <Chart className="h-[350px] w-full" config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-overlay text-overlay-fg grid min-w-[12rem] items-start gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-xl">
                      <div className="grid gap-1.5">
                        <div className="flex w-full flex-wrap items-stretch gap-2">
                          <div className="flex flex-1 items-center justify-between leading-none">
                            <span className="text-muted-fg">{data.period}</span>
                            <span className="text-fg font-mono font-medium tabular-nums">
                              {data.clicks.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="clicks"
                fill="var(--color-clicks)"
                radius={0}
                barSize={30}
                maxBarSize={50}
              />
            </BarChart>
          </Chart>
        </div>
      ) : (
        <div className="border-border bg-secondary/20 text-muted-fg mt-5 w-full rounded-md border py-2.5 text-center text-sm">
          No data available yet
        </div>
      )}
    </LinkDetailWrapper>
  );
};

export default ClicksOverTime;
