"use client";

import { deleteLink } from "@/actions/link.actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAction } from "next-safe-action/hooks";
import { FC } from "react";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { usePathname, useRouter } from "next/navigation";

interface DeleteLinkModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  linkId: string;
  userId: string;
}

export const DeleteLinkModal: FC<DeleteLinkModalProps> = ({
  isOpen,
  onOpenChange,
  linkId,
  userId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { execute, isExecuting } = useAction(deleteLink, {
    onSuccess: () => {
      toast.success("Link deleted successfully");
      onOpenChange(false);
      if (pathname.includes("links")) {
        router.push("/links");
      }
    },
    onError: () => {
      toast.error("Failed to delete link");
    },
  });

  const handleDelete = () => {
    execute({ linkId, userId });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Content role="alertdialog" isBlurred>
        <Modal.Header>
          <Modal.Title>Delete Link</Modal.Title>
          <Modal.Description>
            Are you sure you want to delete this link? This action cannot be
            undone.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close isDisabled={isExecuting}>Cancel</Modal.Close>
          <Button
            intent="danger"
            onPress={handleDelete}
            isPending={isExecuting}
            autoFocus
          >
            {isExecuting && <Loader />}
            Delete
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
