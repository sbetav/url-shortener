"use client";

import {
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components";

import { composeTailwindRenderProps } from "./primitive";
import { cn } from "@/utils/classes";

interface SwitchProps extends SwitchPrimitiveProps {
  ref?: React.RefObject<HTMLLabelElement>;
}
const Switch = ({ children, className, ref, ...props }: SwitchProps) => {
  return (
    <SwitchPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(
        className,
        "group inline-flex touch-none items-center sm:text-sm",
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {(values) => (
        <>
          <span
            className={cn(
              "group-invalid:ring-danger/20 group-focus:ring-ring/20 group-selected:bg-primary h-5 w-8 cursor-default rounded-full border-2 border-transparent bg-(--switch) transition duration-200 [--switch:color-mix(in_oklab,var(--color-muted)_90%,black_10%)] group-focus:ring-4 group-disabled:cursor-default group-disabled:opacity-50 dark:[--switch:color-mix(in_oklab,var(--color-muted)_85%,white_15%)]",
              {
                "mr-2": children,
              },
            )}
          >
            <span className="group-selected:bg-primary-fg group-selected:ml-3 group-pressed:w-5 group-selected:group-data-[pressed]:ml-2 block size-4 origin-right rounded-full bg-white shadow-sm transition-all duration-200 forced-colors:disabled:outline-[GrayText]" />
          </span>
          {typeof children === "function" ? children(values) : children}
        </>
      )}
    </SwitchPrimitive>
  );
};

export type { SwitchProps };
export { Switch };
