import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const user = await currentUser();
  console.log(user);
  return (
    <main className="flex h-dvh w-full items-center justify-center">
      Hello!
    </main>
  );
};

export default Page;
