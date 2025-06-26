"use client";

import { LinkType } from "@/types";
import {
  IconCheck,
  IconClipboard,
  IconDotsVertical,
  IconPin,
  IconTrash,
} from "@intentui/icons";

import { FC, useState } from "react";
import { SITE_URL } from "@/utils/constants";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { Badge } from "../ui/badge";
import { Menu } from "../ui/menu";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "../ui/link";

interface LinkCardProps {
  link: LinkType;
}

const LinkCard: FC<LinkCardProps> = ({ link }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  return (
    <>
      {link.user_id && (
        <DeleteLinkModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          linkId={link.id}
          userId={link.user_id}
        />
      )}
      <div className="border-border group bg-bg/20 relative w-full rounded-xl border px-4 pt-3 pb-4 transition-all hover:bg-neutral-900/40">
        <Link href={`/links/${link.slug}`} className="absolute inset-0 z-0" />
        <div className="relative z-10 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold tracking-tight">{link.slug}</p>

            <button
              aria-label="Copy URL"
              className="bg-primary text-primary-fg flex cursor-pointer items-center justify-center gap-1 rounded p-1 text-xs font-medium"
              onClick={() => {
                copyToClipboard(`${SITE_URL}/${link.slug}`, false);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
              {isCopied ? (
                <IconCheck className="size-3.5" />
              ) : (
                <IconClipboard className="size-3.5" />
              )}{" "}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <Menu>
            <Menu.Trigger className="hover:border-border hover:bg-secondary -mr-2.5 cursor-pointer rounded-full border border-transparent p-1.5 transition-all">
              <IconDotsVertical />
            </Menu.Trigger>
            <Menu.Content placement="bottom">
              <Menu.Item>
                <IconPin />
                Pin
              </Menu.Item>
              <Menu.Item isDanger onAction={() => setDeleteModalOpen(true)}>
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
      </div>
    </>
  );
};

export default LinkCard;
