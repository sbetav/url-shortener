"use client";

import { FC } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

interface PageConfettiProps {}

const PageConfetti: FC<PageConfettiProps> = ({}) => {
  return <Fireworks autorun={{ speed: 2, duration: 1000 }} />;
};

export default PageConfetti;
