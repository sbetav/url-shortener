import { FC } from "react";
import { IconBrandGithub, IconPaperclip } from "justd-icons";
import Link from "next/link";
import LoginModal from "./LoginModal";
import { User } from "@supabase/supabase-js";
import ProfileMenu from "./ProfileMenu";
import { Button } from "./ui";

interface NavbarProps {
  user: User | null;
}

const Navbar: FC<NavbarProps> = ({ user }) => {
  return (
    <header className="bg-secondary/20 sticky top-6 flex w-full max-w-screen items-center justify-between rounded-xl z-50 border border-white/10 py-2.5 px-3 backdrop-blur-lg">
      <Link
        href="/"
        className="flex items-center justify-center gap-0.5 transition-all hover:opacity-75"
      >
        <IconPaperclip className="size-6" />
        <span className="text-xl font-semibold tracking-tight">Shortie</span>
      </Link>
      <div className="flex items-center justify-center gap-3">
        <Button intent="secondary" size="square-petite">
          <IconBrandGithub />
        </Button>
        {!user ? <LoginModal /> : <ProfileMenu user={user} />}
      </div>
    </header>
  );
};

export default Navbar;
