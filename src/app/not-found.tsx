"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Jap = dynamic(() => import("@/components/shared/json-animation-player"), {
  ssr: false,
});

export default function NotFound() {
  return (
    <section className="max-w-lg mx-auto flex gap-10 flex-col items-center justify-center h-screen">
      <Link href="/" className="h-16">
        <Image
          className="object-contain h-full w-full dark:invert"
          src={"/logo.png"}
          alt=""
          width={400}
          height={400}
        />
      </Link>
      <div className="flex flex-col gap-5">
        <h3 className="uppercase text-center">Page Not Found!</h3>
        <div className="h-96 aspect-square mx-auto">
          <Jap animation="/animations/1.json" />
        </div>
        <div className="flex flex-col gap-3 uppercase">
          <Button asChild>
            <Link href={"/"}>Go Home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
