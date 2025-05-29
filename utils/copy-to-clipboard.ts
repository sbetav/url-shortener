import { toast } from "sonner";

export const copyToClipboard = (text: string, showToast = true) => {
  if (typeof window !== "undefined") {
    window.navigator.clipboard.writeText(text);
    if (showToast) toast.success("Copied to clipboard");
  }
};
