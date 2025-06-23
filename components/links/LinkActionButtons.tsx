"use client";

import { Button } from "../ui/button";
import { IconPencilBox, IconTrash } from "@intentui/icons";
import { FC, useState } from "react";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { EditLinkModal } from "./EditLinkModal";
import { LinkType } from "@/types";
interface LinkActionButtonsProps {
  userId: string;
  link: LinkType;
}

const LinkActionButtons: FC<LinkActionButtonsProps> = ({
  userId,
  link,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Button size="small" onPress={() => setIsEditModalOpen(true)}>
        <IconPencilBox className="size-4" />
        Edit
      </Button>
      <Button
        intent="secondary"
        size="small"
        onPress={() => setIsDeleteModalOpen(true)}
      >
        <IconTrash className="size-4" />
        Delete
      </Button>
      <DeleteLinkModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        linkId={link.id}
        userId={userId}
      />
      <EditLinkModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        link={link}
      />
    </div>
  );
};

export default LinkActionButtons;
