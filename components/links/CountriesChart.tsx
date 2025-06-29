"use client";

import { FC } from "react";
import {
  Chart,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { IconArrowRight, IconLocation } from "@intentui/icons";
import { Label, Pie } from "recharts";
import { PieChart } from "recharts";
import LinkDetailWrapper from "./LinkDetailWrapper";
import { ClickStats } from "@/types";
import { cn } from "@/utils/classes";
import countries from "@/utils/countries.json";

interface CountriesChartProps {
  countries: ClickStats[];
}

const countryCodeToName = Object.fromEntries(
  (countries as { code: string; name: string }[]).map((c) => [c.code, c.name]),
);

const CountriesChart: FC<CountriesChartProps> = ({ countries }) => {
  const chartData = countries.slice(0, 5).map((country, index) => ({
    category: countryCodeToName[country.country] || country.country,
    clicks: country.count,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = {
    clicks: {
      label: "Clicks",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const isDataAvailable =
    countries.length > 0 &&
    !countries.some((country) => country.country === "unknown");

  const totalClicks = countries.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <LinkDetailWrapper className="flex items-center justify-between gap-10 md:flex-row flex-col">
      <IconLocation className="text-muted-fg absolute top-4 right-5 size-7" />

      <div
        className={cn("w-full", {
          "max-w-[300px]": isDataAvailable,
        })}
      >
        <div>
          <p className="text-xl font-semibold tracking-tight">Top countries</p>
          <p className="text-muted-fg text-sm">
            Data may not be available for all countries.
          </p>
        </div>
        {isDataAvailable ? (
          <div className="mt-3 w-full">
            <div className="md:min-h-[300px] w-full divide-y">
              {countries.slice(0, 10).map((country) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/w20/${country.country.toLowerCase()}.png`}
                      alt={`${country.country} flag`}
                      className="h-3.5 w-5 object-cover"
                    />
                    <p className="text-sm">
                      {countryCodeToName[country.country] || country.country}
                    </p>
                  </div>
                  <p className="text-sm">{country.count}</p>
                </div>
              ))}
            </div>
            {countries.length > 10 && (
              <div className="flex w-full items-center justify-center pt-4 pb-1">
                <button className="text-primary group flex cursor-pointer items-center gap-1 hover:underline">
                  View full list{" "}
                  <IconArrowRight className="size-4 transition-all group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-border bg-secondary/20 text-muted-fg mt-5 w-full rounded-md border py-2.5 text-center text-sm">
            No data available yet
          </div>
        )}
      </div>

      {isDataAvailable && (
        <div className="w-full">
          <Chart
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="clicks"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-fg text-3xl font-bold"
                          >
                            {totalClicks}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-fg"
                          >
                            {totalClicks == 1 ? "Country" : "Countries"}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </Chart>
        </div>
      )}
    </LinkDetailWrapper>
  );
};

export default CountriesChart;
