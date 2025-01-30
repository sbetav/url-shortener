"use client";

import { FC } from "react";
import { Avatar, Menu } from "./ui";
import { User } from "@supabase/supabase-js";
import { singOut } from "@/actions/auth.actions";
import { IconLogout } from "justd-icons";

interface ProfileMenuProps {
  user: User | null;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ user }) => {
  return (
    <Menu>
      <Menu.Trigger>
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
