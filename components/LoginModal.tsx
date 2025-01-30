"use client";

import { FC } from "react";
import { Button, Modal } from "./ui";
import { IconBrandGoogle } from "justd-icons";
import { signInWithGoogle } from "@/actions/auth.actions";
import Link from "next/link";

interface LoginModalProps {}

const LoginModal: FC<LoginModalProps> = () => {
  return (
    <Modal>
      <Button size="small">Login</Button>

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
          <p className="text-sm text-center text-muted-fg w-full">
            Having issues?{" "}
            <Link href="/" className="underline ">
              Let me know!
            </Link>
          </p>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default LoginModal;
