"use client";

import { FC } from "react";
import { Button } from "@/components/ui";

interface HomeInputProps {}

const HomeInput: FC<HomeInputProps> = ({}) => {
  return (
    <div className="relative w-full">
      <input
        placeholder="Enter URL"
        className="bg-secondary/50 ring-ring/20 focus:border-ring w-full rounded-full border border-white/10 px-5 py-3 pr-[84px] tracking-tight outline-hidden transition-all outline-none hover:border-white/20 focus:ring-4 md:text-lg"
      />
      <Button shape="circle" className="absolute top-[7px] right-[7px]">
        Short
      </Button>
    </div>
  );
};

export default HomeInput;
