"use client";

import { Button } from "../ui/button";
import { IconPencilBox, IconTrash } from "@intentui/icons";
import { FC, useState } from "react";
import { DeleteLinkModal } from "./DeleteLinkModal";

interface LinkActionButtonsProps {
  linkId: string;
  userId: string;
}

const LinkActionButtons: FC<LinkActionButtonsProps> = ({ linkId, userId }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Button size="small">
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
        linkId={linkId}
        userId={userId}
      />
    </div>
  );
};

export default LinkActionButtons;
