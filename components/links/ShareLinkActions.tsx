"use client";

import { FC, useState } from "react";

import { IconCheck, IconClipboard } from "@intentui/icons";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  EmailIcon,
  EmailShareButton,
} from "next-share";
import { Tooltip } from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { buttonStyles } from "../ui/button";
import { copyToClipboard } from "@/utils/copy-to-clipboard";

interface ShareLinkActionsProps {
  url: string;
}

const shareButtons = [
  { Component: FacebookShareButton, Icon: FacebookIcon, name: "Facebook" },
  {
    Component: TwitterShareButton,
    Icon: TwitterIcon,
    name: "Twitter",
    customClass: "outline outline-border rounded-full",
  },
  { Component: TelegramShareButton, Icon: TelegramIcon, name: "Telegram" },
  { Component: WhatsappShareButton, Icon: WhatsappIcon, name: "WhatsApp" },
  { Component: LinkedinShareButton, Icon: LinkedinIcon, name: "LinkedIn" },
  { Component: RedditShareButton, Icon: RedditIcon, name: "Reddit" },
  { Component: EmailShareButton, Icon: EmailIcon, name: "Email" },
];

const ShareLinkActions: FC<ShareLinkActionsProps> = ({ url }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="space-y-4">
      {/* URL Copy Section */}
      <div className="flex w-full items-center justify-center gap-2 pb-2">
        <p className="bg-secondary/50 w-full truncate rounded-lg border border-white/10 px-3 py-2 transition-all hover:border-white/20">
          {url}
        </p>
        <Tooltip delay={100} closeDelay={100}>
          <Tooltip.Trigger
            aria-label="Copy"
            className={buttonStyles({ size: "square-petite" })}
            onPress={() => {
              copyToClipboard(url, false);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
          >
            {isCopied ? <IconCheck /> : <IconClipboard />}
          </Tooltip.Trigger>
          <Tooltip.Content>Copy</Tooltip.Content>
        </Tooltip>
      </div>

      {/* Separator */}
      <div className="flex w-full items-center justify-center gap-4">
        <Separator className="w-full" />
        <span className="text-muted-fg text-center text-xs font-medium tracking-wider text-nowrap uppercase">
          Share to socials
        </span>
        <Separator className="w-full" />
      </div>

      {/* Social Icons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {shareButtons.map(({ Component, Icon, name, customClass }) => (
          <Component
            key={name}
            url={url}
            className="transition-transform hover:translate-y-[-2px]"
          >
            <Icon size={28} round className={customClass} />
          </Component>
        ))}
      </div>
    </div>
  );
};

export default ShareLinkActions;
