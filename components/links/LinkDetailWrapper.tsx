import { cn } from "@/utils/classes";
import { FC } from "react";

interface LinkDetailWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const LinkDetailWrapper: FC<LinkDetailWrapperProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "border-border relative w-full items-center justify-between gap-10 rounded-lg border px-5 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default LinkDetailWrapper;
