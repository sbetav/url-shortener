"use client";

import { FC } from "react";
import { Separator, Tooltip, buttonStyles } from "./ui";
import { IconClipboard } from "justd-icons";
import {
  FacebookIcon,
  FacebookShareButton,
  XIcon,
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
} from "react-share";
import { toast } from "sonner";

interface ShareLinkActionsProps {
  url: string;
}

const shareButtons = [
  { Component: FacebookShareButton, Icon: FacebookIcon, name: "Facebook" },
  {
    Component: TwitterShareButton,
    Icon: XIcon,
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
  const copyToClipboard = async () => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-5">
      {/* URL Copy Section */}
      <div className="flex w-full items-center justify-center gap-2">
        <p className="bg-secondary/50 w-full truncate rounded-lg border border-white/10 px-3 py-2 transition-all hover:border-white/20">
          {url}
        </p>
        <Tooltip delay={100} closeDelay={100}>
          <Tooltip.Trigger
            aria-label="Copy"
            className={buttonStyles({ size: "square-petite" })}
            onPress={copyToClipboard}
          >
            <IconClipboard />
          </Tooltip.Trigger>
          <Tooltip.Content>Copy</Tooltip.Content>
        </Tooltip>
      </div>

      {/* Separator */}
      <div className="flex w-full items-center justify-center gap-4">
        <Separator />
        <span className="text-muted-fg text-center text-xs font-medium tracking-wider text-nowrap uppercase">
          Share to socials
        </span>
        <Separator />
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
