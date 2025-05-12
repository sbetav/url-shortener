"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { linkSchema } from "@/utils/schemas";
import { useAction } from "next-safe-action/hooks";
import { createLink } from "@/actions/link.actions";
import { useRouter } from "nextjs-toploader/app";
import { IconSettings } from "@intentui/icons";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Modal } from "./ui/modal";
import { Loader } from "./ui/loader";
import { User } from "@supabase/supabase-js";

interface HomeInputProps {
  user?: User | null;
}

const HomeInput: FC<HomeInputProps> = ({ user }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: "",
    },
  });

  const { executeAsync, isExecuting } = useAction(createLink);

  const onSubmit = handleSubmit(async (data) => {
    const res = await executeAsync({
      url: data.url,
      userId: user?.id,
    });

    if (res?.data) {
      reset();
      router.push(`/share/${res.data.alias}`);
    }
  });

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="relative w-full">
        <input
          autoComplete="off"
          type="url"
          disabled={isExecuting}
          placeholder="Enter URL"
          className="bg-secondary/50 ring-ring/20 focus:border-ring w-full rounded-full border border-white/10 px-5 py-3 pr-[84px] tracking-tight outline-hidden transition-all outline-none hover:border-white/20 focus:ring-4 disabled:opacity-75 disabled:hover:border-white/10 md:text-lg"
          {...register("url")}
        />
        <Button
          onPress={() => {
            onSubmit();
            if (!isValid) {
              toast.warning("Please enter a valid URL");
            }
          }}
          type="submit"
          shape="circle"
          className="absolute top-[7px] right-[7px] w-[68px]"
          isPending={isExecuting}
        >
          {!isExecuting ? "Short" : <Loader variant="spin" />}
        </Button>
      </div>

      {user && (
        <>
          <div className="flex w-full items-center justify-center gap-4">
            <Separator className="w-full" />
            <span className="text-muted-fg text-sm">Or</span>
            <Separator className="w-full" />
          </div>
          <Button intent="secondary" onPress={() => setShowModal(true)}>
            <IconSettings />
            Create a custom link
          </Button>
          <Modal isOpen={showModal} onOpenChange={setShowModal}>
            <Modal.Content isBlurred size="md">
              <Modal.Header>
                <Modal.Title>Create new link</Modal.Title>
                <Modal.Description>
                  Setup your link custom options
                </Modal.Description>
              </Modal.Header>
              <Modal.Body>Hey</Modal.Body>
              <Modal.Footer>
                <Button
                  intent="secondary"
                  className="w-full"
                  onPress={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button className="w-full">Create</Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </>
      )}
    </div>
  );
};

export default HomeInput;
