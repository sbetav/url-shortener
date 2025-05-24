"use client";

import { FC } from "react";

import { User } from "@supabase/supabase-js";
import { singOut } from "@/actions/auth.actions";
import { IconLogout } from "@intentui/icons";
import { Menu } from "./ui/menu";
import { Avatar } from "./ui/avatar";

interface ProfileMenuProps {
  user: User | null;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ user }) => {
  return (
    <Menu>
      <Menu.Trigger className="cursor-pointer transition-all hover:opacity-75">
        <Avatar
          src={user?.user_metadata.avatar_url}
          initials={user?.user_metadata.name[0]}
          alt={user?.user_metadata.name}
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom" showArrow>
        <Menu.Item onAction={singOut}>
          <IconLogout />
          Logout
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};

export default ProfileMenu;
