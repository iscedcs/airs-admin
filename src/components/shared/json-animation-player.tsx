"use client";
import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

export default function Jap({
  animation,
  controls,
}: {
  animation?: string;
  controls?: boolean;
}) {
  return (
    <Player
      autoplay
      loop
      src={
        animation
          ? animation
          : "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
      }
      className="h-full w-full object-contain"
    >
      <Controls
        visible={controls}
        buttons={["play", "repeat", "frame", "debug"]}
      />
    </Player>
  );
}
