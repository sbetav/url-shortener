import { z } from "zod";
import { zodAlwaysRefine } from "./zodAlwaysRefine";
import { DateValue } from "@internationalized/date";

export const linkSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Please enter a valid URL"),
  userId: z.string().optional(),
});

export const customLinkSchema = zodAlwaysRefine(
  z
    .object({
      url: z
        .string()
        .url("Please enter a valid URL")
        .min(1, "Please enter a valid URL"),
      slug: z.string().optional(),
      expiration: z.custom<DateValue>().optional(),
      useCustomSlug: z.boolean().optional(),
      useExpiration: z.boolean().optional(),
      userId: z.string(),
    })
    .refine(
      (data) => {
        if (data.useCustomSlug && !data.slug) {
          return false;
        }
        return true;
      },
      {
        message: "Please enter a custom slug",
        path: ["slug"],
      },
    )
    .refine(
      (data) => {
        if (data.useExpiration && !data.expiration) {
          return false;
        }
        return true;
      },
      {
        message: "Please set an expiration date",
        path: ["expiration"],
      },
    ),
);
