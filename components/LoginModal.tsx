"use client";

import { FC, JSX } from "react";
import { IconBrandGoogle } from "@intentui/icons";
import { signInWithGoogle } from "@/actions/auth.actions";
import { Link } from "@/components/ui/link";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";

interface LoginModalProps {
  trigger?: JSX.Element;
}

const LoginModal: FC<LoginModalProps> = ({ trigger }) => {
  return (
    <Modal>
      {trigger ?? <Button size="small">Login</Button>}

      <Modal.Content size="sm" isBlurred>
        <Modal.Header>
          <Modal.Title>Sign In</Modal.Title>
          <Modal.Description>
            Enjoy of all features by signing in.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <Button size="small" onPress={signInWithGoogle}>
            <IconBrandGoogle />
            Sign in with Google
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-muted-fg w-full text-center text-sm">
            Having issues?{" "}
            <Link href="/" className="underline">
              Let me know!
            </Link>
          </p>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default LoginModal;
