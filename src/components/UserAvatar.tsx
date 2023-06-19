import { User } from "next-auth";
import { FC } from "react";
import { Avatar } from "./ui/Avatar";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  const avatarUrl = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${user.name}`;
  return (
    <Avatar {...props}>
      <div className="relative aspect-square h-full w-full">
        <Image
          fill
          src={avatarUrl}
          alt="profile picture"
          referrerPolicy="no-referrer"
        />
      </div>
    </Avatar>
  );
};

export default UserAvatar;
