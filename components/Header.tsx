import { Link } from "@/components/ui/link";
import { FC } from "react";
import { IconBrandGithub, IconPaperclip } from "@intentui/icons";
import { createClient } from "@/utils/supabase/server";
import ProfileMenu from "./ProfileMenu";
import LoginModal from "./LoginModal";
import { Separator } from "./ui/separator";

interface HeaderProps {}

const Header: FC<HeaderProps> = async ({}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className="sticky top-6 z-50 flex w-full max-w-screen items-center justify-between rounded-3xl border border-white/10 bg-bg/20 px-3.5 py-2.5 backdrop-blur-lg">
      <Link
        href="/"
        className="flex items-center justify-center gap-0.5 transition-all hover:opacity-75"
      >
        <IconPaperclip className="size-6" />
        <span className="mb-[1px] text-xl font-semibold tracking-tight">
          Shortie
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link
              href="/links"
              className="text-muted-fg hover:text-primary transition-all"
            >
              My links
            </Link>
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="https://github.com/sbetav/url-shortener"
            target="_blank"
            className="bg-secondary flex size-9 items-center justify-center rounded-lg border border-white/10 transition-all hover:opacity-75"
          >
            <IconBrandGithub className="size-5" />
          </Link>

          {!user ? <LoginModal /> : <ProfileMenu user={user} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
