"use client";

import { FC } from "react";
import { Button, Loader } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { linkSchema } from "@/utils/schemas";
import { useAction } from "next-safe-action/hooks";
import { createLink } from "@/actions/links.actions";
import { useRouter } from "nextjs-toploader/app";

interface HomeInputProps {}

const HomeInput: FC<HomeInputProps> = ({}) => {
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

  const { executeAsync, isExecuting, result } = useAction(createLink);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const res = await executeAsync({
      url: data.url,
    });

    if (res?.data) {
      reset();
      router.push(`/share/${res.data.link}`);
    }
  });

  console.log(result);
  return (
    <div className="relative w-full">
      <input
        disabled={isExecuting}
        placeholder="Enter URL"
        className="bg-secondary/50 ring-ring/20 focus:border-ring w-full rounded-full border
          border-white/10 px-5 py-3 pr-[84px] tracking-tight outline-hidden transition-all
          outline-none hover:border-white/20 focus:ring-4 disabled:opacity-75
          disabled:hover:border-white/10 md:text-lg"
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
  );
};

export default HomeInput;
