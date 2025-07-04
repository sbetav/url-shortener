"use client";

import { LinkType } from "@/types";
import {
  IconCheck,
  IconClipboard,
  IconDotsVertical,
  IconPin,
  IconLoader,
  IconTrash,
  IconPin2,
} from "@intentui/icons";

import { FC, useState } from "react";
import { SITE_URL } from "@/utils/constants";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { Badge } from "../ui/badge";
import { Menu } from "../ui/menu";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { formatDistanceToNowStrict, differenceInHours, isAfter } from "date-fns";
import { Link } from "../ui/link";
import { useAction } from "next-safe-action/hooks";
import { toggleLinkPin } from "@/actions/link.actions";

interface LinkCardProps {
  link: LinkType;
}

const LinkCard: FC<LinkCardProps> = ({ link }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { execute, isExecuting } = useAction(toggleLinkPin);

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
        <Link href={`/links/${link.slug}`} className="absolute inset-0 z-10" />
        <div className="relative flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {link.pinned && <IconPin2 className="text-primary size-[18px]" />}
            <p className="text-lg font-semibold tracking-tight">{link.slug}</p>

            <button
              aria-label="Copy URL"
              className="bg-primary/15 text-primary/85 hover:bg-primary/20 hover:text-primary z-20 flex cursor-pointer items-center justify-center gap-1 rounded-[5px] p-1 pr-1.5 text-xs font-medium transition-all"
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
            <Menu.Trigger
              aria-label="Link actions"
              className="hover:border-border hover:bg-secondary z-20 -mr-1 cursor-pointer rounded-full border border-transparent p-1.5 transition-all"
            >
              <IconDotsVertical />
            </Menu.Trigger>
            <Menu.Content placement="bottom">
              <Menu.Item
                aria-label="Pin link"
                onAction={() =>
                  execute({
                    linkId: link.id,
                    userId: link.user_id!,
                    pinned: !link.pinned,
                  })
                }
              >
                <IconPin />
                {isExecuting ? (
                  <IconLoader className="size-3.5 animate-spin" />
                ) : link.pinned ? (
                  "Unpin"
                ) : (
                  "Pin"
                )}
              </Menu.Item>
              <Menu.Item
                isDanger
                aria-label="Delete link"
                onAction={() => setDeleteModalOpen(true)}
              >
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
              {isAfter(new Date(link.expiration), new Date()) ? (
                differenceInHours(new Date(link.expiration), new Date()) < 24
                  ? "today"
                  : formatDistanceToNowStrict(link.expiration, { addSuffix: true })
              ) : (
                "today"
              )}
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
