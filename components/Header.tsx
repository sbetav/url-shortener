import Link from "next/link";
import { FC } from "react";
import { IconBrandGithub, IconPaperclip } from "@intentui/icons";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <header className="bg-secondary/20 sticky top-6 z-50 flex w-full max-w-screen items-center justify-between rounded-3xl border border-white/10 px-3.5 py-2.5 backdrop-blur-lg">
      <Link
        href="/"
        className="flex items-center justify-center gap-0.5 transition-all hover:opacity-75"
      >
        <IconPaperclip className="size-6" />
        <span className="mb-[1px] text-xl font-semibold tracking-tight">
          Shortie
        </span>
      </Link>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="https://github.com/sbetav/url-shortener"
          target="_blank"
          className="bg-secondary flex size-9 items-center justify-center rounded-lg border border-white/10 transition-all hover:opacity-75"
        >
          <IconBrandGithub className="size-5" />
        </Link>

        <SignedOut>
          <SignInButton mode="modal" component="div">
            <Button size="small">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
