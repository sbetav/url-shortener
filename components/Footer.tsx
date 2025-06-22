import { Link } from "@/components/ui/link";
import { FC } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  return (
    <footer className="border-border w-full max-w-screen items-center justify-center border-t py-5">
      <p className="text-muted-fg text-center text-sm">
        Made with ❤️ by{" "}
        <Link
          href="https://www.linkedin.com/in/santiago-betancur/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          sbetav
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
