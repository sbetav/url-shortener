import { IconArrowLeft } from "@intentui/icons";
import Link from "next/link";
import { FC } from "react";

interface notFoundProps {}

const notFound: FC<notFoundProps> = ({}) => {
  return (
    <div className="min-h-content-min-height flex w-full flex-col items-center justify-center gap-12">
      <div className="">
        <h1 className="bg-gradient-to-r from-white to-stone-400 bg-clip-text text-center text-8xl font-semibold tracking-tight text-transparent">
          404
        </h1>
        <h2 className="text-muted-fg text-center text-2xl font-medium">
          Page not found
        </h2>
      </div>
      <Link
        href="/"
        className="text-primary group flex cursor-pointer items-center justify-center gap-1 text-center"
      >
        <IconArrowLeft className="size-5 transition-all group-hover:-translate-x-1" />
        <span>Go back home</span>
      </Link>
    </div>
  );
};

export default notFound;
