import { FC } from "react";
import { Button } from "@/components/ui";
import { IconPaperclip } from "justd-icons";
import Link from "next/link";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <header className="bg-secondary/20 sticky top-6 flex w-full max-w-screen items-center justify-between rounded-xl z-50 border border-white/10 py-2.5 px-3 backdrop-blur-lg">
      <Link
        href="/"
        className="flex items-center justify-center gap-0.5 transition-all hover:opacity-75"
      >
        <IconPaperclip className="size-6" />
        <span className="text-xl font-semibold tracking-tight">Shortie</span>
      </Link>

      <Button size="small">Login</Button>
    </header>
  );
};

export default Navbar;
