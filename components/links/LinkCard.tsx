"use client";

import { LinkType } from "@/types";
import { IconTrash } from "@intentui/icons";
import { IconClipboard } from "@intentui/icons";
import Link from "next/link";
import { FC } from "react";
import { Menu } from "../ui/menu";
import { IconDotsVertical, IconPencilBox } from "@intentui/icons";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { SITE_URL } from "@/utils/constants";
import { Badge } from "../ui/badge";
import { formatDistanceToNowStrict } from "date-fns";

interface LinkCardProps {
  link: LinkType;
}

const LinkCard: FC<LinkCardProps> = ({ link }) => {
  return (
    <Link
      key={link.id}
      href={`/links/${link.slug}`}
      className="border-border group bg-bg/20 w-full rounded-xl border px-6 pt-3 pb-5 transition-all hover:bg-neutral-900/40"
    >
      <div className="flex w-full items-center justify-between">
        <p className="text-lg font-semibold tracking-tight">{link.slug}</p>
        <Menu>
          <Menu.Trigger className="hover:border-border hover:bg-secondary -mr-2.5 cursor-pointer rounded-full border border-transparent p-1.5 transition-all">
            <IconDotsVertical />
          </Menu.Trigger>
          <Menu.Content placement="bottom">
            <Menu.Item>
              <IconPencilBox />
              Edit link
            </Menu.Item>
            <Menu.Item
              onAction={() => copyToClipboard(`${SITE_URL}/${link.slug}`)}
            >
              <IconClipboard />
              Copy URL
            </Menu.Item>
            <Menu.Item isDanger>
              <IconTrash />
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </div>
      <p className="text-muted-fg mt-2 line-clamp-1 text-sm">{link.url}</p>
      <div className="mt-3 space-x-2">
        <Badge>
          {link.clickCount || 0} click{link.clickCount === 1 ? "" : "s"}
        </Badge>
        {link.expiration && (
          <Badge intent="warning">
            Expires{" "}
            {new Date(link.expiration) > new Date()
              ? formatDistanceToNowStrict(link.expiration, {
                  addSuffix: true,
                })
              : "today"}
          </Badge>
        )}
      </div>
      <div className="bg-secondary/60 border-border text-muted-fg mt-4 w-full rounded-md border px-2 py-1.5 text-center text-xs font-medium">
        Created{" "}
        {formatDistanceToNowStrict(link.created_at, {
          addSuffix: true,
        })}
      </div>
    </Link>
  );
};

export default LinkCard;
