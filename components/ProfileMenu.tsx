"use client";

import { FC } from "react";

import { User } from "@supabase/supabase-js";
import { singOut } from "@/actions/auth.actions";
import { IconLogout } from "@intentui/icons";
import { Menu } from "./ui/menu";
import { Avatar } from "./ui/avatar";
import { usePathname } from "next/navigation";

interface ProfileMenuProps {
  user: User | null;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ user }) => {
  const pathname = usePathname();
  return (
    <Menu>
      <Menu.Trigger
        aria-label="Profile menu"
        className="cursor-pointer transition-all hover:opacity-75"
      >
        <Avatar
          src={user?.user_metadata.avatar_url}
          initials={user?.user_metadata.name[0]}
          alt={user?.user_metadata.name}
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom" showArrow>
        <Menu.Item aria-label="Logout" onAction={() => singOut(pathname)}>
          <IconLogout />
          Logout
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};

export default ProfileMenu;
