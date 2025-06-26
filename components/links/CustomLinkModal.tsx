"use client";

import { FC, useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCircleX } from "@intentui/icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customLinkSchema } from "@/utils/schemas";
import { Form } from "react-aria-components";
import { TextField } from "@/components/ui/text-field";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/field";
import { useDebounce } from "@/hooks/useDebounce";
import {
  checkSlugAvailability,
  createCustomLink,
} from "@/actions/link.actions";
import { useAction } from "next-safe-action/hooks";
import { DatePicker } from "@/components/ui/date-picker";
import { today } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { User } from "@supabase/supabase-js";
import { Loader } from "@/components/ui/loader";

interface CustomLinkModalProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomLinkModal: FC<CustomLinkModalProps> = ({
  user,
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customLinkSchema),
    defaultValues: {
      slug: "",
      expiration: undefined,
      url: "",
      useCustomSlug: false,
      useExpiration: false,
      userId: user.id,
    },
    mode: "onSubmit",
  });

  const { useCustomSlug, useExpiration, slug } = watch();

  const { executeAsync } = useAction(checkSlugAvailability);

  const [slugStatus, setSlugStatus] = useState<
    "idle" | "pending" | "available" | "taken"
  >("idle");

  const debouncedSlug = useDebounce(slug, 500);

  const { executeAsync: createLink, isPending } = useAction(createCustomLink);

  const onSubmit = handleSubmit(async (data) => {
    if ((slugStatus == "idle" || slugStatus == "pending") && useCustomSlug)
      return;

    const res = await createLink({
      slug: data.slug,
      url: data.url,
      userId: user?.id,
      expiration: data.expiration?.toDate(getLocalTimeZone()) as any,
    });

    if (res?.data?.error) {
      toast.error(res.data.error);
      return;
    }

    if (res?.data) {
      router.push(`/share/${res.data.link}`);
    }
  });

  useEffect(() => {
    if (!debouncedSlug || !useCustomSlug) {
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("pending");

    executeAsync({ slug: debouncedSlug }).then((res) => {
      setSlugStatus(res?.data ? "available" : "taken");
    });
  }, [debouncedSlug, useCustomSlug]);

  useEffect(() => {
    if (!useCustomSlug) {
      setValue("slug", undefined);
      setSlugStatus("idle");
    }
    if (!useExpiration) setValue("expiration", undefined);
  }, [useCustomSlug, useExpiration]);

  return (
    <Modal.Content
      isBlurred
      size="sm"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isPending}
    >
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <Modal.Title>Create new link</Modal.Title>
          <Modal.Description>Setup your link custom options</Modal.Description>
        </Modal.Header>
        <Modal.Body className="space-y-5">
          <Controller
            control={control}
            name="url"
            render={({ field, fieldState }) => (
              <TextField
                label="Site URL"
                aria-label="URL"
                placeholder="https://www.google.com"
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <div className="space-y-1">
            <Controller
              control={control}
              name="useCustomSlug"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>Custom slug</Label>
                  <Switch isSelected={field.value} onChange={field.onChange} />
                </div>
              )}
            />
            {useCustomSlug && (
              <Controller
                control={control}
                name="slug"
                render={({ field, fieldState }) => (
                  <TextField
                    aria-label="Slug"
                    placeholder="my-custom-slug"
                    isInvalid={
                      fieldState.invalid ||
                      (slug !== "" && slugStatus === "taken")
                    }
                    errorMessage={
                      slugStatus === "taken"
                        ? "Slug is already taken"
                        : fieldState.error?.message
                    }
                    isPending={slugStatus === "pending"}
                    suffix={
                      slugStatus === "available" ? (
                        <IconCheck />
                      ) : slugStatus === "taken" ? (
                        <IconCircleX />
                      ) : null
                    }
                    {...field}
                  />
                )}
              />
            )}
          </div>
          <div className="space-y-1">
            <Controller
              control={control}
              name="useExpiration"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>Expiration date</Label>
                  <Switch isSelected={field.value} onChange={field.onChange} />
                </div>
              )}
            />
            {useExpiration && (
              <Controller
                control={control}
                name="expiration"
                render={({ field: { onChange, value }, fieldState }) => (
                  <DatePicker
                    aria-label="Expiration date"
                    minValue={today(getLocalTimeZone()).add({ days: 1 })}
                    maxValue={today(getLocalTimeZone()).add({ years: 2 })}
                    onChange={(date) => onChange(date)}
                    value={value}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close
            intent="secondary"
            className="w-full"
            isDisabled={isPending}
          >
            Cancel
          </Modal.Close>
          <Button className="w-full" type="submit" isPending={isPending}>
            {isPending ? <Loader /> : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};

export default CustomLinkModal;
