"use client";

import { updateLink } from "@/actions/link.actions";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/field";
import { TextField } from "@/components/ui/text-field";
import { LinkType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  getLocalTimeZone,
  parseDate,
  today,
  type DateValue,
} from "@internationalized/date";
import { Loader } from "@/components/ui/loader";
import { zodAlwaysRefine } from "@/utils/zodAlwaysRefine";

interface EditLinkModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  link: LinkType;
}

const editLinkSchema = zodAlwaysRefine(
  z
    .object({
      url: z.string().url(),
      expiration: z.custom<DateValue>().optional(),
      useExpiration: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.useExpiration && !data.expiration) {
          return false;
        }
        return true;
      },
      {
        message: "Please set an expiration date",
        path: ["expiration"],
      },
    ),
);

type EditLinkSchema = z.infer<typeof editLinkSchema>;

export const EditLinkModal: FC<EditLinkModalProps> = ({
  isOpen,
  onOpenChange,
  link,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EditLinkSchema>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: {
      url: link.url,
      expiration: link.expiration
        ? parseDate(new Date(link.expiration).toISOString().split("T")[0])
        : undefined,
      useExpiration: !!link.expiration,
    },
  });

  const { useExpiration } = watch();

  useEffect(() => {
    if (!useExpiration) {
      setValue("expiration", undefined);
    }
  }, [useExpiration, setValue]);

  const { execute, isExecuting } = useAction(updateLink, {
    onSuccess: () => {
      setTimeout(() => {
        onOpenChange(false);
        toast.success("Link updated successfully");
      }, 100);
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const onSubmit = (data: EditLinkSchema) => {
    if (!link.user_id) return;
    execute({
      url: data.url,
      linkId: link.id,
      userId: link.user_id,
      expiration: data.expiration?.toString() ?? null,
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Content isBlurred size="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>Edit Link</Modal.Title>
            <Modal.Description>
              Update your link details below.
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-4">
              <TextField
                label="Slug (Not changeable)"
                value={link.slug}
                isDisabled
              />
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="URL"
                    errorMessage={errors.url?.message}
                  />
                )}
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Expiration date</Label>
                  <Controller
                    name="useExpiration"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        isSelected={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {useExpiration && (
                  <Controller
                    name="expiration"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        aria-label="Expiration date"
                        minValue={today(getLocalTimeZone()).add({ days: 1 }) as any}
                        maxValue={today(getLocalTimeZone()).add({ years: 2 }) as any}
                        onChange={(date) => field.onChange(date as any)}
                        value={field.value as any}
                        isInvalid={!!errors.expiration}
                        errorMessage={errors.expiration?.message}
                      />
                    )}
                  />
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close isDisabled={isExecuting}>Cancel</Modal.Close>
            <Button type="submit" isDisabled={!isDirty || isExecuting}>
              {isExecuting && <Loader />}
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};
