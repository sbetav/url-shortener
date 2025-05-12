import { z } from "zod";

export const linkSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Please enter a valid URL"),
  userId: z.string().optional(),
});

export const customLinkSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Please enter a valid URL"),
  name: z.string().optional(),
  expiration: z.string().optional(),
});
