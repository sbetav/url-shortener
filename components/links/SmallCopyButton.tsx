"use client";

import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { FC, useState } from "react";
import { SITE_URL } from "@/utils/constants";
import { IconCheck, IconClipboard } from "@intentui/icons";

interface SmallCopyButtonProps {
  slug: string;
  label?: string;
}

const SmallCopyButton: FC<SmallCopyButtonProps> = ({ slug, label = "Copy" }) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <button
      aria-label="Copy URL"
      className="bg-primary/15 text-primary/85 hover:bg-primary/20 hover:text-primary z-20 flex cursor-pointer items-center justify-center gap-1 rounded-[5px] p-1 pr-1.5 text-xs font-medium transition-all"
      onClick={() => {
        copyToClipboard(`${SITE_URL}/${slug}`, false);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }}
    >
      {isCopied ? (
        <IconCheck className="size-3.5" />
      ) : (
        <IconClipboard className="size-3.5" />
      )}{" "}
      {isCopied ? "Copied" : label}
    </button>
  );
};

export default SmallCopyButton;
