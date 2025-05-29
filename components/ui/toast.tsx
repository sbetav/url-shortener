"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Toaster as ToasterPrimitive, type ToasterProps } from "sonner";

const Toast = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  return (
    <ToasterPrimitive
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast: "toast border-0! inset-ring! inset-ring-fg/10! rounded-xl!",
          title: "title",
          description: "description",
          actionButton: "bg-primary! hover:bg-primary/90! text-primary-fg!",
          cancelButton:
            "bg-transparent! hover:bg-secondary! hover:text-secondary-fg!",
          closeButton: "close-button",
          success: "!border-primary !bg-[#2F3B1A] !text-[#D6FA85]",
        },
      }}
      {...props}
    />
  );
};

export type { ToasterProps };
export { Toast };
